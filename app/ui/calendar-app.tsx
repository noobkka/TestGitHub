"use client";
import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent, EventCategory, GameId } from "@/data/events";
import { categoryMeta, gameMeta } from "@/data/events";

type Language = "en" | "zh";
type Server = "Asia" | "Europe" | "America";
const categories: EventCategory[] = ["warp", "event", "bonus", "reset"];
const games: GameId[] = [
  "starrail",
  "zenless",
  "endfield",
  "wuthering",
  "nte",
  "epic",
];
const serverZones: Record<Server, string> = {
  Asia: "Asia/Shanghai",
  Europe: "Europe/Berlin",
  America: "America/New_York",
};
const copy = {
  en: {
    schedule: "Schedule",
    about: "About",
    server: "Server",
    language: "Language",
    hero1: "Never miss",
    hero2: "the next departure.",
    intro:
      "Events, warps, resets, and rewards — translated to your time, all in one place.",
    active: "Active now",
    coming: "Coming up",
    serverTime: "server time",
    journey: "YOUR JOURNEY",
    eventSchedule: "Event schedule",
    agenda: "Agenda",
    calendar: "Timeline",
    all: "All events",
    previewTitle: "Official Version 4.4 schedule",
    previewText:
      "In-game event dates are verified against official HoYoLAB notices. The current dataset follows the Asia server schedule.",
    happening: "Happening now",
    events: "events",
    next: "Next departures",
    startsIn: "Starts in",
    official: "Official source",
    preview: "Schedule preview",
    ended: "Ended",
    left: "left",
    footer:
      "A fan-made schedule for Trailblazers. Not affiliated with HoYoverse.",
    hoyolab: "Official HoYoLAB",
    month: "Aug 17 — Sep 16",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    servers: { Asia: "Asia", Europe: "Europe", America: "America" },
    cats: {
      warp: "Warp",
      event: "In-game event",
      bonus: "Reward",
      reset: "Endgame",
      update: "Update",
    },
  },
  zh: {
    schedule: "日程",
    about: "关于",
    server: "服务器",
    language: "语言",
    hero1: "不错过每一次",
    hero2: "星穹旅程。",
    intro: "活动、跃迁、重置与奖励——自动转换为你的时间，一站掌握。",
    active: "正在进行",
    coming: "即将开始",
    serverTime: "服务器时间",
    journey: "你的旅程",
    eventSchedule: "活动日程",
    agenda: "日程",
    calendar: "时间轴",
    all: "全部活动",
    previewTitle: "4.4 版本官方日程",
    previewText:
      "游戏内活动日期均已对照 HoYoLAB 官方公告核实，当前数据以亚洲服务器日程为准。",
    happening: "正在进行",
    events: "项活动",
    next: "即将启程",
    startsIn: "距开始",
    official: "官方来源",
    preview: "日程预览",
    ended: "已结束",
    left: "剩余",
    footer: "为开拓者制作的非官方日程，与 HoYoverse 无关联。",
    hoyolab: "官方 HoYoLAB",
    month: "8 月 17 日 — 9 月 16 日",
    weekdays: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    servers: { Asia: "亚洲", Europe: "欧洲", America: "美洲" },
    cats: {
      warp: "卡池",
      event: "游戏活动",
      bonus: "福利奖励",
      reset: "高难玩法",
      update: "更新",
    },
  },
} as const;

function formatDate(value: string, zone: string, lang: Language) {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: lang === "en",
    timeZone: zone,
  }).format(new Date(value));
}
function remaining(end: string, now: number, lang: Language) {
  const ms = +new Date(end) - now;
  if (ms <= 0) return copy[lang].ended;
  const d = Math.floor(ms / 86400000),
    h = Math.floor((ms % 86400000) / 3600000);
  return lang === "zh"
    ? d
      ? `${d}天 ${h}小时${copy.zh.left}`
      : `${h}小时${copy.zh.left}`
    : d
      ? `${d}d ${h}h left`
      : `${h}h left`;
}
function localEvent(e: CalendarEvent, lang: Language) {
  return {
    title: lang === "zh" ? e.titleZh || e.title : e.title,
    shortTitle: lang === "zh" ? e.shortTitleZh || e.shortTitle : e.shortTitle,
    description:
      lang === "zh" ? e.descriptionZh || e.description : e.description,
    reward: lang === "zh" ? e.rewardZh || e.reward : e.reward,
  };
}
function EventCard({
  event,
  now,
  zone,
  lang,
}: {
  event: CalendarEvent;
  now: number;
  zone: string;
  lang: Language;
}) {
  const t = copy[lang],
    e = localEvent(event, lang),
    meta = categoryMeta[event.category];
  return (
    <article className={`event-card category-${event.category}`}>
      <div className="event-card-top">
        <span className="event-kind">
          <i>{meta.icon}</i>
          {t.cats[event.category]}
        </span>
        <span className="remaining">{remaining(event.endsAt, now, lang)}</span>
      </div>
      <h3>{e.title}</h3>
      <p>{e.description}</p>
      {e.reward && (
        <div className="reward">
          <span>✦</span>
          {e.reward}
        </div>
      )}
      <div className="event-footer">
        <span>{formatDate(event.endsAt, zone, lang)}</span>
        <span className={event.verified ? "verified" : "preview"}>
          {event.verified
            ? t.official
            : lang === "zh"
              ? "自动同步"
              : "Auto-synced"}
        </span>
      </div>
    </article>
  );
}

export default function CalendarApp({
  events,
  syncedAt,
  usingFallback,
}: {
  events: CalendarEvent[];
  syncedAt: string;
  usingFallback: boolean;
}) {
  const [now, setNow] = useState(+new Date("2026-08-19T12:00:00+08:00")),
    [disabledCategories, setDisabledCategories] = useState<Set<EventCategory>>(
      () => new Set(),
    ),
    [selectedGames, setSelectedGames] = useState<Set<GameId>>(
      () => new Set(games),
    ),
    [server, setServer] = useState<Server>("Asia"),
    [view, setView] = useState<"agenda" | "calendar">("calendar"),
    [lang, setLang] = useState<Language>("zh");
  useEffect(() => {
    const saved = localStorage.getItem("astral-language-v2");
    if (saved === "en" || saved === "zh") setLang(saved);
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    localStorage.setItem("astral-language-v2", lang);
  }, [lang]);
  const visible = useMemo(
      () =>
        events
          .filter(
            (e) =>
              !disabledCategories.has(e.category) &&
              selectedGames.has(e.game || "starrail") &&
              +new Date(e.endsAt) > now,
          )
          .sort((a, b) => +new Date(a.endsAt) - +new Date(b.endsAt)),
      [events, disabledCategories, selectedGames, now],
    ),
    active = visible.filter((e) => +new Date(e.startsAt) <= now),
    upcoming = visible.filter((e) => +new Date(e.startsAt) > now),
    zone = serverZones[server],
    t = copy[lang];
  const toggleCategory = (category: EventCategory) =>
    setDisabledCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  const toggleGame = (game: GameId) =>
    setSelectedGames((current) => {
      const next = new Set(current);
      if (next.has(game)) next.delete(game);
      else next.add(game);
      return next;
    });
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top">
          <span className="brand-mark">✦</span>
          <span>
            Astral <b>Calendar</b>
          </span>
        </a>
        <nav>
          <a className="active" href="#schedule">
            {t.schedule}
          </a>
          <a href="#about">{t.about}</a>
        </nav>
        <div className="header-controls">
          <label className="language-picker">
            <span>{t.language}</span>
            <button
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              aria-label={
                lang === "en" ? "切换到简体中文" : "Switch to English"
              }
            >
              {lang === "en" ? "简体中文" : "EN"}
            </button>
          </label>
          <label className="server-picker">
            {t.server}
            <select
              value={server}
              onChange={(e) => setServer(e.target.value as Server)}
            >
              {(Object.keys(serverZones) as Server[]).map((s) => (
                <option value={s} key={s}>
                  {t.servers[s]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>
      <section className="hero" id="top">
        <div className="eyebrow">
          <span /> MULTI-GAME EVENT CALENDAR
        </div>
        <h1>
          {lang === "zh" ? "一个时间轴，" : "One timeline,"}
          <br />
          <em>{lang === "zh" ? "看遍所有旅程。" : "every adventure."}</em>
        </h1>
        <p>
          {lang === "zh"
            ? "星铁、绝区零、终末地、鸣潮、异环与 Epic 免费游戏，集中在同一条时间轴。"
            : "Five live-service games and Epic free games in one shared timeline."}
        </p>
        <div className="hero-stats">
          <div>
            <strong>{active.length}</strong>
            <span>{t.active}</span>
          </div>
          <div>
            <strong>{upcoming.length}</strong>
            <span>{t.coming}</span>
          </div>
          <div>
            <strong>{t.servers[server]}</strong>
            <span>
              {formatDate(new Date(now).toISOString(), zone, lang)}{" "}
              {t.serverTime}
            </span>
          </div>
        </div>
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="star star-one">✦</div>
        <div className="star star-two">✧</div>
      </section>
      <section className="schedule" id="schedule">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{t.journey}</span>
            <h2>{t.eventSchedule}</h2>
          </div>
          <div className="view-toggle">
            <button
              className={view === "agenda" ? "selected" : ""}
              onClick={() => setView("agenda")}
            >
              ☷ <span>{t.agenda}</span>
            </button>
            <button
              className={view === "calendar" ? "selected" : ""}
              onClick={() => setView("calendar")}
            >
              ▦ <span>{t.calendar}</span>
            </button>
          </div>
        </div>
        <div
          className="game-filters"
          aria-label={lang === "zh" ? "游戏筛选" : "Game filters"}
        >
          <button
            className={selectedGames.size === games.length ? "selected" : ""}
            aria-pressed={selectedGames.size === games.length}
            onClick={() =>
              setSelectedGames((current) =>
                current.size === games.length ? new Set() : new Set(games),
              )
            }
          >
            {lang === "zh" ? "全部游戏" : "Select all"}
          </button>
          {games.map((game) => {
            const selected = selectedGames.has(game);
            return (
              <button
                key={game}
                className={`game-${game} ${selected ? "selected" : ""}`}
                aria-pressed={selected}
                onClick={() => toggleGame(game)}
              >
                <img
                  className="game-logo"
                  src={gameMeta[game].logoUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                />
                {lang === "zh" ? gameMeta[game].label : gameMeta[game].labelEn}
              </button>
            );
          })}
        </div>
        <div
          className="filters"
          aria-label={lang === "zh" ? "活动类型筛选" : "Event type filters"}
        >
          {categories.map((c) => {
            const enabled = !disabledCategories.has(c);
            return (
              <button
                key={c}
                className={enabled ? "selected" : ""}
                aria-pressed={enabled}
                onClick={() => toggleCategory(c)}
              >
                {t.cats[c]}
              </button>
            );
          })}
        </div>
        <div className="notice">
          <span>{usingFallback ? "!" : "↻"}</span>
          <p>
            <strong>
              {usingFallback
                ? lang === "zh"
                  ? "正在使用备用数据"
                  : "Using fallback data"
                : lang === "zh"
                  ? "每日自动同步"
                  : "Daily automatic sync"}
            </strong>{" "}
            —{" "}
            {usingFallback
              ? lang === "zh"
                ? "实时数据源暂时不可用，当前显示最近一次人工核实的日程。"
                : "The live feed is unavailable; showing the latest hand-verified schedule."
              : lang === "zh"
                ? "活动、跃迁与高难玩法每天自动更新一次。"
                : "Events, Warps, and challenges refresh automatically once per day."}{" "}
            <small>
              {lang === "zh" ? "同步于" : "Synced"}{" "}
              {formatDate(syncedAt, zone, lang)}
            </small>
          </p>
        </div>
        {view === "agenda" ? (
          <>
            <div className="group-title">
              <h3>{t.happening}</h3>
              <span>
                {active.length} {t.events}
              </span>
            </div>
            <div className="card-grid">
              {active.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  now={now}
                  zone={zone}
                  lang={lang}
                />
              ))}
            </div>
            <div className="group-title upcoming-title">
              <h3>{t.next}</h3>
              <span>
                {upcoming.length} {t.events}
              </span>
            </div>
            <div className="timeline">
              {upcoming.map((event) => {
                const e = localEvent(event, lang);
                return (
                  <article className="timeline-item" key={event.id}>
                    <div className={`timeline-icon category-${event.category}`}>
                      {categoryMeta[event.category].icon}
                    </div>
                    <div className="timeline-copy">
                      <span>{formatDate(event.startsAt, zone, lang)}</span>
                      <h3>{e.title}</h3>
                      <p>{e.description}</p>
                    </div>
                    <div className="timeline-meta">
                      <span>{t.cats[event.category]}</span>
                      <strong>
                        {t.startsIn}{" "}
                        {remaining(event.startsAt, now, lang).replace(
                          lang === "zh" ? "剩余" : " left",
                          "",
                        )}
                      </strong>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <HorizontalTimeline events={visible} zone={zone} lang={lang} now={now} />
        )}
      </section>
      <footer id="about">
        <div className="brand">
          <span className="brand-mark">✦</span>
          <span>
            Astral <b>Calendar</b>
          </span>
        </div>
        <p>{t.footer}</p>
        <a
          href="https://www.hoyolab.com/official/8/events"
          target="_blank"
          rel="noreferrer"
        >
          {t.hoyolab} ↗
        </a>
      </footer>
    </main>
  );
}

function HorizontalTimeline({
  events,
  zone,
  lang,
  now,
}: {
  events: CalendarEvent[];
  zone: string;
  lang: Language;
  now: number;
}) {
  const t = copy[lang],
    dayWidth = 58,
    current = new Date(now),
    dateParts = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(current),
    currentYear = Number(dateParts.find((p) => p.type === "year")?.value),
    currentMonth = Number(dateParts.find((p) => p.type === "month")?.value) - 1,
    currentDay = Number(dateParts.find((p) => p.type === "day")?.value),
    start = Date.UTC(currentYear, currentMonth, 1),
    totalDays = 62,
    end = start + totalDays * 86400000;
  const rangeEnd = new Date(end - 86400000),
    rangeLabel = lang === "zh"
      ? `${currentMonth + 1} 月 1 日 — ${rangeEnd.getUTCMonth() + 1} 月 ${rangeEnd.getUTCDate()} 日`
      : `${current.toLocaleDateString("en", { month: "short", timeZone: zone })} 1 — ${rangeEnd.toLocaleDateString("en", { month: "short", timeZone: zone })} ${rangeEnd.getUTCDate()}`;
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
  } | null>(null);
  useEffect(() => {
    if (!selectedImage) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
    };
    document.addEventListener("keydown", close);
    document.body.classList.add("lightbox-open");
    return () => {
      document.removeEventListener("keydown", close);
      document.body.classList.remove("lightbox-open");
    };
  }, [selectedImage]);
  const days = Array.from(
    { length: totalDays },
    (_, i) => new Date(start + i * 86400000),
  );
  const rows = events.filter(
    (e) => +new Date(e.startsAt) < end && +new Date(e.endsAt) > start,
  );
  return (
    <>
      <div className="range-timeline">
        <div className="range-title">
          <span>{rangeLabel}</span>
          <small>
            {lang === "zh"
              ? "左右滑动查看全部日期"
              : "Scroll horizontally to see every day"}
          </small>
        </div>
        <div className="range-scroll">
          <div
            className="range-board"
            style={
              {
                "--days": totalDays,
                "--day-width": `${dayWidth}px`,
              } as React.CSSProperties
            }
          >
            <div className="range-header">
              <div className="range-label-head">
                {lang === "zh" ? "活动" : "Event"}
              </div>
              <div className="range-days">
                {days.map((day) => (
                  <div
                    className={
                      day.getUTCDate() === currentDay &&
                      day.getUTCMonth() === currentMonth &&
                      day.getUTCFullYear() === currentYear
                        ? "today"
                        : ""
                    }
                    key={day.toISOString()}
                  >
                    <b>{day.getUTCDate()}</b>
                    <span>
                      {lang === "zh"
                        ? `${day.getUTCMonth() + 1}月`
                        : day.toLocaleDateString("en", { weekday: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {rows.map((event) => {
              const item = localEvent(event, lang),
                eventStart = Math.max(+new Date(event.startsAt), start),
                eventEnd = Math.min(+new Date(event.endsAt), end),
                left = ((eventStart - start) / 86400000) * dayWidth,
                width = Math.max(
                  dayWidth * 0.45,
                  ((eventEnd - eventStart) / 86400000) * dayWidth,
                );
              return (
                <div className="range-row" key={event.id}>
                  <div className="range-label">
                    {event.imageUrl ? (
                      <button
                        className={`range-thumb category-${event.category}`}
                        onClick={() =>
                          setSelectedImage({
                            src: event.imageUrl!,
                            title: item.title,
                          })
                        }
                        aria-label={`${lang === "zh" ? "查看图片" : "View image"}: ${item.title}`}
                      >
                        <i>{categoryMeta[event.category].icon}</i>
                        <img
                          src={event.imageUrl}
                          alt=""
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </button>
                    ) : (
                      <span
                        className={`range-thumb category-${event.category}`}
                      >
                        <i>{categoryMeta[event.category].icon}</i>
                      </span>
                    )}
                    <a
                      className="range-source"
                      href={event.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      title={t.official}
                    >
                      <span
                        className={`game-badge game-${event.game || "starrail"}`}
                      >
                        <img
                          src={gameMeta[event.game || "starrail"].logoUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                        {gameMeta[event.game || "starrail"].short}
                      </span>
                      <strong>{item.shortTitle}</strong>
                      <small>{t.cats[event.category]} ↗</small>
                    </a>
                  </div>
                  <div className="range-track">
                    <div
                      className={`range-bar category-${event.category}`}
                      style={{ left, width }}
                      title={`${item.title} · ${formatDate(event.startsAt, zone, lang)} — ${formatDate(event.endsAt, zone, lang)}`}
                    >
                      <span>
                        {formatDate(event.startsAt, zone, lang)} →{" "}
                        {formatDate(event.endsAt, zone, lang)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {selectedImage && (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.title}
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="lightbox-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={() => setSelectedImage(null)}
              aria-label={lang === "zh" ? "关闭图片" : "Close image"}
            >
              ×
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              referrerPolicy="no-referrer"
            />
            <p>{selectedImage.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
