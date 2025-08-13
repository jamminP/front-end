import BenefitRending from './components/BenefitRending';
import FAQRending from './components/FAQRending';
import HeroRending from './components/HeroRending';
import { landingThemeVars } from './theme/colors';
import FeatureMosaic from './components/FeatureMosaic';

function LandingPage() {
  return (
    <main style={landingThemeVars} className="pt-20 md:pt-30 w-full h-full">
      <HeroRending />
      <FeatureMosaic />
      <FAQRending />
      <BenefitRending />
    </main>
  );
}

export default LandingPage;
