import BenefitRending from './components/BenefitRending';
import MainRending from './components/MainRending';
import FAQRending from './components/FAQRending';
import HeroRending from './components/HeroRending';

function LandingPage() {
  return (
    <main className="pt-20 md:pt-30 w-full h-full">
      <HeroRending />
      <MainRending />
      <FAQRending />
      <BenefitRending />
    </main>
  );
}

export default LandingPage;
