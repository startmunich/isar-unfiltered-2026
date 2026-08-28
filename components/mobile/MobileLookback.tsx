import Image from "next/image";
import { copy } from "@/lib/copy";
import type { Iu25Item } from "@/lib/iu25";
import { MobileReveal } from "@/components/mobile/MobileReveal";

export function MobileLookback({ items }: { items: Iu25Item[] }) {
  return (
    <section data-frame-theme="green" className="m-lookback">
      <MobileReveal className="m-lookback-head">
        <h2 className="m-lookback-title">
          {copy.rev2.lookback.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="m-lookback-hint">Swipe the gallery</p>
      </MobileReveal>

      <div
        className="m-lookback-track"
        role="region"
        aria-label="Last time gallery"
        data-lenis-prevent
      >
        {items.map((item) => (
          <div key={item.image} className="m-lookback-slide">
            <Image
              src={item.image}
              alt=""
              fill
              sizes="78vw"
              className="photo-bw object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
