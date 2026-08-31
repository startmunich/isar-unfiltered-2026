import type { Metadata, Viewport } from "next";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import {
  MenuProvider,
  FullMenu,
  MenuTrigger,
  ParkedWordmark,
} from "@/components/menu/FullMenu";
import { MenuTheme } from "@/components/menu/MenuTheme";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { Analytics } from "@/components/consent/Analytics";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";
import "./globals.css";
import "./mobile.css";

const title = "ISAR Unfiltered 2026";
const description =
  "Bits & Pretzels Scholarship powered by ISAR Unfiltered. Munich, 27–30 Sep 2026. 100 tickets. No strings. Show us what you're building.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s · ISAR Unfiltered",
  },
  description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title,
    description:
      "Bits & Pretzels Scholarship powered by ISAR Unfiltered. Munich, 27–30 Sep 2026. Show us what you're building.",
    type: "website",
    locale: "en_GB",
    url: absoluteUrl("/"),
    siteName: "ISAR Unfiltered",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description:
      "Bits & Pretzels Scholarship powered by ISAR Unfiltered. Munich, 27–30 Sep 2026.",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/icons/favicon-32-dark.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      {
        url: "/icons/icon-192-dark.png",
        sizes: "192x192",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "ISAR Unfiltered",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fec700" },
    { media: "(prefers-color-scheme: dark)", color: "#02462e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-menu-on="yellow" data-menu-show="false">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link
          rel="preconnect"
          href="https://p.typekit.net"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://use.typekit.net/lpk6vqu.css" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/favicon-48.png" type="image/png" sizes="48x48" />
        <link
          rel="apple-touch-icon"
          href="/icons/apple-touch-icon.png"
          sizes="180x180"
        />
      </head>
      <body className="bg-yellow font-body text-green antialiased">
        <ConsentProvider>
          <GrainOverlay />
          <SmoothScroll>
            <MenuProvider>
              <MenuTrigger />
              <ParkedWordmark />
              <FullMenu />
              <MenuTheme />
              {children}
            </MenuProvider>
          </SmoothScroll>
          <ConsentBanner />
          <Analytics />
        </ConsentProvider>
      </body>
    </html>
  );
}
