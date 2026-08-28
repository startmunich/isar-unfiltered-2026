"use client";

import Image from "next/image";
import { useRef } from "react";
import { applyHref, copy } from "@/lib/copy";
import { landingSlides } from "@/lib/media";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TextLink } from "@/components/ui/TextLink";

export function Landing() {
  const wrapRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const plate = plateRef.current;
      if (!plate || prefersReducedMotion()) return;

      const slides = plate.querySelectorAll<HTMLElement>(".landing-slide");
      if (!slides.length) return;

      gsap.set(slides, { opacity: 0 });

      const tl = gsap.timeline({
        delay: 2.2,
        repeat: -1,
        defaults: { ease: "power1.inOut" },
      });

      slides.forEach((slide) => {
        tl.to(slide, { opacity: 1, duration: 0.32 });
        tl.to(slide, { opacity: 0, duration: 0.32 }, "+=0.9");
      });
    },
    { scope: wrapRef },
  );

  return (
    <section
      id="landing"
      ref={wrapRef}
      data-frame-theme="yellow"
      className="frame frame-yellow js-snap"
    >
      <h1 className="sr-only">ISAR UNFILTERED</h1>

      <div className="landing-grid">
        <div className="landing-meta">
          <p className="landing-dates">
            <span className="block font-bold">{copy.rev2.city}</span>
            <span className="block">{copy.rev2.dates}</span>
          </p>
          <TextLink href={applyHref} arrow="green" className="landing-cta">
            {copy.rev2.applyToday}
          </TextLink>
        </div>

        <div className="landing-lockup">
          <p className="landing-eyebrow">{copy.rev2.eyebrow}</p>
          <div className="landing-logo">
            <Image
              src="/images/IU26_Logo_Green.png"
              alt="ISAR UNFILTERED"
              width={1870}
              height={927}
              priority
              quality={100}
              unoptimized
              sizes="(min-width: 768px) 67vw, 100vw"
              className="landing-logo-img block h-auto w-full"
            />
            <div ref={plateRef} className="landing-plate">
              {landingSlides.map((shot) => (
                <div key={shot.src} className="landing-slide">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 1023px) 55vw, 40vw"
                    className="photo-bw object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="landing-accent relative col-start-3 row-start-3 overflow-hidden">
          <div className="rect-221 absolute bottom-0 right-0 w-[72%] translate-x-[30%] bg-green" />
        </div>
      </div>
    </section>
  );
}
