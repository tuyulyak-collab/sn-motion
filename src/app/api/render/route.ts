import { NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import os from "os";
import {
  countdownIntroSchema,
  compositionIdForAspectRatio,
} from "@/remotion/schemas/countdownSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PUBLIC_RENDERS_DIR = path.join(process.cwd(), "public", "renders");

const sanitizeFilename = (name: string): string => {
  const base = name.replace(/[^A-Za-z0-9._-]/g, "_").slice(-160);
  return base.endsWith(".mp4") ? base : `${base}.mp4`;
};

export async function POST(req: NextRequest) {
  let bundleLocation: string | undefined;
  try {
    const body = await req.json();
    const props = countdownIntroSchema.parse(body.props ?? {});
    const filename = sanitizeFilename(
      typeof body.filename === "string" && body.filename.length > 0
        ? body.filename
        : "sn_motion_countdown.mp4",
    );

    await fs.mkdir(PUBLIC_RENDERS_DIR, { recursive: true });
    const outPath = path.join(PUBLIC_RENDERS_DIR, filename);

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (event: object) => {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        };

        try {
          const { bundle } = await import("@remotion/bundler");
          const {
            selectComposition,
            renderMedia,
          } = await import("@remotion/renderer");

          send({ type: "progress", progress: 0.02 });

          bundleLocation = await bundle({
            entryPoint: path.join(process.cwd(), "src", "remotion", "index.ts"),
            outDir: path.join(os.tmpdir(), `sn-motion-bundle-${Date.now()}`),
            webpackOverride: (cfg) => cfg,
          });

          send({ type: "progress", progress: 0.15 });

          const compositionId = compositionIdForAspectRatio(props.aspectRatio);
          const composition = await selectComposition({
            serveUrl: bundleLocation,
            id: compositionId,
            inputProps: props,
          });

          send({ type: "progress", progress: 0.25 });

          await renderMedia({
            serveUrl: bundleLocation,
            composition,
            codec: "h264",
            outputLocation: outPath,
            inputProps: props,
            onProgress: ({ progress }) => {
              const overall = 0.25 + progress * 0.7;
              send({ type: "progress", progress: overall });
            },
          });

          send({ type: "progress", progress: 0.99 });
          send({
            type: "done",
            downloadUrl: `/renders/${encodeURIComponent(filename)}`,
            filename,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Render failed.";
          send({ type: "error", error: message });
        } finally {
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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bad request.";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}
