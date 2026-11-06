import type { NextConfig } from "next";

// GITHUB_PAGES=1 (set by the GitHub workflow) builds a fully static copy for yassine674.github.io;
// the normal build (Vercel, local) is unchanged.
const pages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  // static export can't use partial prerendering, so the GitHub copy is built without it
  ...(pages ? { output: "export" as const, trailingSlash: true } : { cacheComponents: true, partialPrefetching: true }),
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
