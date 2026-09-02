"use client"
import * as React from "react"
import { motion } from "motion/react"

export function SolutionSection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
            Meet Aevora.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-16">
            A patient-side intelligence layer that connects the medical and financial story of a healthcare journey.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
