"use client"
import * as React from "react"
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
import { LineChart, Search, Scale, Map, UserPlus, Mic } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      title: "Financial Drift",
      desc: "See exactly how healthcare costs changed from the original estimate to the final bill.",
      icon: <LineChart className="h-6 w-6" />,
      colSpan: "md:col-span-2 lg:col-span-2",
    },
    {
      title: "Evidence-Based Review",
      desc: "Understand which charges are supported by documents and which need clarification.",
      icon: <Search className="h-6 w-6" />,
      colSpan: "md:col-span-1 lg:col-span-1",
    },
    {
      title: "Insurance Reconciliation",
      desc: "Compare hospital estimates, insurance approvals, and final responsibility.",
      icon: <Scale className="h-6 w-6" />,
      colSpan: "md:col-span-1 lg:col-span-1",
    },
    {
      title: "Care Options",
      desc: "Explore potential care pathways using coverage, eligibility, access, and requirements - not price alone.",
      icon: <Map className="h-6 w-6" />,
      colSpan: "md:col-span-2 lg:col-span-2",
    },
    {
      title: "Patient Advocacy",
      desc: "Get specific questions to ask your doctor, hospital, or insurer based on actual documents.",
      icon: <UserPlus className="h-6 w-6" />,
      colSpan: "md:col-span-1 lg:col-span-1",
    },
    {
      title: "Talk to CareLedger",
      desc: "Ask questions naturally using voice and receive concise, context-aware answers.",
      icon: <Mic className="h-6 w-6" />,
      colSpan: "md:col-span-2 lg:col-span-2",
    },
  ]

  return (
    <section id="features" className="py-24 md:py-32 bg-surface/30 border-y border-border scroll-mt-16">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20 max-w-3xl"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            One patient. <br />
            <span className="text-primary">One healthcare story.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className={feature.colSpan}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="h-full p-8 bg-background border-border shadow-sm flex flex-col hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
