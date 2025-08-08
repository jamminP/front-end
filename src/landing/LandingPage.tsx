import BenefitRending from './components/BenefitRending';
import MainRending from './components/MainRending';
import FAQRending from './components/FAQRending';

function LandingPage() {
  return (
    <div className="pt-30">
      <MainRending />
      <FAQRending />
      <BenefitRending />
    </div>
  );
}

export default LandingPage;
