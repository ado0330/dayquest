#!/usr/bin/env node
/**
 * Renders public/icons/icon.svg to the PNG sizes needed by the web app
 * manifest and iOS, using Playwright's Chromium. Run with `npm run icons`
 * after changing the logo; the PNGs are committed so builds don't need this.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = path.join(root, "public", "icons");

const targets = [
  { file: "icon-192.png", size: 192, padding: 0, rounded: true },
  { file: "icon-512.png", size: 512, padding: 0, rounded: true },
  // Maskable icons need the artwork inside the central safe zone and a full-bleed background.
  { file: "icon-maskable-512.png", size: 512, padding: 0.14, rounded: false },
  { file: "apple-touch-icon.png", size: 180, padding: 0, rounded: false },
];

const svg = await readFile(path.join(iconsDir, "icon.svg"), "utf8");
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const t of targets) {
    const inner = Math.round(t.size * (1 - t.padding * 2));
    const art = t.rounded ? svg : svg.replace('rx="18"', 'rx="0"');
    await page.setViewportSize({ width: t.size, height: t.size });
    await page.setContent(
      `<html><body style="margin:0;background:${t.rounded ? "transparent" : "#bfe3fb"};display:grid;place-items:center;width:${t.size}px;height:${t.size}px">
        <div style="width:${inner}px;height:${inner}px">${art.replace("<svg ", `<svg width="${inner}" height="${inner}" `)}</div>
      </body></html>`,
    );
    await page.screenshot({ path: path.join(iconsDir, t.file), omitBackground: t.rounded });
    console.log(`icons: wrote ${t.file}`);
  }
} finally {
  await browser.close();
}
