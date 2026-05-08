# SN Motion

A soft-pastel **motion video generator** for short, beginner-friendly intros, countdowns, lower-thirds, and other YouTube-style motion clips. SN Motion is **motion-first**: you describe the motion you want, adjust simple sliders and pickers, watch a real-time preview, and export an MP4 — no timeline editor, no AI calls, no asset uploads required.

It's built on Next.js (App Router) and [Remotion](https://www.remotion.dev/).

---

## Quick start (5 minutes, zero code)

You'll need [Node.js 18 or newer](https://nodejs.org/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). If `node --version` prints something like `v18.x` or higher, you're ready.

```bash
# 1. Get the code
git clone https://github.com/tuyulyak-collab/sn-motion.git
cd sn-motion

# 2. Install dependencies (one time only — takes ~1 minute)
npm install

# 3. Start the local app
npm run dev
```

When you see `▲ Next.js 14 ... Local: http://localhost:3000`, open that URL in your browser. That's it.

> **First-time export note:** the very first time you export an MP4, Remotion downloads a Chromium browser binary (~200 MB) it uses to render. This is one-off and stays on your laptop afterwards.

---

## Day-to-day commands

| What you want | Command |
| --- | --- |
| Run the local app (recommended for editing) | `npm run dev` |
| Build the production app (faster, less debug info) | `npm run build` |
| Run the production build you just built | `npm run start` |
| Open the **Remotion Studio** (advanced) | `npm run remotion:studio` |
| Lint check | `npm run lint` |
| TypeScript type-check | `npm run typecheck` |

`npm run dev` and `npm run start` both serve the app on `http://localhost:3000`. `dev` mode reloads the browser automatically when you change files; `start` mode runs the optimized production build.

---

## Use the app from your phone (same Wi-Fi)

You don't need to deploy anything. SN Motion can run on your laptop and be opened from your phone over the same Wi-Fi network.

1. **Make sure your laptop and phone are on the same Wi-Fi network.**
2. **Find your laptop's local IP address:**
   - **macOS:** open *System Settings* → *Wi-Fi* → *Details* → look for *IP Address* (e.g. `192.168.1.42`).
   - **Windows:** open *Settings* → *Network & Internet* → *Wi-Fi* → click the active network → look for *IPv4 address*.
   - **Linux:** run `hostname -I` in a terminal and use the first value.
3. **Start the app bound to all network interfaces:**
   ```bash
   npm run dev -- -H 0.0.0.0
   ```
   (Or `npm run start -- -H 0.0.0.0` if you've already built it.)
4. **On your phone**, open a browser and go to `http://YOUR_LAPTOP_IP:3000` — for example `http://192.168.1.42:3000`.

**Tips:**
- If your phone can't reach the page, your laptop's firewall may be blocking port 3000. On macOS, allow incoming connections for Node when prompted; on Windows, allow Node through Windows Defender Firewall; on Linux, ensure UFW (or your firewall of choice) allows TCP port 3000 on your local network.
- **Keep your laptop awake while you render.** MP4 export runs entirely on your laptop. If the laptop sleeps mid-render, the render stops.
- Public Wi-Fi networks (cafés, airports) often block device-to-device traffic. Use your home/office Wi-Fi or a personal hotspot.

---

## How rendering works

When you click **Export MP4** in the Export section, the app calls a local API route at `/api/render` which uses `@remotion/renderer` to produce the video. Rendered files land in:

```
public/renders/
```

The download button in the Export section streams that file back through `/api/render/file/[filename]`, so you can save it just like any other browser download.

The default filename pattern is:

```
SN_motion_{motion_type}_{random5}_{ddmmyyyy}.mp4
# e.g. SN_motion_countdown_A7K2Q_07052026.mp4
```

Old renders stay on disk until you delete them — feel free to clean `public/renders/` periodically. The folder is committed empty (with a `.gitkeep`) and rendered MP4s are git-ignored, so you won't accidentally commit large videos.

---

## Remotion Studio (optional, advanced)

If you want to inspect or tweak the underlying Remotion compositions outside of SN Motion's UI, run:

```bash
npm run remotion:studio
```

This opens Remotion's own studio (typically at `http://localhost:3001` or another port that the CLI prints) so you can scrub through the timeline, inspect props, and tweak the dynamic composition. **You don't need this to use SN Motion** — the regular app already gives you a real Remotion Player preview and an MP4 exporter.

---

## What's in the app

The left sidebar (or the hamburger menu on mobile) has the navigation. The desktop sidebar can be **collapsed to icons-only** with the small chevron at the bottom — hover any icon to see its label.

| Section | What it does |
| --- | --- |
| **Dashboard** | Project overview and quick-start links. |
| **Single Motion** | Main creation flow — describe the motion, pick a motion type, choose colors, length, aspect ratio, and watch the live Remotion preview. |
| **Batch Motion** | Placeholder. Not implemented in this MVP. |
| **Preview** | Full-size live preview of your current motion. |
| **Export** | Render and download an MP4. |
| **Assets** | Placeholder. Not implemented in this MVP. |
| **Settings** | Save/load JSON settings; manage **Presets** (your own saved motion configurations). |
| **Activity Log** | Placeholder. Not implemented in this MVP. |

Stock-safety guidance is **always on** in Single Motion. It's a global, warning-only checklist — not a hard block — and it never sends data anywhere.

---

## Known limitations (read this!)

SN Motion is a lean MVP. On purpose, it does **not** include any of the following:

- **No asset upload** — no image, video, or audio file uploads. The motion is generated entirely from text + colors + sliders.
- **No audio track** — exports are silent. Add music in your video editor afterwards.
- **No batch rendering** — one motion at a time. Batch Motion is a placeholder.
- **No metadata helper** — no automatic title/description/tag generator.
- **No AI / LLM integration** — no OpenAI / Gemini / Anthropic / etc. No provider settings, no API key fields. The app never makes outbound AI calls.
- **No cloud rendering** — every export happens on your local machine. Your laptop must be awake during the render.
- **No automatic microstock submission.** Stock safety is **guidance only — not a legal guarantee**. There's no visual logo detection. You are still responsible for confirming you have the rights to any text, brand, font, or trademark you put into a motion before submitting it to a stock library.
- **No preset marketplace, no built-in template packs.** Presets are *your own* saved motion configurations and are stored locally in your browser only.

If you need any of these, SN Motion is not the right tool yet — and that's OK. See [`MVP_STATUS.md`](./MVP_STATUS.md) for a precise breakdown of what's implemented vs. mocked vs. deferred.

---

## Project structure (high level)

```
src/
  app/
    page.tsx                    # main UI shell
    layout.tsx                  # global layout, fonts, theme
    api/render/route.ts         # MP4 render endpoint
    api/render/file/[filename]/ # safe download stream
    globals.css
  components/
    AppShell.tsx                # sidebar + topbar + main slot
    Sidebar.tsx                 # collapsible desktop rail / mobile drawer
    PresetsPanel.tsx            # Presets in Settings
    sections/                   # one component per sidebar section
    single-motion/              # 3-step Single Motion flow + preview + scanner
    ExportPanel.tsx             # render + download UI
  lib/
    motionSettings.ts           # settings type, defaults, helpers
    presets.ts                  # preset save/load/validate (localStorage)
    stockSafety.ts              # stock-safety scanner + checklist
    settingsStorage.ts          # legacy JSON settings save/load
  remotion/
    Root.tsx                    # composition registry
    DynamicMotionComposition.tsx
    schemas/                    # Zod schemas
    templates/                  # countdown intro composition
public/renders/                 # rendered MP4 output (git-ignored)
remotion.config.ts              # Remotion CLI defaults
```

---

## Tech stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS (soft-pastel glassmorphism)
- Remotion + `@remotion/player` (preview) + `@remotion/renderer` (MP4 export) + `@remotion/bundler`
- Zod for schema-validated legacy settings; custom strict-but-forgiving coercion for presets

---

## Help

- App won't start? Make sure you ran `npm install` once. Delete `node_modules/` and re-run if dependencies look corrupted.
- Browser shows a blank page? Open the browser console (F12) and look for an error — usually a stale `localStorage` value. You can run `localStorage.clear()` in the console and refresh.
- Export fails? Look at the terminal where `npm run dev` is running — render errors print there. The first export also downloads a Chromium binary, which can take a minute on slow connections.
- Phone can't see the laptop? Same Wi-Fi + firewall + `-H 0.0.0.0` — see [Use the app from your phone](#use-the-app-from-your-phone-same-wi-fi).
