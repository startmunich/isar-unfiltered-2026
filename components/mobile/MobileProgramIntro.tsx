"use client";

import { useEffect, useState } from "react";
import { applyPageHref, copy } from "@/lib/copy";
import { prefersReducedMotion } from "@/lib/gsap";
import RotatingText from "@/components/react-bits/RotatingText";
import { TextLink } from "@/components/ui/TextLink";
import { MobileReveal } from "@/components/mobile/MobileReveal";

const tease = copy.programTease;
const longestWord = tease.words.reduce(
  (a, b) => (a.length >= b.length ? a : b),
  tease.words[0],
);

export function MobileProgramIntro() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  return (
    <section id="program" data-frame-theme="green" className="m-program-intro">
      <div className="m-program-intro-bg" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/program-mobile.png"
          alt=""
          width={1920}
          height={409}
        />
      </div>

      <MobileReveal className="m-program-intro-inner">
        <h2 className="sr-only">{tease.title}</h2>
        <p className="m-program-intro-prefix">{tease.prefix}</p>
        <div className="m-program-intro-line">
          <span className="m-program-intro-box">
            <span className="m-program-intro-sizer" aria-hidden>
              {longestWord}
            </span>
            {reduced ? (
              <span className="m-program-intro-rotator">{tease.words[0]}</span>
            ) : (
              <RotatingText
                texts={[...tease.words]}
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
                mainClassName="m-program-intro-rotator"
              />
            )}
          </span>
        </div>
        <p className="m-program-intro-blurb">{tease.blurb}</p>
        <TextLink href={applyPageHref} newTab arrow="yellow" className="m-program-intro-cta">
          {copy.rev2.applyToday}
        </TextLink>
      </MobileReveal>
    </section>
  );
}
