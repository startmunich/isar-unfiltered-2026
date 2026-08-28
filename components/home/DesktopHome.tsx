import { Landing } from "@/components/frames/Landing";
import { Intro } from "@/components/frames/Intro";
import { Features } from "@/components/frames/Features";
import { ProgramIntro, ProgramDays } from "@/components/frames/Program";
import { ApplyIntro, ApplyForm } from "@/components/frames/Apply";
import { Reasons } from "@/components/frames/Reasons";
import { Partners } from "@/components/frames/Partners";
import { Lookback } from "@/components/frames/Lookback";
import { Closer } from "@/components/frames/Closer";
import type { LogoItem } from "@/components/react-bits/LogoLoop";

export function DesktopHome({ partnerLogos }: { partnerLogos: LogoItem[] }) {
  return (
    <>
      <Landing />
      <ProgramIntro />
      <ProgramDays />
      <ApplyIntro />
      <ApplyForm tree="desktop" />
      <Intro />
      <Features />
      <Reasons />
      <Partners logos={partnerLogos} />
      <Lookback />
      <Closer />
    </>
  );
}
