import { HeroSection } from "@/components/home/hero-section";
import { FeaturedAppsSection } from "@/components/home/featured-apps-section";
import { PopularToolsSection } from "@/components/home/popular-tools-section";
import { DeveloperSection } from "@/components/home/developer-section";
import { AIToolsSection } from "@/components/home/ai-tools-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { PricingSection } from "@/components/home/pricing-section";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedAppsSection />
      <PopularToolsSection />
      <DeveloperSection />
      <AIToolsSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
    </>
  );
}
