"use client";

import Image from "next/image";
import { useRef } from "react";
import { mobileApplyFormHref, copy } from "@/lib/copy";
import { landingSlides } from "@/lib/media";
import { sqLogos, SQ_LOGO_SIZE } from "@/lib/logos";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TextLink } from "@/components/ui/TextLink";
import { MobileReveal } from "@/components/mobile/MobileReveal";

export function MobileLanding() {
  const wrapRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const plate = plateRef.current;
      if (!plate || prefersReducedMotion()) return;

      const slides = plate.querySelectorAll<HTMLElement>(".m-landing-slide");
      if (!slides.length) return;

      gsap.set(slides, { opacity: 0 });

      const tl = gsap.timeline({
        delay: 1.4,
        repeat: -1,
        defaults: { ease: "power1.inOut" },
      });

      slides.forEach((slide) => {
        tl.to(slide, { opacity: 1, duration: 0.32 });
        tl.to(slide, { opacity: 0, duration: 0.32 }, "+=0.85");
      });
    },
    { scope: wrapRef },
  );

  return (
    <section
      ref={wrapRef}
      data-frame-theme="yellow"
      className="m-landing"
    >
      <h1 className="sr-only">ISAR UNFILTERED</h1>

      <MobileReveal className="m-landing-lockup">
        <p className="m-landing-eyebrow">{copy.rev2.eyebrow}</p>

        <div className="m-landing-logo-wrap">
          <Image
            src={sqLogos.greenOnYellow}
            alt=""
            aria-hidden
            width={SQ_LOGO_SIZE}
            height={SQ_LOGO_SIZE}
            priority
            sizes="64vw"
            className="m-landing-logo"
          />
          <div ref={plateRef} className="m-landing-plate">
            {landingSlides.map((shot) => (
              <div key={shot.src} className="m-landing-slide">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="55vw"
                  className="photo-bw object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <TextLink href={mobileApplyFormHref} arrow="green" className="m-landing-cta">
          {copy.rev2.applyToday}
        </TextLink>

        <p className="m-landing-dates">
          <span className="block font-bold">{copy.rev2.city}</span>
          <span className="block">{copy.rev2.dates}</span>
        </p>
      </MobileReveal>
    </section>
  );
}
