import { copy, applyPageHref } from "@/lib/copy";
import { TextLink } from "@/components/ui/TextLink";

export function ApplyIntro() {
  return (
    <section
      id="apply"
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
