"use client";

import Image from "next/image";
import { copy } from "@/lib/copy";
import { photos } from "@/lib/media";
import { MobileReveal } from "@/components/mobile/MobileReveal";

const slides = copy.rev3.features;
const slidePhotos = [photos.feature1, photos.feature2, photos.feature3] as const;

export function MobileFeatures() {
  return (
    <section data-frame-theme="photo" className="m-features">
      <MobileReveal className="m-features-head">
        <p className="m-features-kicker">What you get</p>
        <h2 className="m-features-title">Three beats. No theatre.</h2>
      </MobileReveal>

      <div className="m-features-track" role="region" aria-label="Features">
        {slides.map((slide, i) => (
          <article key={slide.n} className="m-features-slide">
            <div className="m-features-slide-media">
              <Image
                src={slidePhotos[i].src}
                alt={slidePhotos[i].alt}
                fill
                sizes="82vw"
                className="object-cover"
              />
            </div>
            <div className="m-features-slide-copy">
              <p className="m-features-slide-n">{slide.n}</p>
              <h3 className="m-features-slide-title">
                {slide.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <p className="m-features-slide-body">{slide.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
