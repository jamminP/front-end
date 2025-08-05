import BenefitRending from "./components/BenefitRending";
import MainRending from "./components/MainRending";
import UseCaseRending from "./components/UseCaseRending";

function LandingPage() {
  return (
    <div>
      <MainRending />
      <UseCaseRending />
      <BenefitRending />
    </div>
  );
}

export default LandingPage;
