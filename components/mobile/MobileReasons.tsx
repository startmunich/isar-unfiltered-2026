import Image from "next/image";
import { mobileApplyFormHref, copy } from "@/lib/copy";
import { photos } from "@/lib/media";
import { TextLink } from "@/components/ui/TextLink";
import { MobileReveal } from "@/components/mobile/MobileReveal";

export function MobileReasons() {
  return (
    <div>
      <section id="rtb" data-frame-theme="photo" className="m-reasons">
        <div className="m-reasons-photo">
          <Image
            src={photos.rtbPitch.src}
            alt={photos.rtbPitch.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <h2 className="m-reasons-title">
            {copy.rev2.rtb.dare.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
        </div>

        <MobileReveal className="m-reasons-green">
          <p className="m-reasons-body">{copy.rev2.rtb.dare.body}</p>
          <TextLink href={mobileApplyFormHref} arrow="yellow" className="m-reasons-cta">
            {copy.rev2.rtb.dare.kicker}
          </TextLink>
          <p className="m-reasons-meta">
            <span className="block font-bold">{copy.rev2.city}</span>
            <span>{copy.rev2.dates}</span>
          </p>
        </MobileReveal>
      </section>
    </div>
  );
}
