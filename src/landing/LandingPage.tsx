import BenefitRending from './components/BenefitRending';
import MainRending from './components/MainRending';
import FAQRending from './components/FAQRending';
import HeroRending from './components/HeroRending';
import { useEffect } from 'react';

function LandingPage() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('landing-snap');
    document.body.classList.add('landing-snap', 'hide-global-footer');

    return () => {
      html.classList.remove('landing-snap');
      document.body.classList.remove('landing-snap', 'hide-global-footer');
    };
  }, []);

  const style = { ['--header-h' as any]: '96px' };

  return (
    <main style={style}>
      <section id="hero" className="snap-section snap-center">
        <HeroRending />
      </section>
      <section id="main" className="snap-section snap-center">
        <MainRending />
      </section>
      <section id="faq" className="snap-section snap-center">
        <FAQRending />
      </section>
      <section id="benefit" className="snap-section snap-center">
        <BenefitRending />
      </section>
    </main>
  );
}

export default LandingPage;
