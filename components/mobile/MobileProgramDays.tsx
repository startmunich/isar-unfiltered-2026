"use client";

import Image from "next/image";
import { useState } from "react";
import { copy } from "@/lib/copy";
import { photos } from "@/lib/media";
import { MobileReveal } from "@/components/mobile/MobileReveal";

const dayPhotos = [
  photos.programDays[0],
  photos.programDays[1],
  photos.programDays[2],
  photos.programDays[3],
] as const;

export function MobileProgramDays() {
  const [openIndex, setOpenIndex] = useState(0);
  const days = copy.programDays;

  return (
    <section data-frame-theme="yellow" className="m-program-days">
      <div className="m-program-days-list">
        {days.map((day, i) => {
          const open = openIndex === i;
          return (
            <MobileReveal key={day.n} delay={i * 0.04}>
              <article className={`m-day-card${open ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="m-day-card-toggle"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : i)}
                >
                  <span className="m-day-card-n">Day {day.n}</span>
                  <span className="m-day-card-date">{day.date}</span>
                  <span className="m-day-card-chevron" aria-hidden>
                    {open ? "−" : "+"}
                  </span>
                </button>

                <div className="m-day-card-media">
                  <Image
                    src={dayPhotos[i].src}
                    alt={dayPhotos[i].alt}
                    fill
                    sizes="100vw"
                    className="photo-bw object-cover"
                  />
                </div>

                <div className="m-day-card-body">
                  <div className="m-day-card-layout">
                    <p className="m-day-card-summary">{day.body}</p>
                    {open ? (
                      <ul className="m-day-card-slots">
                        {day.slots.map((slot) => (
                          <li key={`${slot.when}-${slot.format}`}>
                            <p className="m-day-slot-format">{slot.format}</p>
                            <p className="m-day-slot-when">{slot.when}</p>
                            <p className="m-day-slot-where">{slot.where}</p>
                            <p className="m-day-slot-length">{slot.length}</p>
                            {"href" in slot && slot.href ? (
                              <a
                                className="m-day-slot-link"
                                href={slot.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                              >
                                {"cta" in slot && slot.cta
                                  ? slot.cta
                                  : "Register"}
                              </a>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </article>
            </MobileReveal>
          );
        })}
      </div>
    </section>
  );
}
