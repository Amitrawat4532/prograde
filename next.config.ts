import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // AVIF first, WebP fallback — every <Image> is served compressed.
    formats: ["image/avif", "image/webp"],
    qualities: [55, 60, 65, 70, 75, 80],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
  },
  turbopack: {
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
