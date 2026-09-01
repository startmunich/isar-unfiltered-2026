import type { Metadata } from "next";
import { ApplyPageEmbed } from "@/components/apply/ApplyPageEmbed";
import { ApplyJsonLd } from "@/components/seo/ApplyJsonLd";
import { absoluteUrl } from "@/lib/site-url";

const title = "Apply";
const description =
  "Apply for the Bits & Pretzels Scholarship powered by ISAR Unfiltered. Munich, 27–30 Sep 2026. No pitch deck required.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/apply" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: absoluteUrl("/apply"),
    title: `${title} · ISAR Unfiltered`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · ISAR Unfiltered`,
    description,
  },
};

export default function ApplyPage() {
  return (
    <>
      <ApplyJsonLd />
      <ApplyPageEmbed />
    </>
  );
}
