import { HeroSection } from "./hero-section"
import { WhyChooseSection } from "./why-choose-section"
import { HowItWorksSection } from "./how-it-works-section"
import { Footer } from "./footer"

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <Footer />
    </div>
  )
}