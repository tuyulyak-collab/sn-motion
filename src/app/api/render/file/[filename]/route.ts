import { NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PUBLIC_RENDERS_DIR = path.join(process.cwd(), "public", "renders");

const jsonError = (status: number, message: string) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });

// Files inside `public/` are indexed by `next start` at startup, so MP4s
// generated at runtime by /api/render are not reachable via `/renders/<name>`
// until the server restarts. This route streams the file at request time so
// downloads work for newly produced renders.
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename: rawFilename } = await context.params;

  let decoded: string;
  try {
    decoded = decodeURIComponent(rawFilename);
  } catch {
    return jsonError(400, "Invalid filename.");
  }

  if (
    !decoded ||
    decoded.includes("/") ||
    decoded.includes("\\") ||
    decoded.includes("\0") ||
    decoded === "." ||
    decoded === ".." ||
    decoded.startsWith(".")
  ) {
    return jsonError(400, "Invalid filename.");
  }

  if (!decoded.toLowerCase().endsWith(".mp4")) {
    return jsonError(400, "Unsupported file type.");
  }

  const baseDir = path.resolve(PUBLIC_RENDERS_DIR);
  const filePath = path.resolve(path.join(baseDir, decoded));
  if (filePath !== baseDir && !filePath.startsWith(baseDir + path.sep)) {
    return jsonError(400, "Invalid filename.");
  }

  let data: Buffer;
  try {
    data = await fs.readFile(filePath);
  } catch {
    return jsonError(404, "File not found.");
  }

  return new Response(new Uint8Array(data), {
    headers: {
      "content-type": "video/mp4",
      "content-length": String(data.length),
      "content-disposition": `attachment; filename="${decoded.replace(/"/g, "")}"`,
      "cache-control": "no-store",
    },
  });
}
