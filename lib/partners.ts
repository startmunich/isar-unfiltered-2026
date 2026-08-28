import type { ImageLogoItem, LogoItem } from "@/components/react-bits/LogoLoop";

/**
 * Partner marks for the green belts — yellow-on-green via LogoLoop CSS filter.
 * Files live in public/images/partners/ (processed from REV3/Partner Logos).
 */
export const partnerLogos: ImageLogoItem[] = [
  {
    src: "/images/partners/bits-and-pretzels.svg",
    alt: "Bits & Pretzels",
    title: "Bits & Pretzels",
    href: "https://www.bitsandpretzels.com/",
  },
  {
    src: "/images/partners/start-munich.png",
    alt: "START Munich",
    title: "START Munich",
    href: "https://www.startmunich.de/",
  },
  {
    src: "/images/partners/unternehmertum.png",
    alt: "UnternehmerTUM",
    title: "UnternehmerTUM",
    href: "https://www.unternehmertum.de/",
  },
  {
    src: "/images/partners/10x-founders.png",
    alt: "10x Founders",
    title: "10x Founders",
    href: "https://www.10xfounders.com/",
  },
  {
    src: "/images/partners/ewor.png",
    alt: "EWOR",
    title: "EWOR",
    href: "https://www.ewor.com/",
  },
  {
    src: "/images/partners/eth-ai-center.png",
    alt: "ETH AI Center",
    title: "ETH AI Center",
    href: "https://ai.ethz.ch/",
  },
];

export async function listPartnerLogos(): Promise<LogoItem[]> {
  return partnerLogos;
}
