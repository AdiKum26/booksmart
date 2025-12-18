import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PartnersSection from "@/components/PartnersSection";
import PressSection from "@/components/PressSection";
import TutorialSection from "@/components/TutorialSection";
import StepsSection from "@/components/StepsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <PartnersSection />
        <PressSection />
        <TutorialSection />
        <StepsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
