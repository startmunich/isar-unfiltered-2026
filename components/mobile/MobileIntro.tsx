"use client";

import Image from "next/image";
import { mobileApplyFormHref, copy } from "@/lib/copy";
import { photos } from "@/lib/media";
import { TextLink } from "@/components/ui/TextLink";
import { MobileReveal } from "@/components/mobile/MobileReveal";

const intro = copy.rev3.intro;

const beats = [
  {
    theme: "yellow" as const,
    photo: photos.introTall1,
    headline: intro.a.left.headline,
    body: intro.a.left.body,
    cta: intro.a.left.cta,
    href: intro.a.left.href,
  },
  {
    theme: "green" as const,
    headline: intro.a.right.headline,
    body: intro.a.right.body,
    cta: intro.a.right.cta,
    href: mobileApplyFormHref,
  },
  {
    theme: "yellow" as const,
    headline: intro.b.left.headline,
    body: intro.b.left.body,
    cta: intro.b.left.cta,
    href: intro.b.left.href,
  },
];

export function MobileIntro() {
  return (
    <section id="intro" className="m-intro">
      {beats.map((beat, i) => (
        <article
          key={beat.headline}
          data-frame-theme={beat.theme}
          className={`m-intro-beat m-intro-beat-${beat.theme}`}
        >
          {beat.photo ? (
            <MobileReveal className="m-intro-photo-card">
              <div className="m-intro-photo">
                <Image
                  src={beat.photo.src}
                  alt={beat.photo.alt}
                  fill
                  sizes="100vw"
                  className="photo-bw object-cover"
                  priority={i === 0}
                />
              </div>
            </MobileReveal>
          ) : null}

          <MobileReveal className="m-intro-copy" delay={0.06}>
            <h2 className="m-intro-headline">{beat.headline}</h2>
            <p className="m-intro-body">{beat.body}</p>
            <TextLink
              href={beat.href}
              arrow={beat.theme === "green" ? "yellow" : "green"}
              className="m-intro-cta"
            >
              {beat.cta}
            </TextLink>
          </MobileReveal>
        </article>
      ))}
    </section>
  );
}
