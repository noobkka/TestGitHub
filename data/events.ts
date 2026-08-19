export type EventCategory = "warp" | "event" | "bonus" | "reset" | "update";
export type GameId =
  "starrail" | "zenless" | "endfield" | "wuthering" | "nte" | "epic";

export type CalendarEvent = {
  id: string;
  title: string;
  shortTitle: string;
  titleZh?: string;
  shortTitleZh?: string;
  category: EventCategory;
  startsAt: string;
  endsAt: string;
  description: string;
  reward?: string;
  descriptionZh?: string;
  rewardZh?: string;
  sourceUrl?: string;
  verified: boolean;
  automated?: boolean;
  imageUrl?: string;
  game?: GameId;
};

// Official Version 4.4 schedule, normalized to Asia server time (UTC+8).
// Last verified against HoYoLAB on 2026-08-19.
const version44Source = "https://www.hoyolab.com/article/45851903";

export const events: CalendarEvent[] = [
  {
    id: "antigraft-brickbuster-4-4",
    title: "Antigraft Brickbuster",
    shortTitle: "Antigraft Brickbuster",
    titleZh: "反贪腐破阵战线",
    shortTitleZh: "反贪腐破阵战线",
    category: "event",
    startsAt: "2026-07-15T03:00:00.000Z",
    endsAt: "2026-08-25T19:59:00.000Z",
    description:
      "Investigate IPC corruption through a series of hacking operations. The event later moves to Conventional Memoir.",
    descriptionZh:
      "受砂金委托，通过一系列骇入行动调查公司内部的贪腐问题。限时活动结束后将收录至常时传略。",
    reward: "Stellar Jade, Self-Modeling Resin & Tracks of Destiny",
    rewardZh: "星琼、自塑尘脂与命运的足迹",
    sourceUrl: "https://www.hoyolab.com/article/45842783",
    verified: true,
  },
  {
    id: "fate-star-rail-night-4-4",
    title: "Fate/Star Rail Night",
    shortTitle: "Fate/Star Rail Night",
    titleZh: "Fate/星穹铁道之夜",
    shortTitleZh: "Fate/星穹铁道之夜",
    category: "event",
    startsAt: "2026-07-24T04:00:00.000Z",
    endsAt: "2026-08-25T19:59:00.000Z",
    description:
      "Join Rin Tohsaka in the Imagenae Holy Grail War and restore the scattered treasury.",
    descriptionZh: "与远坂凛一同参加忆质圣杯战争，收拾被打乱的王之宝库。",
    reward: "Limited collaboration rewards",
    rewardZh: "联动限定奖励",
    sourceUrl: version44Source,
    verified: true,
  },
  {
    id: "fate-gift-4-4",
    title: "Fate Gift",
    shortTitle: "Fate Gift",
    titleZh: "命运的赠礼",
    shortTitleZh: "命运的赠礼",
    category: "bonus",
    startsAt: "2026-07-24T04:00:00.000Z",
    endsAt: "2026-08-25T22:00:00.000Z",
    description:
      "Use 200 Star Rail Special Passes across Version 4.4 Warps to select one collaboration Light Cone.",
    descriptionZh:
      "在 4.4 版本跃迁中累计使用 200 张星轨专票，可自选一张联动限定五星光锥。",
    reward: "One selectable 5-star collaboration Light Cone",
    rewardZh: "自选一张联动限定五星光锥",
    sourceUrl: version44Source,
    verified: true,
  },
  {
    id: "apocalyptic-shadow-vanguard-knight",
    title: "Apocalyptic Shadow: Vanguard Knight",
    shortTitle: "Apocalyptic Shadow",
    titleZh: "末日幻影：兵锋骑士",
    shortTitleZh: "末日幻影",
    category: "reset",
    startsAt: "2026-07-19T20:00:00.000Z",
    endsAt: "2026-08-30T19:59:00.000Z",
    description:
      "Break enemies with Steadfast Safeguard to recover Skill Points and activate ally Ultimates.",
    descriptionZh: "击破拥有「坚防守备」的敌人，可恢复战技点并激活我方终结技。",
    reward: "Up to 800 Stellar Jade",
    rewardZh: "至多 800 星琼",
    sourceUrl: version44Source,
    verified: true,
  },
  {
    id: "pure-fiction-fabricated-business",
    title: "Pure Fiction: Fabricated Business",
    shortTitle: "Pure Fiction",
    titleZh: "虚构叙事：虚构生意",
    shortTitleZh: "虚构叙事",
    category: "reset",
    startsAt: "2026-08-02T20:00:00.000Z",
    endsAt: "2026-09-13T19:59:00.000Z",
    description:
      "Follow-up attacks accumulate additional Grit for every enemy target hit.",
    descriptionZh:
      "我方目标发动追加攻击后，每命中一个敌方目标都会额外积累战意值。",
    reward: "Up to 800 Stellar Jade",
    rewardZh: "至多 800 星琼",
    sourceUrl: version44Source,
    verified: true,
  },
  {
    id: "memory-of-chaos-stormcleanse",
    title: "Memory of Chaos: Stormcleanse",
    shortTitle: "Memory of Chaos",
    titleZh: "混沌回忆：涤荡风暴",
    shortTitleZh: "混沌回忆",
    category: "reset",
    startsAt: "2026-08-16T20:00:00.000Z",
    endsAt: "2026-09-27T22:00:00.000Z",
    description:
      "At each Cycle start, one Hunt or Erudition ally immediately acts and gains increased damage.",
    descriptionZh:
      "每个轮开始时，随机使一名巡猎或智识命途角色立即行动，并提高造成的伤害。",
    reward: "Up to 800 Stellar Jade",
    rewardZh: "至多 800 星琼",
    sourceUrl: version44Source,
    verified: true,
  },
];

export const categoryMeta: Record<
  EventCategory,
  { label: string; icon: string }
> = {
  warp: { label: "Warp", icon: "✦" },
  event: { label: "Event", icon: "◆" },
  bonus: { label: "Bonus", icon: "✧" },
  reset: { label: "Endgame", icon: "↻" },
  update: { label: "Update", icon: "↑" },
};

export const gameMeta: Record<
  GameId,
  { label: string; labelEn: string; short: string; logoUrl: string }
> = {
  starrail: {
    label: "崩坏：星穹铁道",
    labelEn: "Honkai: Star Rail",
    short: "星铁",
    logoUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/5a/e4/44/5ae44482-418b-a97c-2e2d-8257d8e95819/AppIcon-1x_U007emarketing-0-8-0-85-220-0.png/256x256bb.jpg",
  },
  zenless: {
    label: "绝区零",
    labelEn: "Zenless Zone Zero",
    short: "绝区零",
    logoUrl: "https://cdn.gameboost.com/games/logos/zenless-zone-zero.png",
  },
  endfield: {
    label: "明日方舟：终末地",
    labelEn: "Arknights: Endfield",
    short: "终末地",
    logoUrl: "https://cdn.gameboost.com/games/logos/arknights-endfield.png",
  },
  wuthering: {
    label: "鸣潮",
    labelEn: "Wuthering Waves",
    short: "鸣潮",
    logoUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/08/c2/96/08c29685-068f-4f5c-e622-8e44aa00b028/Client.png/256x256bb.jpg",
  },
  nte: {
    label: "异环",
    labelEn: "Neverness to Everness",
    short: "异环",
    logoUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/4a/e4/db/4ae4dba1-7a74-b0dc-329e-c6d0c6af93a5/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/256x256bb.jpg",
  },
  epic: {
    label: "Epic 免费游戏",
    labelEn: "Epic Free Games",
    short: "Epic",
    logoUrl:
      "https://images.seeklogo.com/logo-png/48/1/epic-games-store-logo-png_seeklogo-489857.png",
  },
};
