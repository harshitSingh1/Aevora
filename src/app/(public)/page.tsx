import * as React from "react"
import { HeroSection } from "@/components/landing/HeroSection"
import { TrustStrip } from "@/components/landing/TrustStrip"
import { ProblemSection } from "@/components/landing/ProblemSection"
import { InformationAsymmetry } from "@/components/landing/InformationAsymmetry"
import { SolutionSection } from "@/components/landing/SolutionSection"
import { CareFlowSection } from "@/components/landing/CareFlowSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { FinancialDriftShowcase } from "@/components/landing/FinancialDriftShowcase"
import { EvidenceSection } from "@/components/landing/EvidenceSection"
import { VoiceSection } from "@/components/landing/VoiceSection"
import { ResponsibleAISection } from "@/components/landing/ResponsibleAISection"
import { AccessibilitySection } from "@/components/landing/AccessibilitySection"
import { DecisionSection } from "@/components/landing/DecisionSection"
import { FinalCTA } from "@/components/landing/FinalCTA"

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <HeroSection />
      <TrustStrip />
      <ProblemSection />
      <InformationAsymmetry />
      <SolutionSection />
      <CareFlowSection />
      <HowItWorksSection />
      <FeaturesSection />
      <FinancialDriftShowcase />
      <EvidenceSection />
      <VoiceSection />
      <ResponsibleAISection />
      <AccessibilitySection />
      <DecisionSection />
      <FinalCTA />
    </div>
  )
}
