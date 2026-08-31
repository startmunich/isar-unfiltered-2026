import { copy } from "@/lib/copy";

export const goLive = {
  hiddenPaths: ["/program", "/mentors"] as const,
  hiddenMenuHrefs: ["/mentors", "/#landing"],
  hiddenFooterHrefs: ["/program", "/mentors"],
};

export function publicMenuItems() {
  return copy.rev2.menu.filter(
    (item) => !goLive.hiddenMenuHrefs.includes(item.href),
  );
}

export function publicFooterLinks() {
  return copy.footer.pages.filter(
    (item) => !goLive.hiddenFooterHrefs.includes(item.href),
  );
}
