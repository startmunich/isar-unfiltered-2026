import { Landing } from "@/components/frames/Landing";
import { Intro } from "@/components/frames/Intro";
import { Features } from "@/components/frames/Features";
import { ProgramIntro, ProgramDays } from "@/components/frames/Program";
import { HappeningIntro } from "@/components/frames/Apply";
import { Reasons } from "@/components/frames/Reasons";
import { Partners } from "@/components/frames/Partners";
import { Lookback } from "@/components/frames/Lookback";
import { Closer } from "@/components/frames/Closer";
import type { LogoItem } from "@/components/react-bits/LogoLoop";

export function DesktopHome({ partnerLogos }: { partnerLogos: LogoItem[] }) {
  return (
    <>
      <Landing />
      <HappeningIntro />
      <Intro />
      <Features />
      <ProgramIntro />
      <ProgramDays />
      <Reasons />
      <HappeningIntro variant="follow" />
      <Partners logos={partnerLogos} />
      <Lookback />
      <HappeningIntro variant="bottom" />
      <Closer />
    </>
  );
}
