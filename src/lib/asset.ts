/* Static asset helper for GitHub Pages deployment.
   Plain <img>/CSS url() references don't get the Next.js basePath
   prepended automatically (only next/image and next/link do), so
   any hardcoded /public path must run through asset(). Keep this in
   sync with `basePath` in next.config.ts. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string): string =>
  `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
