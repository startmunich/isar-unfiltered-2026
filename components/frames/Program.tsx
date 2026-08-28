"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/copy";
import { photos } from "@/lib/media";
import { prefersReducedMotion } from "@/lib/gsap";
import RotatingText from "@/components/react-bits/RotatingText";
import AccordionGallery from "@/components/react-bits/AccordionGallery";

const tease = copy.programTease;
const longestWord = tease.words.reduce(
  (a, b) => (a.length >= b.length ? a : b),
  tease.words[0],
);

export function ProgramIntro() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  return (
    <section
      id="program"
      data-frame-theme="green"
      className="program-tease frame frame-green js-snap"
    >
      <div className="program-tease-bg" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/program-font-cropped.png"
          alt=""
          width={1847}
          height={175}
        />
      </div>
      <h2 className="sr-only">{tease.title}</h2>
      <p className="program-tease-line">
        <span>{tease.prefix}</span>
        <span className="program-tease-box">
          <span className="program-tease-sizer" aria-hidden>
            {longestWord}
          </span>
          {reduced ? (
            <span className="program-tease-rotator">{tease.words[0]}</span>
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
              mainClassName="program-tease-rotator"
            />
          )}
        </span>
      </p>
    </section>
  );
}

const dayPhotos = [
  photos.feature1,
  photos.feature2,
  photos.feature3,
  photos.rtbPitch,
] as const;

export function ProgramDays() {
  const [trigger, setTrigger] = useState<"hover" | "click">("hover");

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setTrigger(mq.matches ? "hover" : "click");
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const items = copy.programDays.map((day, i) => ({
    n: day.n,
    date: day.date,
    body: day.body,
    slots: day.slots,
    image: dayPhotos[i].src,
    alt: dayPhotos[i].alt,
  }));

  return (
    <section
      data-frame-theme="yellow"
      className="program-days frame frame-yellow js-snap"
    >
      <p className="program-days-eyebrow">{copy.programDaysEyebrow}</p>
      <AccordionGallery
        items={items}
        defaultIndex={-1}
        expandRatio={0.62}
        trigger={trigger}
      />
    </section>
  );
}
