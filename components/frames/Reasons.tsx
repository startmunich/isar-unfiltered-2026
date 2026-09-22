import Image from "next/image";
import { copy, social } from "@/lib/copy";
import { photos } from "@/lib/media";
import { TextLink } from "@/components/ui/TextLink";
import { Crew } from "@/components/frames/Crew";

export function Reasons() {
  return (
    <div id="rtb">
      <section
        data-frame-theme="photo"
        className="rtb-dare frame frame-green page-grid js-snap"
      >
        <div className="rtb-dare-photo">
          <Image
            src={photos.rtbPitch.src}
            alt={photos.rtbPitch.alt}
            fill
            sizes="(max-width: 1023px) 100vw, 34vw"
            className="object-cover"
          />
          <h2 className="rtb-dare-title">
            {copy.rev2.rtb.dare.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
        </div>
        <div className="rtb-dare-green">
          <div className="rtb-dare-copy">
            <p>{copy.rev2.rtb.dare.body}</p>
            <div className="rtb-dare-ctas">
              <TextLink href={social.linkedinRtb} newTab arrow="yellow">
                {copy.rev2.rtb.dare.kicker}
              </TextLink>
              <TextLink href={social.instagramRtb} newTab arrow="yellow">
                {copy.rev2.instagram}
              </TextLink>
            </div>
          </div>
          <p className="rtb-dare-meta">
            <span className="rtb-dare-city">{copy.rev2.city}</span>
            <span>{copy.rev2.dates}</span>
          </p>
        </div>
      </section>

      <Crew />
    </div>
  );
}
