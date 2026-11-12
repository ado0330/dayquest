#!/usr/bin/env node
/**
 * Runs after `next build`. Lists every file in the static export (`out/`),
 * computes a content hash as the cache version, and writes `out/sw.js` with
 * that precache list. Any change to the build produces a new worker, so
 * returning visitors get the update automatically.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");
const SKIP = new Set(["sw.js", ".DS_Store"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (!SKIP.has(entry.name)) files.push(full);
  }
  return files;
}

async function main() {
  try {
    await stat(outDir);
  } catch {
    console.error("generate-sw: out/ not found. Run `next build` first.");
    process.exit(1);
  }

  const files = (await walk(outDir)).sort();
  const hash = createHash("sha256");
  let bytes = 0;
  const urls = [];
  for (const file of files) {
    const rel = path.relative(outDir, file).split(path.sep).join("/");
    const content = await readFile(file);
    hash.update(rel).update(content);
    bytes += content.length;
    urls.push(`/${rel}`);
  }
  const version = hash.digest("hex").slice(0, 12);

  if (!urls.includes("/offline/index.html")) {
    console.error("generate-sw: /offline/index.html is missing from the export.");
    process.exit(1);
  }

  const template = await readFile(path.join(root, "scripts", "sw-template.js"), "utf8");
  const sw = template.replace("__VERSION__", version).replace("__PRECACHE__", JSON.stringify(urls, null, 0));
  await writeFile(path.join(outDir, "sw.js"), sw);

  console.log(
    `generate-sw: precaching ${urls.length} files (${(bytes / 1024 / 1024).toFixed(2)} MB), version ${version}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
