import type { NextConfig } from "next";

/* yassine674.github.io is a user site served at the root. Expose the same value to
   the client (NEXT_PUBLIC_BASE_PATH) so the asset() helper can prefix
   plain <img>/url() references that Next won't rewrite automatically. */
const basePath = "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
