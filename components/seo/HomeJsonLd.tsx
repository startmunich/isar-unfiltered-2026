import { absoluteUrl } from "@/lib/site-url";

const description =
  "Bits & Pretzels Scholarship powered by ISAR Unfiltered. Four days in Munich for people who are already doing something about a problem they care about.";

export function HomeJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ISAR Unfiltered",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/images/IU26_Logo_yellow.png"),
    parentOrganization: {
      "@type": "Organization",
      name: "STARTmunich e.V.",
      url: "https://www.startmunich.de/",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Arcisstrasse 21",
        postalCode: "80333",
        addressLocality: "Munich",
        addressCountry: "DE",
      },
      email: "info@startmunich.de",
    },
    sameAs: [
      "https://www.instagram.com/isar.unfiltered/",
      "https://www.linkedin.com/showcase/isar-unfiltered/",
    ],
  };

  const event = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "ISAR Unfiltered 2026",
    description,
    startDate: "2026-09-27",
    endDate: "2026-09-30",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: absoluteUrl("/"),
    image: [absoluteUrl("/opengraph-image")],
    location: {
      "@type": "Place",
      name: "Munich",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Munich",
        addressCountry: "DE",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "ISAR Unfiltered",
      url: absoluteUrl("/"),
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl("/#apply"),
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
      />
    </>
  );
}
