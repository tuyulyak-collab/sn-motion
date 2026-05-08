import { NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import os from "os";

import {
  dynamicMotionPropsSchema,
  type DynamicMotionProps,
} from "@/remotion/dynamic/dynamicMotionSchema";
import {
  DYNAMIC_MOTION_COMPOSITION_ID,
  dynamicMotionDimensions,
  dynamicMotionDurationInFrames,
  safeFrameRate,
} from "@/remotion/dynamic/dynamicMotionConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PUBLIC_RENDERS_DIR = path.join(process.cwd(), "public", "renders");

const sanitizeFilename = (name: string): string => {
  const base = (name ?? "")
    .toString()
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .slice(-160);
  if (!base) return "sn_motion_export.mp4";
  return base.toLowerCase().endsWith(".mp4") ? base : `${base}.mp4`;
};

// Walk filename collisions in `public/renders/` so a brand-new export never
// overwrites an existing file on disk. The random5 token in the default
// filename already makes collisions extremely unlikely; this is defence in
// depth for repeated identical filenames.
const ensureUniqueOutputPath = async (
  dir: string,
  filename: string,
): Promise<{ filename: string; outPath: string }> => {
  let candidate = filename;
  const dot = candidate.lastIndexOf(".");
  const stem = dot >= 0 ? candidate.slice(0, dot) : candidate;
  const ext = dot >= 0 ? candidate.slice(dot) : ".mp4";
  let counter = 1;
  for (let i = 0; i < 50; i++) {
    const outPath = path.join(dir, candidate);
    try {
      await fs.access(outPath);
    } catch {
      return { filename: candidate, outPath };
    }
    counter += 1;
    candidate = `${stem}_${counter}${ext}`;
  }
  const fallback = `${stem}_${Date.now()}${ext}`;
  return { filename: fallback, outPath: path.join(dir, fallback) };
};

export async function POST(req: NextRequest) {
  let parsedProps: DynamicMotionProps;
  let requestedFilename: string;
  try {
    const body = await req.json();
    parsedProps = dynamicMotionPropsSchema.parse(body?.props ?? {});
    requestedFilename = sanitizeFilename(
      typeof body?.filename === "string" && body.filename.length > 0
        ? body.filename
        : "sn_motion_export.mp4",
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bad request.";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    await fs.mkdir(PUBLIC_RENDERS_DIR, { recursive: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Output folder error.";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const { filename: outFilename, outPath } = await ensureUniqueOutputPath(
    PUBLIC_RENDERS_DIR,
    requestedFilename,
  );

  const props = parsedProps;
  const fps = safeFrameRate(props.frameRate);
  const dim = dynamicMotionDimensions(props.aspectRatio, props.resolution);
  const durationInFrames = dynamicMotionDurationInFrames(
    props.durationSeconds,
    fps,
  );

  let bundleLocation: string | undefined;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      let closed = false;
      const send = (event: object) => {
        if (closed) return;
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      };

      try {
        const { bundle } = await import("@remotion/bundler");
        const {
          selectComposition,
          renderMedia,
        } = await import("@remotion/renderer");

        send({ type: "progress", progress: 0.02, stage: "preparing" });

        bundleLocation = await bundle({
          entryPoint: path.join(process.cwd(), "src", "remotion", "index.ts"),
          outDir: path.join(os.tmpdir(), `sn-motion-bundle-${Date.now()}`),
          webpackOverride: (cfg) => cfg,
        });

        send({ type: "progress", progress: 0.15, stage: "preparing" });

        const composition = await selectComposition({
          serveUrl: bundleLocation,
          id: DYNAMIC_MOTION_COMPOSITION_ID,
          inputProps: props,
        });

        send({ type: "progress", progress: 0.25, stage: "rendering" });

        await renderMedia({
          serveUrl: bundleLocation,
          composition: {
            ...composition,
            width: dim.width,
            height: dim.height,
            fps,
            durationInFrames,
          },
          codec: "h264",
          outputLocation: outPath,
          inputProps: props,
          overwrite: false,
          onProgress: ({ progress }) => {
            const overall = 0.25 + Math.max(0, Math.min(1, progress)) * 0.7;
            send({ type: "progress", progress: overall, stage: "rendering" });
          },
        });

        send({ type: "progress", progress: 0.99, stage: "rendering" });
        send({
          type: "done",
          downloadUrl: `/renders/${encodeURIComponent(outFilename)}`,
          filename: outFilename,
          width: dim.width,
          height: dim.height,
          fps,
          durationInFrames,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Render failed.";
        send({ type: "error", error: message });
        // Best-effort cleanup of any partial output file so the user never
        // ends up with a half-written MP4 in public/renders/.
        try {
          await fs.rm(outPath, { force: true });
        } catch {
          /* ignore cleanup error */
        }
      } finally {
        closed = true;
        if (bundleLocation) {
          fs.rm(bundleLocation, { recursive: true, force: true }).catch(() => {
            /* ignore cleanup error */
          });
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
