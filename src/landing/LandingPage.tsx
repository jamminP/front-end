import BenefitRending from "./components/BenefitRending";
import MainRending from "./components/MainRending";
import FAQRending from "./components/FAQRending";

function LandingPage() {
  return (
    <div>
      <MainRending />
      <FAQRending />
      <BenefitRending />
    </div>
  );
}

export default LandingPage;
