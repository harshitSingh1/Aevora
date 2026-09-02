"use client"
import * as React from "react"
import { motion } from "motion/react"
import { Building2, User, Link2 } from "lucide-react"

export function InformationAsymmetry() {
  return (
    <section className="py-24 md:py-32 bg-surface/50 border-y border-border overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-4">
            The hospital sees the whole picture. <br />
            <span className="text-muted-foreground">The patient usually sees pieces.</span>
          </h2>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 relative z-10">
            {/* Hospital Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-background rounded-2xl p-8 border border-border shadow-sm flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-6">Hospital side</h3>
              <ul className="space-y-4 text-left w-full max-w-xs mx-auto">
                {["Doctors", "Billing teams", "Insurance departments", "Treatment records", "Pricing information"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Patient Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-background rounded-2xl p-8 border border-border shadow-sm flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                <User className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-6">Patient side</h3>
              <ul className="space-y-4 text-left w-full max-w-xs mx-auto">
                {["Estimate", "Bill", "Insurance message", "Questions"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Connection */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
            className="md:absolute top-1/2 left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 mt-12 md:mt-0 flex flex-col items-center gap-4 bg-surface p-4 rounded-full md:p-6"
          >
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg mx-auto">
              <Link2 className="h-6 w-6" />
            </div>
            <p className="font-semibold text-foreground md:absolute md:top-full md:mt-4 md:w-64 md:-ml-32 md:left-1/2 text-center">
              Aevora connects the pieces.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
