import CheckoutModal from "@/components/CheckoutModal";
import Dosing from "@/components/Dosing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import SpecStrip from "@/components/SpecStrip";
import SupplementFacts from "@/components/SupplementFacts";
import ValueMath from "@/components/ValueMath";
import WhyPills from "@/components/WhyPills";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SpecStrip />
        <WhyPills />
        <SupplementFacts />
        <Dosing />
        <ValueMath />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <CheckoutModal />
    </>
  );
}
