# SN Motion

Soft pastel **motion video generator** built on top of [Remotion](https://www.remotion.dev/) and Next.js. SN Motion is a beginner-friendly app for creating motion videos without complex timeline editing — describe a motion idea, adjust video settings, preview, and export.

## Workflow

SN Motion is **motion-first**, not template-first. The user always controls the motion: describe → adjust → preview → export. Optional motion-type starters (e.g. YouTube Countdown Intro) are available inside Single Motion as Quick Start chips, but they are not fixed templates.

## What you can do

- Describe a motion idea in plain English and have the description fill in supported settings.
- Adjust the video settings of a single motion:
  - Channel name, main title, subtitle, final text
  - Length (5 / 10 / 15 / 30 seconds)
  - Video size (16:9 YouTube · 9:16 Shorts/TikTok/Reels · 1:1 Square)
  - Theme (Soft Pastel Glass, Modern Gradient, Neon Dark, Clean Minimal, Bold Creator)
  - Primary & secondary colors
  - Background type, countdown style, music, tick sound
- See a live preview that updates while you type.
- Export an MP4 with a deterministic, frame-based animation.
- Save and load settings as a small JSON file.

## Navigation

SN Motion is organised around a soft pastel sidebar (drawer on mobile) with **eight sections**. Dashboard is the default view.

| Section | What it does |
| --- | --- |
| **Dashboard** | Overview of your motion project — current motion, video size, length, and quick-start CTAs. |
| **Single Motion** | Main creation flow. Describe a motion idea, optionally pick a Quick Start motion type (e.g. YouTube Countdown Intro), then adjust video settings. |
| **Batch Motion** | Coming soon — prepare multiple motion videos from a simple text or CSV file. |
| **Preview** | Watch your video before exporting (live preview powered by Remotion Player). |
| **Export** | Render and download your video as an MP4. |
| **Assets** | Coming soon — manage images, audio, and backgrounds in one place. |
| **Settings** | Save / load your settings as JSON, reset to defaults, and (later) manage provider settings. |
| **Activity Log** | Coming soon — beginner-friendly history of generations and exports. |

Sidebar state (which section you were last on) is remembered across reloads.

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
