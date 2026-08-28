export const tallyFormTitle =
  "Bits & Pretzels Scholarship, powered by ISAR Unfiltered";

/** Prefer /embed/:id — dynamicHeight works more reliably than /r/:id. */
export function normalizeTallyEmbedUrl(baseUrl: string): string {
  try {
    const url = new URL(baseUrl);
    const match = url.pathname.match(/\/(?:r|embed)\/([^/?#]+)/);
    if (match?.[1]) {
      url.pathname = `/embed/${match[1]}`;
    }
    return url.origin + url.pathname;
  } catch {
    return baseUrl;
  }
}

export function getTallyEmbedSrc(baseUrl: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set("dynamicHeight", "1");
  url.searchParams.set("hideTitle", "1");
  // Centered (not alignLeft) — avoids uneven left/right space inside Tally.
  return url.toString();
}

export function getTallyEmbedBaseUrl(): string | null {
  const base = process.env.NEXT_PUBLIC_TALLY_EMBED_URL?.trim();
  return base || null;
}
