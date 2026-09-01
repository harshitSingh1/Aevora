"use client"
import * as React from "react"
import { motion } from "motion/react"
import { Check, X } from "lucide-react"

export function DecisionSection() {
  const alone = [
    "Manually comparing PDFs",
    "Missing changed procedure codes",
    "Unsure what to ask the hospital",
    "Accepting the final bill as absolute",
  ]

  const withCareLedger = [
    "Automated timeline construction",
    "Highlighted financial drift",
    "Specific, evidence-based questions",
    "Confidence in what you owe",
  ]

  return (
    <section className="py-24 md:py-32 bg-surface/50 border-t border-border overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-4">
            The difference is clarity.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          {/* Without CareLedger */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-background rounded-2xl p-8 border border-border shadow-sm"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6">Navigating Alone</h3>
            <ul className="space-y-4">
              {alone.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                  <X className="w-5 h-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With CareLedger */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-primary/5 rounded-2xl p-8 border border-primary/20 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-xl font-semibold text-primary mb-6 relative z-10">With CareLedger</h3>
            <ul className="space-y-4 relative z-10">
              {withCareLedger.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-foreground">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
