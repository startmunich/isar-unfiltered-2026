"use client";

import { useRef } from "react";
import Link from "next/link";
import { applyHref, copy } from "@/lib/copy";
import { publicFooterLinks } from "@/lib/site";
import GridDistortion from "@/components/react-bits/GridDistortion";
import { TextLink } from "@/components/ui/TextLink";

export function Closer() {
  const rootRef = useRef<HTMLElement>(null);

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
              <Link key={item.href} href={item.href}>
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
            <TextLink href={applyHref} arrow="green">
              {copy.rev2.closer.apply}
            </TextLink>
          </nav>
        </div>
      </div>
    </section>
  );
}
