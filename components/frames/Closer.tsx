"use client";

import { useCallback, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { applyPageHref, copy } from "@/lib/copy";
import { publicFooterLinks } from "@/lib/site";
import { prefersReducedMotion } from "@/lib/gsap";
import GridDistortion from "@/components/react-bits/GridDistortion";
import { TextLink } from "@/components/ui/TextLink";
import { useLenis } from "lenis/react";
import { useViewportProfile } from "@/hooks/useViewportProfile";

function hashFromHref(href: string) {
  if (href.startsWith("#")) return href;
  if (href.startsWith("/#")) return href.slice(1);
  try {
    const url = new URL(href, window.location.origin);
    if (url.pathname === "/" && url.hash) return url.hash;
  } catch {
    /* ignore */
  }
  return null;
}

export function Closer() {
  const rootRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const profile = useViewportProfile();

  const onSitemapClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      const hash = hashFromHref(href);
      if (!hash || !profile) return;

      const frameRoot = document.querySelector<HTMLElement>(
        profile === "mobile" ? ".mobile-only" : ".desktop-only",
      );
      if (!frameRoot) return;

      if (
        hash === "#features" &&
        profile === "desktop" &&
        !prefersReducedMotion()
      ) {
        const intro = frameRoot.querySelector<HTMLElement>("#intro");
        if (intro) {
          e.preventDefault();
          const top = intro.offsetTop + intro.offsetHeight * 0.35;
          window.setTimeout(() => {
            if (lenis) lenis.scrollTo(top, { immediate: false });
            else window.scrollTo({ top, behavior: "smooth" });
          }, 40);
          return;
        }
      }

      const el = frameRoot.querySelector<HTMLElement>(hash);
      if (!el) return;

      e.preventDefault();
      window.setTimeout(() => {
        if (profile === "desktop" && lenis) {
          lenis.scrollTo(el, { offset: 0, immediate: false });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 40);
    },
    [lenis, profile],
  );

  return (
    <section
      ref={rootRef}
      id="closer"
      data-frame-theme="green"
      className="closer frame frame-green js-snap"
    >
      <h2 className="sr-only">ISAR UNFILTERED</h2>
      <div className="closer-inner">
        <div className="closer-brand">
          <p className="closer-eyebrow">{copy.rev2.eyebrow}</p>
          <div className="closer-lockup">
            <GridDistortion
              imageSrc="/images/IU26_Logo_yellow.png"
              grid={10}
              mouse={0.27}
              strength={0.15}
              relaxation={0.9}
              pointerRoot={rootRef}
            />
          </div>
          <div className="closer-meta">
            <span>{copy.rev2.city}</span>
            <span>{copy.rev2.dates}</span>
          </div>
        </div>

        <div className="closer-foot">
          <nav className="closer-sitemap" aria-label="On this site">
            {publicFooterLinks().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => onSitemapClick(e, item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <nav className="closer-bar" aria-label="Footer">
            <a
              href={copy.footer.instagram}
              target="_blank"
              rel="noreferrer noopener"
            >
              {copy.rev2.closer.instagram}
            </a>
            <a
              href={copy.footer.linkedin}
              target="_blank"
              rel="noreferrer noopener"
            >
              {copy.rev2.closer.linkedin}
            </a>
            <TextLink href={applyPageHref} newTab arrow="green">
              {copy.rev2.closer.apply}
            </TextLink>
          </nav>
          <p className="closer-legal">
            <a
              href={copy.footer.wide}
              target="_blank"
              rel="noreferrer noopener"
            >
              Website by WIDE
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
