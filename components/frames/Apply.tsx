import { copy, applyPageHref } from "@/lib/copy";
import { TextLink } from "@/components/ui/TextLink";

type ApplyIntroProps = {
  variant?: "primary" | "bottom";
};

export function ApplyIntro({ variant = "primary" }: ApplyIntroProps) {
  const sectionId = variant === "bottom" ? "apply-bottom" : "apply";
  const isBottom = variant === "bottom";

  return (
    <section
      id={sectionId}
      data-frame-theme={isBottom ? "green" : "yellow"}
      className={`apply-intro frame ${isBottom ? "frame-green" : "frame-yellow"} js-snap`}
    >
      <div className="apply-intro-inner">
        <h1 className="apply-headline">{copy.apply.headline}</h1>
        <p className="apply-sub">{copy.apply.sub}</p>
        <TextLink
          href={applyPageHref}
          newTab
          arrow={isBottom ? "yellow" : "green"}
          className="apply-start"
        >
          {copy.apply.start}
        </TextLink>
      </div>
    </section>
  );
}
