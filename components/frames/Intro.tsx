"use client";

import Image from "next/image";
import { useRef } from "react";
import { applyHref, copy } from "@/lib/copy";
import { photos } from "@/lib/media";
import { TextLink } from "@/components/ui/TextLink";
import { FeaturesLayer } from "@/components/frames/Features";
import { useSectionTrigger } from "@/hooks/useSectionTrigger";

const intro = copy.rev3.intro;

export function Intro() {
  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useSectionTrigger(wrapRef, ({ gsap }) => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const stack = stackRef.current;
    if (!wrap || !stage || !stack) return;

    const copyA = stage.querySelectorAll<HTMLElement>(".intro-beat-a");
    const copyB = stage.querySelectorAll<HTMLElement>(".intro-beat-b");
    const leftCol = stage.querySelector<HTMLElement>(".intro-col-left");
    const rightCol = stage.querySelector<HTMLElement>(".intro-col-right");
    const photo = stage.querySelector<HTMLElement>(".intro-photo");
    const build = stage.querySelector<HTMLElement>(".intro-build");
    const featureOverlay = stage.querySelector<HTMLElement>(
      ".intro-feature-overlay",
    );
    const featureSlides = stage.querySelectorAll<HTMLElement>(
      ".intro-feature-slide",
    );
    const heads = stage.querySelectorAll<HTMLElement>(
      ".intro-feature-overlay .features-headline-set",
    );
    const nums = stage.querySelectorAll<HTMLElement>(
      ".intro-feature-overlay .features-bar-n",
    );
    const bodies = stage.querySelectorAll<HTMLElement>(
      ".intro-feature-overlay .features-bar-body",
    );

    if (!copyA.length || !copyB.length || !leftCol || !rightCol || !photo) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.set(copyA, { autoAlpha: 1 });
      gsap.set(copyB, { autoAlpha: 0 });
      gsap.set(stack, { yPercent: 0 });
      gsap.set([leftCol, rightCol], { xPercent: 0 });
      gsap.set(photo, { left: "33.333%", width: "33.334%" });
      if (build) gsap.set(build, { autoAlpha: 1 });
      if (featureOverlay) gsap.set(featureOverlay, { autoAlpha: 0 });
      if (featureSlides.length) {
        gsap.set(featureSlides, { yPercent: 100 });
      }
      if (heads.length >= 3) {
        gsap.set(heads[0], { autoAlpha: 1, yPercent: -50, y: 0 });
        gsap.set([heads[1], heads[2]], { autoAlpha: 0, yPercent: -50, y: 18 });
      }
      if (nums.length >= 3 && bodies.length >= 3) {
        gsap.set([nums[0], bodies[0]], { yPercent: 0, autoAlpha: 1 });
        gsap.set([nums[1], nums[2], bodies[1], bodies[2]], {
          yPercent: 110,
          autoAlpha: 0,
        });
      }

      const setTheme = (theme: "yellow" | "photo") => {
        stage.dataset.frameTheme = theme;
        document.documentElement.dataset.menuOn = theme;
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "+=500%",
          pin: stage,
          pinSpacing: false,
          scrub: 0.12,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setTheme(self.progress >= 0.24 ? "photo" : "yellow");
          },
        },
      });

      tl.to(stack, { yPercent: -50, duration: 1, ease: "none" }, 0);
      tl.to(copyA, { autoAlpha: 0, duration: 0.2, ease: "none" }, 0.4);
      tl.to(copyB, { autoAlpha: 1, duration: 0.2, ease: "none" }, 0.4);

      tl.to(leftCol, { xPercent: -100, duration: 1, ease: "none" }, 1);
      tl.to(rightCol, { xPercent: 100, duration: 1, ease: "none" }, 1);
      tl.to(photo, { left: "0%", width: "100%", duration: 1, ease: "none" }, 1);
      tl.to(copyB, { autoAlpha: 0, duration: 0.35, ease: "none" }, 1);
      if (build) {
        tl.to(build, { autoAlpha: 0, duration: 0.35, ease: "none" }, 1);
      }
      if (featureOverlay) {
        tl.to(featureOverlay, { autoAlpha: 1, duration: 0.4, ease: "none" }, 1.55);
      }

      const swapCopy = (from: number, to: number, at: number) => {
        if (heads.length < 3 || nums.length < 3 || bodies.length < 3) return;
        tl.to(
          heads[from],
          { autoAlpha: 0, yPercent: -50, y: -22, duration: 0.22, ease: "none" },
          at,
        );
        tl.to(
          [nums[from], bodies[from]],
          { yPercent: -110, autoAlpha: 0, duration: 0.2, ease: "none" },
          at,
        );
        tl.to(
          heads[to],
          { autoAlpha: 1, yPercent: -50, y: 0, duration: 0.28, ease: "none" },
          at + 0.55,
        );
        tl.to(
          [nums[to], bodies[to]],
          { yPercent: 0, autoAlpha: 1, duration: 0.22, ease: "none" },
          at + 0.6,
        );
      };

      if (featureSlides[0]) {
        swapCopy(0, 1, 2);
        tl.to(featureSlides[0], { yPercent: 0, duration: 0.65, ease: "none" }, 2.08);
      }
      if (featureSlides[1]) {
        swapCopy(1, 2, 3);
        tl.to(featureSlides[1], { yPercent: 0, duration: 0.65, ease: "none" }, 3.08);
      }
      if (featureOverlay) {
        tl.to(featureOverlay, { autoAlpha: 1, duration: 1, ease: "none" }, 4);
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        setTheme("yellow");
      };
    });

    return () => mm.revert();
  });

  return (
    <section
      id="intro"
      ref={wrapRef}
      className="intro-pin-wrap relative"
    >
      <div
        ref={stageRef}
        data-frame-theme="yellow"
        className="intro-stage frame frame-yellow page-grid"
      >
        <div className="intro-col intro-col-side intro-col-left">
          <div className="intro-beat intro-beat-a">
            <CopyBlock
              headline={intro.a.left.headline}
              body={intro.a.left.body}
              cta={intro.a.left.cta}
              href={intro.a.left.href}
              align="right"
              vAlign="start"
            />
          </div>
          <div className="intro-beat intro-beat-b">
            <CopyBlock
              headline={intro.b.left.headline}
              body={intro.b.left.body}
              cta={intro.b.left.cta}
              href={intro.b.left.href}
              align="right"
              vAlign="center"
            />
          </div>
        </div>

        <div className="intro-photo-gutter" aria-hidden />

        <div className="intro-col intro-col-side intro-col-right">
          <div className="intro-beat intro-beat-a">
            <CopyBlock
              headline={intro.a.right.headline}
              body={intro.a.right.body}
              cta={intro.a.right.cta}
              href={applyHref}
              align="left"
              vAlign="lower"
            />
          </div>
          <div className="intro-beat intro-beat-b" />
        </div>

        <div id="intro-photo" className="intro-photo">
          <div ref={stackRef} className="intro-photo-stack">
            <div className="intro-photo-cell relative">
              <Image
                src={photos.introTall1.src}
                alt={photos.introTall1.alt}
                fill
                sizes="34vw"
                className="photo-bw object-cover"
              />
            </div>
            <div className="intro-photo-cell relative">
              <Image
                src={photos.introTall2.src}
                alt={photos.introTall2.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <span className="intro-build" aria-hidden>
              BUILD
            </span>
          </div>
        </div>
        <FeaturesLayer />
      </div>
    </section>
  );
}

function CopyBlock({
  headline,
  body,
  cta,
  href,
  align,
  vAlign,
}: {
  headline: string;
  body: string;
  cta: string;
  href: string;
  align: "left" | "right";
  vAlign: "start" | "center" | "end" | "lower";
}) {
  return (
    <div
      className={`intro-copy intro-copy-${align} intro-copy-${vAlign}`}
    >
      <h2 className="intro-copy-headline">{headline}</h2>
      <p className="intro-copy-body">{body}</p>
      <TextLink href={href} arrow="green" className="intro-copy-cta">
        {cta}
      </TextLink>
    </div>
  );
}
