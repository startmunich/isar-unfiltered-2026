"use client";

import Image from "next/image";
import { copy } from "@/lib/copy";
import { photos } from "@/lib/media";
import { TextPressure } from "@/components/ui/TextPressure";

const slides = copy.rev3.features;
const slidePhotos = [photos.feature1, photos.feature2, photos.feature3] as const;

export function Features() {
  return (
    <section id="features" data-frame-theme="photo" className="relative">
      <div className="features-static">
        {slides.map((slide, i) => (
          <div
            key={slide.n}
            data-frame-theme="photo"
            className="features-static-frame"
          >
            <Image
              src={slidePhotos[i].src}
              alt={slidePhotos[i].alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="features-overlay is-static">
              <div className="features-headline">
                <div className="features-headline-set">
                  <FeatureHeadline slide={slide} staticCopy />
                </div>
              </div>
              <div className="features-bar">
                <span className="features-bar-n">{slide.n}</span>
                <p className="features-bar-body">{slide.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureHeadline({
  slide,
  staticCopy = false,
}: {
  slide: (typeof slides)[number];
  staticCopy?: boolean;
}) {
  return (
    <>
      {slide.title.map((line) => (
        <div key={line} className="features-headline-line">
          {staticCopy ? (
            <p className="features-headline-static">{line}</p>
          ) : (
            <TextPressure text={line} flex width={false} />
          )}
        </div>
      ))}
    </>
  );
}

/** Motion layer lives inside Intro so Feature 1 is the expand, not a new section. */
export function FeaturesLayer() {
  return (
    <div className="intro-feature-layer features-motion">
      <div className="features-photos intro-feature-photos">
        {slidePhotos.slice(1).map((photo) => (
          <div key={photo.src} className="features-slide intro-feature-slide">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="features-overlay intro-feature-overlay">
        <div className="features-headline">
          {slides.map((slide) => (
            <div key={slide.n} className="features-headline-set">
              <FeatureHeadline slide={slide} />
            </div>
          ))}
        </div>
        <div className="features-bar">
          <div className="features-bar-n-wrap">
            {slides.map((slide) => (
              <span key={slide.n} className="features-bar-n">
                {slide.n}
              </span>
            ))}
          </div>
          <div className="features-bar-body-wrap">
            {slides.map((slide) => (
              <p key={slide.n} className="features-bar-body">
                {slide.body}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
