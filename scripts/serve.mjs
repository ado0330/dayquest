#!/usr/bin/env node
/**
 * Minimal static file server for previewing the production export in `out/`
 * (used by `npm run preview` and the end-to-end tests). It mirrors what a
 * static host does: `/path/` serves `/path/index.html`, unknown paths get
 * `404.html`, and `sw.js` is never cached by the browser.
 *
 * Usage: node scripts/serve.mjs [port]
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const port = Number(process.argv[2] ?? process.env.PORT ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

async function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const full = path.join(root, clean);
  if (!full.startsWith(root)) return null;
  const tries = clean.endsWith("/") ? [path.join(full, "index.html")] : [full, `${full}.html`, path.join(full, "index.html")];
  for (const candidate of tries) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // try next
    }
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  // Match static hosts: directory URLs without a trailing slash redirect to it.
  if (!url.pathname.endsWith("/") && !path.extname(url.pathname)) {
    const dir = path.join(root, url.pathname);
    try {
      if ((await stat(path.join(dir, "index.html"))).isFile()) {
        res.writeHead(308, { Location: `${url.pathname}/${url.search}` });
        return res.end();
      }
    } catch {
      // fall through
    }
  }
  let file = await resolveFile(url.pathname);
  let status = 200;
  if (!file) {
    file = path.join(root, "404.html");
    status = 404;
  }
  const ext = path.extname(file);
  const headers = { "Content-Type": TYPES[ext] ?? "application/octet-stream" };
  if (path.basename(file) === "sw.js") headers["Cache-Control"] = "no-cache";
  else if (url.pathname.startsWith("/_next/static/")) headers["Cache-Control"] = "public, max-age=31536000, immutable";
  res.writeHead(status, headers);
  createReadStream(file).pipe(res);
});

server.listen(port, () => {
  console.log(`DayQuest preview running at http://localhost:${port}`);
});
