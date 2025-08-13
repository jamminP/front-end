import BenefitRending from './components/BenefitRending';
import MainRending from './components/MainRending';
import FAQRending from './components/FAQRending';
import HeroRending from './components/HeroRending';

function LandingPage() {
  return (
    <main>
      <HeroRending />
      <MainRending />
      <FAQRending />
      <BenefitRending />
    </main>
  );
}

export default LandingPage;
