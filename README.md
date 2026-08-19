# Astral Calendar

A fan-made Honkai: Star Rail event calendar built with Next.js and ready for Vercel Hobby.

## Local development

```bash
pnpm install
pnpm dev
```

## Updating events

Edit `data/events.ts`. Store timestamps in UTC, link every verified entry to an official HoYoLAB or HoYoverse notice, and set `verified: true` only after checking the source.

## Deploying

Import this repository into Vercel. The default Next.js settings require no changes.
