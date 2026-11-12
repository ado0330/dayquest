import type { NextConfig } from "next";

/**
 * DayQuest is local-first: every route is prerendered at build time and the
 * whole app is exported as static files (see `out/`). This lets it run on any
 * static host and be cached completely by the service worker for offline use.
 */
const nextConfig: NextConfig = {
  output: "export",
  // Emit `/missions/index.html` style files so static hosts resolve routes
  // without rewrites, and so the service worker can map URLs to files.
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
