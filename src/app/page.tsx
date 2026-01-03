import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PremiumSection } from "@/components/landing/PremiumSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { CallToAction } from "@/components/landing/CallToAction";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-primary/30">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PremiumSection />
      <SecuritySection />
      <CallToAction />
      <Footer />
    </main>
  );
}
