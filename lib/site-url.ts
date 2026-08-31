/** Canonical production origin for metadata, sitemap, robots. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://isarunfiltered.eu";

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-F0C6LXLCBD";

export function absoluteUrl(path = "/") {
  const base = SITE_URL.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
