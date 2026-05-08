# SN Motion — MVP status

This document is the single source of truth for what is real, what is mocked, what is not implemented, and what is intentionally deferred in SN Motion's MVP.

If you're a non-technical user, the short version is: **the create → preview → export loop works end-to-end on your laptop, and nothing else.** Anything below that isn't listed in *What works now* should be assumed not to work.

> **Last updated:** PR #14 — *MVP stabilization + local usability*. PRs #1–#13 are merged into `main`.

---

## What works now (real logic, end-to-end)

These features are implemented with real code, run on your machine, and are covered by validation/coercion + headless smoke tests where relevant.

### Navigation & shell
- 8-section sidebar (Dashboard, Single Motion, Batch Motion, Preview, Export, Assets, Settings, Activity Log).
- Soft-pastel glassmorphism theme.
- Mobile drawer + desktop rail.
- **Desktop sidebar is collapsible** — chevron toggle, icons-only mode, hover-to-reveal labels, keyboard-friendly. Mobile drawer is unchanged.
- Last-active section is remembered across reloads (`sn-motion:section:v1`).

### Single Motion
- 3-step flow: *Motion brief* → *Scene & style* → *Video settings*.
- Real `MotionSettings` state for: motion concept text, motion type, channel/title/subtitle/final text, background type, style direction, primary/secondary color, motion intensity, duration (5/10/15/30s), aspect ratio (16:9 / 9:16 / 1:1), resolution (720p / 1080p), frame rate (24/30 fps), intro/hold/outro stage timings.
- Advanced visual color controls (collapsible block): text/background-start/background-end/accent/countdown-number/overlay/border-glow color, plus background-blur, glow-intensity, overlay-opacity. *Reset colors only* affects this block.
- **MockPreview** — instant static visual preview that reacts to every settings change.
- **Real Remotion Player preview** — `@remotion/player` rendering the `DynamicMotionComposition` with current settings, scrubbable, with a chip showing motion type · aspect · resolution · fps.
- **Stock-safety scanner** — global, warning-only. Scans channel/title/subtitle/final/concept text for risky terms; computes safety status from scanner + checklist.
- All five consumers (Single Motion fields, MockPreview, Remotion Player, Stock Safety scanner, Export summary) update reactively when settings change.

### Presets (in Settings)
- Save current motion settings as a named preset.
- Apply / rename / delete.
- localStorage persistence at `sn-motion:presets:v1`.
- Strict-but-forgiving coercion for invalid/garbage payloads (never crashes the app).
- Duplicate name handling — auto-suffix `(2)`, `(3)`, … on save; self-rename to same name allowed.
- JSON import / export to a single `sn_motion_presets.json` file.
- 36/36 unit-level coercion/validation tests + 32/32 Playwright propagation assertions passed at PR #13.

### Export (MP4)
- Single endpoint `/api/render` that runs `@remotion/renderer.renderMedia` against the dynamic composition with the current `MotionSettings`.
- Validation codes (`SETTINGS_INVALID`, `RENDER_FAILED`, `IO_ERROR`, etc.) with friendly UI mapping.
- Retry / *Render again* without losing settings.
- Files saved to `public/renders/`.
- Safe filename pattern: `SN_motion_{motion_type}_{random5}_{ddmmyyyy}.mp4`.
- Filename traversal guard on the dynamic download route `/api/render/file/[filename]`.
- Export summary card showing: motion type · duration · aspect · resolution · fps · safety status.

### Settings (legacy JSON save/load)
- Save current settings as a JSON file (`SaveLoadSettings`).
- Load a previously-saved JSON file via the hidden file picker.
- Reset to defaults.

---

## Mock / fallback (intentional UX, not real logic)

These exist in the UI to communicate the product direction but do not yet have full backing logic.

| Surface | Why it's a mock/fallback |
| --- | --- |
| **Top bar `Save settings` and `Export video` buttons** | Disabled with a "Soon" pill. The real save/load + export controls live inside their respective sections (Settings → Save/Load, Export → Export panel). The top-bar versions are placeholders for a future global affordance. |
| **MockPreview** | Real, reactive preview component — but it's a *static-style* renderer (CSS gradients, sample text, layout). It doesn't run the same animation curves the Remotion Player does. Treat it as the always-instant preview; treat the Remotion Player as the source of truth for the actual animation. |
| **Provider settings card in Settings** | Pure placeholder copy. Lists future provider-preference fields (OpenAI, Gemini, defaults). Nothing is sent or stored. No API key field. |
| **Coming-soon sections** | `BatchSection`, `AssetsSection`, `ActivityLogSection` render explanatory placeholder text only. They have no functional logic. |
| **Background type: "Image upload"** | The option is present but disabled in the picker — there is no upload pipeline. |
| **Resolution: "4K" / Frame rate: "60 fps"** | Visible in the picker but disabled. The renderer only supports 720p/1080p at 24/30 fps in this MVP. |

---

## Not implemented (no code, do not assume any of this exists)

- Asset upload (image, video).
- Audio upload / background music / tick sounds in export.
- Batch motion generation from a CSV / list / spreadsheet.
- Metadata helper (title / description / tag generator for YouTube / stock submission).
- AI / LLM integration of any kind — no OpenAI, Gemini, Anthropic, or any other provider.
- API key fields, provider settings, model picker.
- Cloud rendering — every render runs on the user's local machine.
- Automatic submission to microstock libraries.
- Visual logo / face / watermark detection.
- Hard-blocking stock safety (it stays advisory, warning-only).
- Preset marketplace.
- Built-in template packs / shared template library.
- Timeline / keyframe editor.
- Multi-user accounts, login, cloud sync, account-based presets.
- Server-side persistence of any kind. All user data lives in browser `localStorage`.

---

## Intentionally deferred

These could live in SN Motion eventually but are deliberately out of scope for the MVP. They are listed here so future PRs don't accidentally ship them under the "stabilization" label.

- **Audio support.** Adds a renderer dependency, browser permissions, and a licensing surface (music rights). Not worth it until the silent MP4 path is rock-solid.
- **Image / video upload.** Adds an asset library, storage, and rights/legal questions for stock-safety. Decoupled from MVP loop.
- **AI assist / provider settings.** Brings in API keys, billing, prompts, content moderation, network failure modes. The MVP intentionally has zero outbound calls.
- **Cloud render queue.** Requires a server (queue + workers), file storage, and the "where does the MP4 live?" UX. Local-only render keeps the trust story simple.
- **Microstock submission flow.** Each platform has its own API, file requirements, and metadata schema. Out of scope until the core motion catalog is settled.
- **Hard-blocking stock safety.** Stock safety is advisory by design — the user is the legal author. Hard blocks would create false confidence and are disproportionate to the rule-based heuristics.
- **Visual logo / face detection.** Would need a vision model (local or hosted), which contradicts the "no AI" principle and would be heavy locally.
- **Batch motion + metadata.** Real batch needs a queue, progress UI, restart-safe state, and cancellation. Metadata needs templates and tone control. Both are real features, not stabilization.
- **Timeline / keyframe editor.** Out of scope by product direction — SN Motion is *motion-first*, not editor-first.

---

## Verification covered by PR #14

PR #14 is a stabilization + documentation PR. It verifies (without changing core product behavior):

- `npm run lint` clean.
- `npm run typecheck` clean.
- `npm run build` clean.
- Core workflow: open app → edit Single Motion settings → motion type / colors flow into MockPreview + Remotion Player + Stock Safety + Export summary → save & apply preset → reach the Export section. (Headless Playwright smoke.)
- Aspect ratios 16:9, 9:16, 1:1 verified at the MockPreview + Remotion Player + Export Summary level.
- Mobile-width layout sanity check (navigation usable, Export visible, no major horizontal overflow).
- No new product features were introduced — diff is documentation + sidebar UX polish only.

---

## Where to look when something breaks

- **App won't start / blank page** — see *Help* in the [README](./README.md).
- **Stale local state** — `localStorage.clear()` in browser console + reload. Keys used: `sn-motion:settings:v1`, `sn-motion:section:v1`, `sn-motion:presets:v1`, `sn-motion:sidebar-collapsed:v1`.
- **Render error** — terminal running `npm run dev` shows the underlying Remotion error.
- **Export file disappeared** — check `public/renders/`. Files persist on disk until you delete them.
