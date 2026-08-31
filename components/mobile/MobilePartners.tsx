"use client";

import LogoLoop, { type LogoItem } from "@/components/react-bits/LogoLoop";
import { copy } from "@/lib/copy";
import { MobileReveal } from "@/components/mobile/MobileReveal";

export function MobilePartners({ logos }: { logos: LogoItem[] }) {
  return (
    <section id="partners" data-frame-theme="green" className="m-partners">
      <MobileReveal>
        <h2 className="m-partners-title">{copy.rev2.partners.title}</h2>
      </MobileReveal>
      <div className="m-partners-loop">
        <LogoLoop
          logos={logos}
          speed={42}
          direction="left"
          logoHeight={36}
          gap={40}
          hoverSpeed={0}
          scaleOnHover={false}
          fadeOut
          fadeOutColor="#02462e"
          ariaLabel="Partners"
        />
        <LogoLoop
          logos={logos}
          speed={42}
          direction="right"
          logoHeight={36}
          gap={40}
          hoverSpeed={0}
          scaleOnHover={false}
          fadeOut
          fadeOutColor="#02462e"
          ariaLabel="Partners"
        />
      </div>
    </section>
  );
}
