"use client";

import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent, EventCategory } from "@/data/events";
import { categoryMeta } from "@/data/events";

const categories: Array<EventCategory | "all"> = ["all", "warp", "event", "bonus", "reset"];
const serverZones = { Asia: "Asia/Shanghai", Europe: "Europe/Berlin", America: "America/New_York" } as const;
type Server = keyof typeof serverZones;

function formatDate(value: string, zone?: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: zone,
  }).format(new Date(value));
}

function remaining(end: string, now: number) {
  const ms = new Date(end).getTime() - now;
  if (ms <= 0) return "Ended";
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  return days ? `${days}d ${hours}h left` : `${hours}h left`;
}

function EventCard({ event, now, zone }: { event: CalendarEvent; now: number; zone: string }) {
  const meta = categoryMeta[event.category];
  return (
    <article className={`event-card category-${event.category}`}>
      <div className="event-card-top">
        <span className="event-kind"><i>{meta.icon}</i>{meta.label}</span>
        <span className="remaining">{remaining(event.endsAt, now)}</span>
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      {event.reward && <div className="reward"><span>✦</span>{event.reward}</div>}
      <div className="event-footer">
        <span>{formatDate(event.endsAt, zone)}</span>
        <span className={event.verified ? "verified" : "preview"}>{event.verified ? "Official source" : "Schedule preview"}</span>
      </div>
    </article>
  );
}

export default function CalendarApp({ events }: { events: CalendarEvent[] }) {
  const [now, setNow] = useState(new Date("2026-08-19T12:00:00+08:00").getTime());
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const [server, setServer] = useState<Server>("Asia");
  const [view, setView] = useState<"agenda" | "calendar">("agenda");

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const visible = useMemo(() => events
    .filter((event) => category === "all" || event.category === category)
    .filter((event) => new Date(event.endsAt).getTime() > now)
    .sort((a, b) => +new Date(a.endsAt) - +new Date(b.endsAt)), [events, category, now]);
  const active = visible.filter((event) => +new Date(event.startsAt) <= now);
  const upcoming = visible.filter((event) => +new Date(event.startsAt) > now);
  const zone = serverZones[server];

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Astral Calendar home">
          <span className="brand-mark">✦</span><span>Astral <b>Calendar</b></span>
        </a>
        <nav aria-label="Main navigation">
          <a className="active" href="#schedule">Schedule</a><a href="#about">About</a>
        </nav>
        <label className="server-picker">Server
          <select value={server} onChange={(e) => setServer(e.target.value as Server)}>
            {Object.keys(serverZones).map((name) => <option key={name}>{name}</option>)}
          </select>
        </label>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span></span> HONKAI: STAR RAIL</div>
        <h1>Never miss<br /><em>the next departure.</em></h1>
        <p>Events, warps, resets, and rewards — translated to your time, all in one place.</p>
        <div className="hero-stats">
          <div><strong>{active.length}</strong><span>Active now</span></div>
          <div><strong>{upcoming.length}</strong><span>Coming up</span></div>
          <div><strong>{server}</strong><span>{formatDate(new Date(now).toISOString(), zone)} server time</span></div>
        </div>
        <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="star star-one">✦</div><div className="star star-two">✧</div>
      </section>

      <section className="schedule" id="schedule">
        <div className="section-heading">
          <div><span className="section-kicker">YOUR JOURNEY</span><h2>Event schedule</h2></div>
          <div className="view-toggle" aria-label="View">
            <button className={view === "agenda" ? "selected" : ""} onClick={() => setView("agenda")}>☷ <span>Agenda</span></button>
            <button className={view === "calendar" ? "selected" : ""} onClick={() => setView("calendar")}>▦ <span>Calendar</span></button>
          </div>
        </div>
        <div className="filters">
          {categories.map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item === "all" ? "All events" : categoryMeta[item].label}</button>)}
        </div>

        <div className="notice"><span>i</span><p><strong>Preview schedule</strong> — event records marked “Schedule preview” demonstrate the calendar and should be replaced as new official notices are published.</p></div>

        {view === "agenda" ? (
          <>
            <div className="group-title"><h3>Happening now</h3><span>{active.length} events</span></div>
            <div className="card-grid">{active.map((event) => <EventCard key={event.id} event={event} now={now} zone={zone} />)}</div>
            <div className="group-title upcoming-title"><h3>Next departures</h3><span>{upcoming.length} events</span></div>
            <div className="timeline">
              {upcoming.map((event) => <article className="timeline-item" key={event.id}>
                <div className={`timeline-icon category-${event.category}`}>{categoryMeta[event.category].icon}</div>
                <div className="timeline-copy"><span>{formatDate(event.startsAt, zone)}</span><h3>{event.title}</h3><p>{event.description}</p></div>
                <div className="timeline-meta"><span>{categoryMeta[event.category].label}</span><strong>Starts in {remaining(event.startsAt, now).replace(" left", "")}</strong></div>
              </article>)}
            </div>
          </>
        ) : <MonthView events={visible} zone={zone} />}
      </section>

      <footer id="about"><div className="brand"><span className="brand-mark">✦</span><span>Astral <b>Calendar</b></span></div><p>A fan-made schedule for Trailblazers. Not affiliated with HoYoverse.</p><a href="https://www.hoyolab.com/official/8/events" target="_blank" rel="noreferrer">Official HoYoLAB ↗</a></footer>
    </main>
  );
}

function MonthView({ events, zone }: { events: CalendarEvent[]; zone: string }) {
  const days = Array.from({ length: 35 }, (_, i) => i + 3);
  return <div className="month-view"><div className="month-title"><button aria-label="Previous month">‹</button><h3>August 2026</h3><button aria-label="Next month">›</button></div><div className="weekdays">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <span key={d}>{d}</span>)}</div><div className="month-grid">{days.map((day) => { const date = day > 31 ? day - 31 : day; const inMonth = day <= 31; const dayEvents = inMonth ? events.filter(e => new Date(e.startsAt).getUTCDate() === date || (new Date(e.startsAt).getUTCDate() < date && new Date(e.endsAt).getUTCDate() >= date)) : []; return <div className={`${!inMonth ? "muted-day" : ""} ${date === 19 && inMonth ? "today" : ""}`} key={day}><span>{date}</span>{dayEvents.slice(0, 2).map(e => <small className={`category-${e.category}`} key={e.id} title={`${e.title} · ${formatDate(e.endsAt, zone)}`}>{e.shortTitle}</small>)}</div>; })}</div></div>;
}
