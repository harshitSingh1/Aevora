"use client"
import * as React from "react"
import { motion } from "motion/react"
import { BrainCircuit, Activity, Pill, ShieldAlert, FileSearch } from "lucide-react"

export function ResponsibleAISection() {
  const principles = [
    {
      title: "We don't diagnose.",
      desc: "Aevora helps users understand information, not identify diseases.",
      icon: <Activity className="w-6 h-6" />
    },
    {
      title: "We don't prescribe.",
      desc: "Treatment and medication changes should be discussed with qualified professionals.",
      icon: <Pill className="w-6 h-6" />
    },
    {
      title: "We don't accuse.",
      desc: "A potential discrepancy is not automatically fraud. It's a starting point for questions.",
      icon: <ShieldAlert className="w-6 h-6" />
    },
    {
      title: "We show uncertainty.",
      desc: "Evidence and confidence matter. We tell you when information is missing or unclear.",
      icon: <FileSearch className="w-6 h-6" />
    }
  ]

  return (
    <section id="responsible-ai" className="py-24 md:py-32 bg-surface/30 border-y border-border scroll-mt-16">
      <div className="container mx-auto px-4 md:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
            AI should clarify healthcare. <br />
            <span className="text-muted-foreground">Not make healthcare decisions for you.</span>
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Hub (Desktop) */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-2xl bg-primary/10 text-primary items-center justify-center z-10 border border-primary/20">
            <BrainCircuit className="w-10 h-10" />
          </div>

          {/* Lines */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 z-0" />
          <div className="hidden md:block absolute top-0 left-1/2 h-full w-px bg-border -translate-x-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 relative z-10">
            {principles.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`bg-background p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center ${
                  idx === 0 ? "md:-translate-y-8 md:-translate-x-4" : 
                  idx === 1 ? "md:-translate-y-8 md:translate-x-4" :
                  idx === 2 ? "md:translate-y-8 md:-translate-x-4" :
                  "md:translate-y-8 md:translate-x-4"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
