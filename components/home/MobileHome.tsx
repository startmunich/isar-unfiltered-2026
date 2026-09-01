import type { LogoItem } from "@/components/react-bits/LogoLoop";
import type { Iu25Item } from "@/lib/iu25";
import { ApplyIntro } from "@/components/frames/Apply";
import { MobileCloser } from "@/components/mobile/MobileCloser";
import { MobileFeatures } from "@/components/mobile/MobileFeatures";
import { MobileIntro } from "@/components/mobile/MobileIntro";
import { MobileLanding } from "@/components/mobile/MobileLanding";
import { MobileLookback } from "@/components/mobile/MobileLookback";
import { MobilePartners } from "@/components/mobile/MobilePartners";
import { MobileProgramDays } from "@/components/mobile/MobileProgramDays";
import { MobileProgramIntro } from "@/components/mobile/MobileProgramIntro";
import { MobileReasons } from "@/components/mobile/MobileReasons";

type MobileHomeProps = {
  partnerLogos: LogoItem[];
  lookbackItems: Iu25Item[];
};

export function MobileHome({ partnerLogos, lookbackItems }: MobileHomeProps) {
  return (
    <>
      <MobileLanding />
      <ApplyIntro />
      <MobileIntro />
      <MobileFeatures />
      <MobileProgramIntro />
      <MobileProgramDays />
      <MobileReasons />
      <MobilePartners logos={partnerLogos} />
      <MobileLookback items={lookbackItems} />
      <ApplyIntro variant="bottom" />
      <MobileCloser />
    </>
  );
}
