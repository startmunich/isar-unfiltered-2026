const UTM = {
  source: "isarunfiltered",
  medium: "website",
  campaign: "iu26",
} as const;

/** Append IU26 outbound UTM params. Skips if utm_source already present. */
export function withUtm(url: string, content: string): string {
  try {
    const u = new URL(url);
    if (u.searchParams.has("utm_source")) return u.toString();
    u.searchParams.set("utm_source", UTM.source);
    u.searchParams.set("utm_medium", UTM.medium);
    u.searchParams.set("utm_campaign", UTM.campaign);
    u.searchParams.set("utm_content", content);
    return u.toString();
  } catch {
    return url;
  }
}
