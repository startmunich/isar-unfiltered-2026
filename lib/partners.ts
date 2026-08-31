import type { ImageLogoItem, LogoItem } from "@/components/react-bits/LogoLoop";
import { withUtm } from "@/lib/utm";

/**
 * Partner marks for the green belts — light/white assets only on #02462e.
 * Files live in public/images/partners/ (from REV3/Partner Logos).
 */
export const partnerLogos: ImageLogoItem[] = [
  {
    src: "/images/partners/bits-and-pretzels.png",
    alt: "Bits & Pretzels",
    title: "Bits & Pretzels",
    href: withUtm("https://www.bitsandpretzels.com/", "partner_bits"),
  },
  {
    src: "/images/partners/start-munich.png",
    alt: "START Munich",
    title: "START Munich",
    href: withUtm("https://www.startmunich.de/", "partner_start"),
  },
  {
    src: "/images/partners/unternehmertum.png",
    alt: "UnternehmerTUM",
    title: "UnternehmerTUM",
    href: withUtm("https://www.unternehmertum.de/", "partner_utum"),
  },
  {
    src: "/images/partners/10x-founders.png",
    alt: "10x Founders",
    title: "10x Founders",
    href: withUtm("https://www.10xfounders.com/", "partner_10x"),
  },
];

export async function listPartnerLogos(): Promise<LogoItem[]> {
  return partnerLogos;
}
