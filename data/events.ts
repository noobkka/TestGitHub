export type EventCategory = "warp" | "event" | "bonus" | "reset" | "update";

export type CalendarEvent = {
  id: string;
  title: string;
  shortTitle: string;
  category: EventCategory;
  startsAt: string;
  endsAt: string;
  description: string;
  reward?: string;
  sourceUrl?: string;
  verified: boolean;
};

// Representative records for the product preview. Replace or extend these as
// official announcements are published; all timestamps are stored in UTC.
export const events: CalendarEvent[] = [
  {
    id: "pure-fiction-aug-2026",
    title: "Pure Fiction rotation",
    shortTitle: "Pure Fiction",
    category: "reset",
    startsAt: "2026-08-17T04:00:00.000Z",
    endsAt: "2026-09-28T03:59:00.000Z",
    description: "A new Pure Fiction period is available. Clear stages before the rotation ends.",
    reward: "Up to 800 Stellar Jade",
    verified: false,
  },
  {
    id: "simulated-universe-weekly-34",
    title: "Simulated Universe weekly reset",
    shortTitle: "SU weekly reset",
    category: "reset",
    startsAt: "2026-08-17T04:00:00.000Z",
    endsAt: "2026-08-24T03:59:00.000Z",
    description: "Earn this week’s point rewards before the Monday server reset.",
    reward: "Weekly point rewards",
    verified: false,
  },
  {
    id: "echo-of-war-weekly-34",
    title: "Echo of War weekly attempts",
    shortTitle: "Echo of War",
    category: "reset",
    startsAt: "2026-08-17T04:00:00.000Z",
    endsAt: "2026-08-24T03:59:00.000Z",
    description: "Use up to three weekly challenge attempts before reset.",
    reward: "Weekly boss materials",
    verified: false,
  },
  {
    id: "nameless-honor-preview",
    title: "Nameless Honor period",
    shortTitle: "Nameless Honor",
    category: "event",
    startsAt: "2026-08-05T03:00:00.000Z",
    endsAt: "2026-09-14T19:59:00.000Z",
    description: "Complete daily and weekly missions to raise your Honor level.",
    reward: "Passes, fuel & materials",
    verified: false,
  },
  {
    id: "planar-fissure-preview",
    title: "Planar Fissure",
    shortTitle: "Planar Fissure",
    category: "bonus",
    startsAt: "2026-08-21T04:00:00.000Z",
    endsAt: "2026-08-28T03:59:00.000Z",
    description: "Claim double Planar Ornament rewards for a limited number of runs.",
    reward: "Double Planar Ornaments",
    verified: false,
  },
  {
    id: "warp-phase-preview",
    title: "Character Event Warp — Phase 2",
    shortTitle: "Phase 2 Warp",
    category: "warp",
    startsAt: "2026-08-26T04:00:00.000Z",
    endsAt: "2026-09-15T06:59:00.000Z",
    description: "Limited character and Light Cone event warps enter their second phase.",
    verified: false,
  },
  {
    id: "garden-of-plenty-preview",
    title: "Garden of Plenty",
    shortTitle: "Garden of Plenty",
    category: "bonus",
    startsAt: "2026-09-02T04:00:00.000Z",
    endsAt: "2026-09-09T03:59:00.000Z",
    description: "Receive double rewards from Calyx challenges during the event.",
    reward: "Double Calyx rewards",
    verified: false,
  },
];

export const categoryMeta: Record<EventCategory, { label: string; icon: string }> = {
  warp: { label: "Warp", icon: "✦" },
  event: { label: "Event", icon: "◆" },
  bonus: { label: "Double rewards", icon: "✧" },
  reset: { label: "Reset", icon: "↻" },
  update: { label: "Update", icon: "↑" },
};
