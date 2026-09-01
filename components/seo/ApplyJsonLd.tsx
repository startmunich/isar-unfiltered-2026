import { absoluteUrl } from "@/lib/site-url";

const description =
  "Apply for the Bits & Pretzels Scholarship powered by ISAR Unfiltered. Munich, 27–30 Sep 2026. No pitch deck required.";

export function ApplyJsonLd() {
  const applyUrl = absoluteUrl("/apply");

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Apply · ISAR Unfiltered",
    description,
    url: applyUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "ISAR Unfiltered",
      url: absoluteUrl("/"),
    },
    mainEntity: {
      "@type": "Offer",
      name: "ISAR Unfiltered 2026 Scholarship Application",
      description,
      url: applyUrl,
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Apply",
        item: applyUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
