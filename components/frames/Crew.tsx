"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Component,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { copy } from "@/lib/copy";
import { photos } from "@/lib/media";
import { prefersReducedMotion } from "@/lib/gsap";
import PixelTransition from "@/components/react-bits/PixelTransition";

const Lanyard = dynamic(() => import("@/components/react-bits/Lanyard"), {
  ssr: false,
});

const crewPhotos = [
  { ...photos.crewFabi, position: "50% 22%" },
  { ...photos.crewAli, position: "50% 18%" },
  { ...photos.crewChris, position: "50% 28%" },
] as const;

class LanyardErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function CrewCard({
  name,
  role,
  href,
  photo,
}: {
  name: string;
  role: string;
  href: string;
  photo: (typeof crewPhotos)[number];
}) {
  const stopCardToggle = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const face = (
    <div className="crew-card-face">
      <p className="crew-card-name">{name}</p>
      <p className="crew-card-role">{role}</p>
      <a
        className="crew-card-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={stopCardToggle}
        onMouseDown={stopCardToggle}
        onPointerDown={stopCardToggle}
      >
        {copy.rev2.crew.linkedinCta} ↗
      </a>
    </div>
  );

  return (
    <PixelTransition
      className="crew-card"
      firstContent={face}
      secondContent={
        <a
          className="crew-card-photo-wrap"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on LinkedIn`}
          onClick={stopCardToggle}
          onMouseDown={stopCardToggle}
          onPointerDown={stopCardToggle}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 767px) 46vw, 18vw"
            className="crew-card-photo photo-bw object-cover"
            style={{ objectPosition: photo.position }}
          />
        </a>
      }
      pixelColor="#fec700"
      once={false}
      aspectRatio="115%"
    />
  );
}

function CrewLanyard() {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const desk = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    );
    if (!desk.matches) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setLive(true);
      },
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show3d = live && !failed;

  return (
    <div ref={ref} className={`crew-lanyard${show3d ? " is-live" : ""}`}>
      <p className="crew-lanyard-hint">{copy.rev2.crew.hint}</p>
      <Image
        src="/images/lanyard-front.jpg"
        alt="ISAR Unfiltered 2026 crew badge"
        width={720}
        height={1120}
        className="crew-lanyard-static"
      />
      {show3d ? (
        <LanyardErrorBoundary onError={() => setFailed(true)}>
          <Lanyard
            frontImage="/images/lanyard-front.jpg"
            backImage="/images/lanyard-back.jpg"
            imageFit="cover"
            onContextLost={() => setFailed(true)}
          />
        </LanyardErrorBoundary>
      ) : null}
    </div>
  );
}

export function Crew() {
  const crew = copy.rev2.crew;

  return (
    <section
      id="crew"
      data-frame-theme="green"
      className="crew frame frame-green page-grid js-snap"
    >
      <div className="crew-copy">
        <h2 className="crew-title">{crew.title}</h2>
        {crew.body.map((paragraph) => (
          <p key={paragraph} className="crew-body">
            {paragraph}
          </p>
        ))}
      </div>
      <CrewLanyard />
      <div className="crew-cards">
        {crew.cards.map((card, i) => (
          <CrewCard
            key={card.name}
            name={card.name}
            role={card.role}
            href={card.href}
            photo={crewPhotos[i]!}
          />
        ))}
      </div>
    </section>
  );
}
