import type { CalendarEvent, EventCategory, GameId } from "@/data/events";
import { events as fallbackEvents } from "@/data/events";
import { endfieldEvents } from "@/data/endfield-events";
import { additionalGameEvents } from "@/data/additional-game-events";

const SOURCES = {
  starrail: "https://api.ennead.cc/mihoyo/starrail/calendar",
  zenless: "https://api.ennead.cc/mihoyo/zenless/calendar",
};
const SOURCE_URLS = {
  starrail: "https://sr.mihoyo.com/news/165210?type=activity",
  zenless: "https://zzz.mihoyo.com/news/165273?category=280",
};
const EVENT_SOURCE_OVERRIDES: Record<string, string> = {
  恰浪花逐夏而至: "https://zzz.mihoyo.com/news/165266",
};
type Reward = { name: string; amount: number; icon?: string };
type ApiItem = {
  id: number;
  name: string;
  description?: string;
  image_url?: string | null;
  type_name?: string;
  start_time: number | null;
  end_time: number | null;
  rewards?: Reward[];
  special_reward?: Reward | null;
  polychrome?: number;
};
type BannerUnit = { name: string; rarity: number; icon?: string };
type BannerItem = ApiItem & {
  version?: string;
  characters?: BannerUnit[];
  light_cones?: BannerUnit[];
  agents?: BannerUnit[] | string;
  w_engines?: BannerUnit[] | string;
};
type ApiCalendar = {
  events: ApiItem[];
  banners: BannerItem[];
  challenges: ApiItem[];
};
type EpicOffer = {
  startDate: string;
  endDate: string;
  discountSetting: { discountPercentage: number };
};
type EpicGame = {
  id: string;
  title: string;
  description: string;
  productSlug?: string;
  urlSlug?: string;
  keyImages?: { type: string; url: string }[];
  promotions?: {
    promotionalOffers?: { promotionalOffers: EpicOffer[] }[];
    upcomingPromotionalOffers?: { promotionalOffers: EpicOffer[] }[];
  };
};

const iso = (unix: number) => new Date(unix * 1000).toISOString();
function rewardText(item: ApiItem) {
  if (item.polychrome) return `菲林 ×${item.polychrome}`;
  return (
    (item.rewards || [])
      .filter((r) => r.amount > 0)
      .slice(0, 3)
      .map((r) => `${r.name} ×${r.amount}`)
      .join("、") || undefined
  );
}
function units(item: BannerItem) {
  for (const value of [
    item.characters,
    item.light_cones,
    item.agents,
    item.w_engines,
  ])
    if (Array.isArray(value) && value.length) return value;
  return [];
}
function bannerName(item: BannerItem, game: GameId) {
  const names = units(item)
    .filter((x) => x.rarity === 5 || x.rarity === 6)
    .map((x) => x.name);
  return (
    names.join(" · ") ||
    `${item.version || "?"} ${game === "zenless" ? "调频" : "跃迁"}`
  );
}
function bannerImage(item: BannerItem) {
  const list = units(item);
  return (
    list.find((x) => (x.rarity === 5 || x.rarity === 6) && x.icon)?.icon ||
    list.find((x) => x.icon)?.icon
  );
}
function categoryFor(item: ApiItem): EventCategory {
  return item.type_name === "ActivityTypeDouble" ? "bonus" : "event";
}

async function fetchGame(game: "starrail" | "zenless") {
  const [zhResponse, enResponse] = await Promise.all([
    fetch(`${SOURCES[game]}?lang=zh-cn`, {
      next: { revalidate: 86400, tags: ["game-calendar"] },
      signal: AbortSignal.timeout(8000),
    }),
    fetch(`${SOURCES[game]}?lang=en`, {
      next: { revalidate: 86400, tags: ["game-calendar"] },
      signal: AbortSignal.timeout(8000),
    }),
  ]);
  if (!zhResponse.ok || !enResponse.ok)
    throw new Error(`${game} feed unavailable`);
  const zh = (await zhResponse.json()) as ApiCalendar,
    en = (await enResponse.json()) as ApiCalendar;
  const enEvents = new Map(en.events.map((x) => [x.id, x])),
    enBanners = new Map(en.banners.map((x, i) => [x.id || i, x])),
    enChallenges = new Map(en.challenges.map((x) => [x.id, x]));
  const mappedEvents = zh.events
    .filter((x) => x.start_time && x.end_time)
    .map((x) => {
      const other = enEvents.get(x.id) || x;
      return {
        id: `${game}-event-${x.id}`,
        game,
        title: other.name,
        shortTitle: other.name,
        titleZh: x.name,
        shortTitleZh: x.name,
        category: categoryFor(x),
        startsAt: iso(x.start_time!),
        endsAt: iso(x.end_time!),
        description: other.description || other.name,
        descriptionZh: x.description || x.name,
        reward: rewardText(other),
        rewardZh: rewardText(x),
        imageUrl: x.image_url || other.image_url || x.special_reward?.icon,
        sourceUrl: EVENT_SOURCE_OVERRIDES[x.name] || SOURCE_URLS[game],
        verified: false,
        automated: true,
      } satisfies CalendarEvent;
    });
  const mappedBanners = zh.banners
    .filter((x) => x.start_time && x.end_time && x.end_time > 0)
    .map((x, i) => {
      const other = enBanners.get(x.id || i) || x;
      return {
        id: `${game}-banner-${x.id || i}`,
        game,
        title: bannerName(other, game),
        shortTitle: bannerName(other, game),
        titleZh: bannerName(x, game),
        shortTitleZh: bannerName(x, game),
        category: "warp" as const,
        startsAt: iso(x.start_time!),
        endsAt: iso(x.end_time!),
        description: `Version ${x.version || ""}`,
        descriptionZh: `${x.version || ""} 版本${game === "zenless" ? "限定调频" : "限定跃迁"}`,
        imageUrl: bannerImage(x) || bannerImage(other),
        sourceUrl: SOURCE_URLS[game],
        verified: false,
        automated: true,
      } satisfies CalendarEvent;
    });
  const mappedChallenges = zh.challenges
    .filter((x) => x.start_time && x.end_time)
    .map((x) => {
      const other = enChallenges.get(x.id) || x;
      return {
        id: `${game}-challenge-${x.id}`,
        game,
        title: other.name,
        shortTitle: other.name,
        titleZh: x.name,
        shortTitleZh: x.name,
        category: "reset" as const,
        startsAt: iso(x.start_time!),
        endsAt: iso(x.end_time!),
        description: other.name,
        descriptionZh: x.name,
        reward: rewardText(other),
        rewardZh: rewardText(x),
        imageUrl:
          x.special_reward?.icon || x.rewards?.find((r) => r.icon)?.icon,
        sourceUrl: SOURCE_URLS[game],
        verified: false,
        automated: true,
      } satisfies CalendarEvent;
    });
  return [...mappedEvents, ...mappedBanners, ...mappedChallenges];
}
async function fetchEpicGames(): Promise<CalendarEvent[]> {
  const response = await fetch(
    "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=zh-CN&country=SG&allowCountries=SG",
    {
      next: { revalidate: 21600, tags: ["game-calendar"] },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) throw new Error("Epic promotions unavailable");
  const payload = (await response.json()) as {
    data: { Catalog: { searchStore: { elements: EpicGame[] } } };
  };
  return payload.data.Catalog.searchStore.elements.flatMap((game) => {
    const groups = [
      ...(game.promotions?.promotionalOffers || []),
      ...(game.promotions?.upcomingPromotionalOffers || []),
    ];
    return groups.flatMap((group) =>
      group.promotionalOffers
        .filter((offer) => offer.discountSetting.discountPercentage === 0)
        .map(
          (offer, index) =>
            ({
              id: `epic-${game.id}-${index}-${offer.startDate}`,
              game: "epic" as const,
              title: game.title,
              shortTitle: game.title,
              titleZh: game.title,
              shortTitleZh: game.title,
              category: "bonus" as const,
              startsAt: offer.startDate,
              endsAt: offer.endDate,
              description:
                game.description || "Free to claim on Epic Games Store.",
              descriptionZh:
                game.description || "可在 Epic Games Store 限时免费领取。",
              reward: "Free game",
              rewardZh: "限时免费领取",
              imageUrl:
                game.keyImages?.find((image) => image.type === "OfferImageWide")
                  ?.url || game.keyImages?.[0]?.url,
              sourceUrl: `https://store.epicgames.com/zh-CN/p/${(game.productSlug || game.urlSlug || "").replace(/\/home$/, "")}`,
              verified: true,
              automated: true,
            }) satisfies CalendarEvent,
        ),
    );
  });
}
export async function getCalendarEvents(): Promise<{
  events: CalendarEvent[];
  syncedAt: string;
  usingFallback: boolean;
}> {
  const results = await Promise.allSettled([
    fetchGame("starrail"),
    fetchGame("zenless"),
    fetchEpicGames(),
  ]);
  const starrail =
    results[0].status === "fulfilled"
      ? results[0].value
      : fallbackEvents.map((e) => ({ ...e, game: "starrail" as const }));
  const zenless = results[1].status === "fulfilled" ? results[1].value : [];
  const epic = results[2].status === "fulfilled" ? results[2].value : [];
  return {
    events: [
      ...starrail,
      ...zenless,
      ...endfieldEvents,
      ...additionalGameEvents,
      ...epic,
    ].sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt)),
    syncedAt: new Date().toISOString(),
    usingFallback: results.some((r) => r.status === "rejected"),
  };
}
