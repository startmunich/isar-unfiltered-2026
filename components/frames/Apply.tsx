import { copy, applyPageHref } from "@/lib/copy";
import { TextLink } from "@/components/ui/TextLink";

type ApplyIntroProps = {
  variant?: "primary" | "bottom";
};

export function ApplyIntro({ variant = "primary" }: ApplyIntroProps) {
  const sectionId = variant === "bottom" ? "apply-bottom" : "apply";

  return (
    <section
      id={sectionId}
      data-frame-theme="yellow"
      className="apply-intro frame frame-yellow js-snap"
    >
      <div className="apply-intro-inner">
        <h1 className="apply-headline">{copy.apply.headline}</h1>
        <p className="apply-sub">{copy.apply.sub}</p>
        <TextLink
          href={applyPageHref}
          newTab
          arrow="green"
          className="apply-start"
        >
          {copy.apply.start}
        </TextLink>
      </div>
    </section>
  );
}
