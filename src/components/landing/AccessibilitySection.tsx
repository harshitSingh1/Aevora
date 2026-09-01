"use client"
import * as React from "react"
import { motion } from "motion/react"
import { Eye, Smartphone, MousePointer2 } from "lucide-react"

export function AccessibilitySection() {
  const items = [
    { title: "High Contrast", desc: "Passes WCAG AA standards for legibility.", icon: <Eye className="w-5 h-5" /> },
    { title: "Touch Optimized", desc: "Large touch targets and spaced controls.", icon: <Smartphone className="w-5 h-5" /> },
    { title: "Screen Reader Ready", desc: "Semantic HTML and ARIA labels.", icon: <MousePointer2 className="w-5 h-5" /> },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-5xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/3"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Built for everyone.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Healthcare affects all of us. CareLedger is designed to be accessible, legible, and easy to navigate regardless of how you use your device.
            </p>
          </motion.div>

          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
