"use client";

import { useEffect, useState } from "react";
import LogoLoop, { type LogoItem } from "@/components/react-bits/LogoLoop";
import { copy } from "@/lib/copy";

export function Partners({ logos }: { logos: LogoItem[] }) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const logoHeight = compact ? 48 : 72;
  const gap = compact ? 52 : 88;

  return (
    <section
      data-frame-theme="green"
      className="partners frame frame-green js-snap"
      id="partners"
    >
      <h2 className="partners-title">{copy.rev2.partners.title}</h2>
      <div className="partners-loop">
        <LogoLoop
          logos={logos}
          speed={120}
          direction="left"
          logoHeight={logoHeight}
          gap={gap}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#02462e"
          ariaLabel="Partners"
        />
        <LogoLoop
          logos={logos}
          speed={120}
          direction="right"
          logoHeight={logoHeight}
          gap={gap}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#02462e"
          ariaLabel="Partners"
        />
      </div>
    </section>
  );
}
