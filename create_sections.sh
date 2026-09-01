#!/bin/bash
SECTIONS=("HeroSection" "TrustStrip" "ProblemSection" "InformationAsymmetry" "SolutionSection" "CareFlowSection" "HowItWorksSection" "FeaturesSection" "FinancialDriftShowcase" "EvidenceSection" "VoiceSection" "ResponsibleAISection" "AccessibilitySection" "DecisionSection" "FinalCTA")

for SECTION in "${SECTIONS[@]}"; do
  cat << INNER_EOF > src/components/landing/$SECTION.tsx
import * as React from "react"
import { motion } from "motion/react"

export function $SECTION() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <h2>$SECTION</h2>
      </div>
    </section>
  )
}
INNER_EOF
done
