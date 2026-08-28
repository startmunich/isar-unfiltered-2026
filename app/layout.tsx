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
import "./globals.css";
import "./mobile.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://isar-unfiltered-2026.vercel.app",
  ),
  title: "ISAR Unfiltered 2026",
  description:
    "Bits & Pretzels Scholarship powered by ISAR Unfiltered. Munich, 27–30 Sep 2026. 100 tickets. No strings. Show us what you're building.",
  openGraph: {
    title: "ISAR Unfiltered 2026",
    description:
      "Bits & Pretzels Scholarship powered by ISAR Unfiltered. Munich, 27–30 Sep 2026. Show us what you're building.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "ISAR Unfiltered 2026",
    description:
      "Bits & Pretzels Scholarship powered by ISAR Unfiltered. Munich, 27–30 Sep 2026.",
  },
  icons: {
    icon: [
      {
        url: "/icons/favicon-32-light.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/favicon-32-dark.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icons/icon-192-light.png",
        sizes: "192x192",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/icon-192-dark.png",
        sizes: "192x192",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
        <link
          rel="apple-touch-icon"
          href="/icons/apple-touch-icon.png"
          sizes="180x180"
        />
      </head>
      <body className="bg-yellow font-body text-green antialiased">
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
      </body>
    </html>
  );
}
