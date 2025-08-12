import BenefitRending from './components/BenefitRending';
import MainRending from './components/MainRending';
import FAQRending from './components/FAQRending';
import HeroRending from './components/heroRending';

function LandingPage() {
  return (
    <div className="pt-17 md:pt-24">
      <HeroRending />
      <MainRending />
      <FAQRending />
      <BenefitRending />
    </div>
  );
}

export default LandingPage;
