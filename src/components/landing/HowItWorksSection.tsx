"use client"
import * as React from "react"
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Upload",
      desc: "Add your estimate, insurance approval, bills, prescription, or discharge summary.",
    },
    {
      num: "02",
      title: "Connect",
      desc: "CareLedger connects the documents into one treatment and financial timeline.",
    },
    {
      num: "03",
      title: "Understand",
      desc: "AI identifies meaningful changes, inconsistencies, and areas that need clarification.",
    },
    {
      num: "04",
      title: "Act",
      desc: "Get clear questions, explanations, and next steps.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-background scroll-mt-16">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            From documents to clarity.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <Card className="p-8 h-full bg-surface border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-6xl font-black text-primary/5 transition-transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:translate-x-2 duration-500">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4 relative z-10">
                  <span className="text-primary mr-2">{step.num} —</span>
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  {step.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
