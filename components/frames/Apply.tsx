import { copy, social } from "@/lib/copy";
import { TextLink } from "@/components/ui/TextLink";

type HappeningIntroProps = {
  variant?: "primary" | "bottom" | "follow";
};

export function HappeningIntro({ variant = "primary" }: HappeningIntroProps) {
  const isFollow = variant === "follow";
  const sectionId =
    variant === "bottom"
      ? "happening-bottom"
      : isFollow
        ? "follow-story"
        : "happening";
  const isGreen = variant === "bottom";

  const headline = isFollow
    ? copy.followStory.headline
    : copy.happening.headline;
  const sub = isFollow ? copy.followStory.body : copy.happening.sub;
  const detail = isFollow ? copy.followStory.detail : null;

  const primaryHref = isFollow
    ? social.linkedinFollowStory
    : social.linkedinHappening;
  const primaryLabel = isFollow
    ? copy.followStory.linkedinCta
    : copy.happening.followCta;
  const secondaryHref = isFollow
    ? social.instagramFollowStory
    : social.instagramHappening;
  const secondaryLabel = isFollow
    ? copy.followStory.instagramCta
    : copy.happening.instagramCta;

  return (
    <section
      id={sectionId}
      data-frame-theme={isGreen ? "green" : "yellow"}
      className={`apply-intro frame ${isGreen ? "frame-green" : "frame-yellow"} js-snap`}
    >
      <div className="apply-intro-inner">
        <h1 className="apply-headline">{headline}</h1>
        <p className="apply-sub">{sub}</p>
        {detail ? <p className="apply-sub apply-sub-detail">{detail}</p> : null}
        <div className="apply-cta-row">
          <TextLink
            href={primaryHref}
            newTab
            arrow={isGreen ? "yellow" : "green"}
            className="apply-start"
          >
            {primaryLabel}
          </TextLink>
          <TextLink
            href={secondaryHref}
            newTab
            arrow={isGreen ? "yellow" : "green"}
            className="apply-start"
          >
            {secondaryLabel}
          </TextLink>
        </div>
      </div>
    </section>
  );
}

/** @deprecated Use HappeningIntro */
export const ApplyIntro = HappeningIntro;
