"use client";

import Image from "next/image";
import { copy } from "@/lib/copy";
import { sqLogos, SQ_LOGO_SIZE } from "@/lib/logos";
import { MobileReveal } from "@/components/mobile/MobileReveal";

export function MobileCloser() {
  return (
    <section data-frame-theme="green" className="m-closer">
      <h2 className="sr-only">ISAR UNFILTERED</h2>

      <MobileReveal className="m-closer-brand">
        <div className="m-closer-logo-wrap">
          <Image
            src={sqLogos.yellowOnGreen}
            alt="ISAR UNFILTERED"
            width={SQ_LOGO_SIZE}
            height={SQ_LOGO_SIZE}
            sizes="52vw"
            className="m-closer-logo"
          />
        </div>
        <p className="m-closer-meta">
          <span className="block font-bold">{copy.rev2.city}</span>
          <span>{copy.rev2.dates}</span>
        </p>
      </MobileReveal>

      <nav className="m-closer-social" aria-label="Social">
        <a
          href={copy.footer.instagram}
          target="_blank"
          rel="noreferrer noopener"
          className="m-closer-social-link"
          aria-label="Instagram"
        >
          IG
        </a>
        <a
          href={copy.footer.linkedin}
          target="_blank"
          rel="noreferrer noopener"
          className="m-closer-social-link"
          aria-label="LinkedIn"
        >
          LI
        </a>
      </nav>

      <p className="m-closer-credit">
        <a
          href="https://www.wide-communication.com/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Website by WIDE
        </a>
      </p>
    </section>
  );
}
