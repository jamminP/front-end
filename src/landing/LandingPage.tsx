import BenefitLanding from './components/BenefitLanding';
import FAQLanding from './components/FAQLanding';
import HeroLanding from './components/HeroLanding';
import { landingThemeVars } from './theme/colors';
import FeatureMosaic from './components/FeatureMosaic';

function LandingPage() {
  return (
    <main style={landingThemeVars} className="pt-20 md:pt-30 w-full h-full">
      <HeroLanding />
      <FeatureMosaic />
      <FAQLanding />
      <BenefitLanding />
    </main>
  );
}

export default LandingPage;
