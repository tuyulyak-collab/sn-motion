# SN Motion

Soft pastel **motion template generator** built on top of [Remotion](https://www.remotion.dev/) and Next.js. SN Motion is a beginner-friendly app for creating reusable motion videos without complex timeline editing.

The MVP ships with one polished template: **YouTube Countdown Intro**.

## What you can do

- Browse a template gallery (with locked previews of upcoming templates).
- Customize the YouTube Countdown Intro template:
  - Channel name, main title, subtitle, final text
  - Countdown length (5 / 10 / 15 / 30 seconds)
  - Video size (16:9 YouTube · 9:16 Shorts/TikTok/Reels · 1:1 Square)
  - Theme (Soft Pastel Glass, Modern Gradient, Neon Dark, Clean Minimal, Bold Creator)
  - Primary & secondary colors
  - Background type, countdown style, music, tick sound
- See a live preview that updates while you type.
- Describe your intro in plain English and apply the description to supported settings.
- Export an MP4 with a deterministic, frame-based animation.
- Save and load settings as a small JSON file.

## Install

```bash
npm install
```

> Server-side MP4 rendering uses Chromium via `@remotion/renderer`. On first export the renderer downloads its required browser binaries automatically.

## Run

```bash
npm run dev
```

Open <http://localhost:3000>.

## Preview

The live preview uses Remotion Player and updates automatically when you change any setting. Use **Play preview / Pause / Restart** in the preview card.

## Export video

Click **Export MP4** in the Export card. The app calls the local `/api/render` route which renders the selected composition with `@remotion/renderer` and saves the MP4 to `public/renders/`. Once the render completes, click **Download video**.

The default filename follows the pattern:

```
SN_motion_countdown_{random5}_{ddmmyyyy}.mp4
```

Example:

```
SN_motion_countdown_A7K2Q_07052026.mp4
```

## Save / load settings

- **Save settings** downloads the current configuration as JSON.
- **Load settings** reads a previously-saved JSON file.
- **Reset** restores the default values.

## Project structure

```
src/
  app/
    page.tsx              # main UI
    layout.tsx            # global layout, fonts, theme
    api/render/route.ts   # MP4 render endpoint
    globals.css
  components/             # UI cards (Header, Gallery, Customize, Preview, Render, Prompt, Save/Load)
  lib/                    # filename generator, prompt parser, settings storage
  remotion/
    Root.tsx              # composition registry
    index.ts              # Remotion entry point
    schemas/              # Zod schemas + defaults
    templates/
      YouTubeCountdownIntro.tsx
remotion.config.ts        # Remotion CLI defaults
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Run the Next.js app in development mode |
| `npm run build` | Build the production app |
| `npm run start` | Run the production app |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run remotion:studio` | Open the Remotion Studio against the SN Motion compositions (advanced) |

## Tech stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Remotion + `@remotion/player` + `@remotion/renderer` + `@remotion/bundler`
- Zod for schema-validated settings

## Notes

- The prompt mode in this MVP uses a rule-based parser. It only writes into supported template fields — it never generates arbitrary code.
- Music and uploaded image backgrounds are placeholders in this release; they appear in the UI but are not yet wired up beyond the schema. The template is designed so they can be added without any UI redesign.
