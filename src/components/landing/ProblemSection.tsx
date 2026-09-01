"use client"
import * as React from "react"
import { motion } from "motion/react"
import { FileText } from "lucide-react"

export function ProblemSection() {
  const documents = [
    { name: "Prescription.pdf", rotate: -6, x: -20 },
    { name: "Hospital Estimate.pdf", rotate: 4, x: 15 },
    { name: "Insurance Approval.pdf", rotate: -3, x: -10 },
    { name: "Interim Bill.pdf", rotate: 8, x: 25 },
    { name: "Final Bill.pdf", rotate: -5, x: -5 },
    { name: "Discharge Summary.pdf", rotate: 2, x: 10 },
  ]

  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
              Healthcare is complicated enough. <br className="hidden md:block" />
              <span className="text-muted-foreground">Your bill shouldn&apos;t be.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              A hospital visit can create a trail of estimates, approvals, procedures, medicines, room charges, diagnostics, and bills. Patients often see the final number without seeing how it changed along the way.
            </p>
          </motion.div>

          <div className="relative h-[400px] w-full flex items-center justify-center lg:justify-end pr-8">
            <div className="relative w-64 h-80">
              {documents.map((doc, idx) => (
                <motion.div
                  key={idx}
                  className="absolute inset-0 bg-surface border border-border shadow-md rounded-xl p-4 flex flex-col items-center justify-center gap-3"
                  initial={{ 
                    opacity: 0, 
                    rotate: doc.rotate * 3, 
                    x: doc.x * 3, 
                    y: idx * 20 - 50 
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    rotate: doc.rotate, 
                    x: doc.x, 
                    y: idx * 10 - 25,
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.8, 
                    delay: idx * 0.1, 
                    type: "spring", 
                    stiffness: 100 
                  }}
                  style={{ zIndex: idx }}
                >
                  <FileText className="h-8 w-8 text-primary/40" />
                  <span className="text-sm font-medium text-foreground text-center line-clamp-1 px-2">{doc.name}</span>
                  {/* Mock content lines */}
                  <div className="w-full flex flex-col gap-2 mt-4 px-2 opacity-30">
                    <div className="h-1.5 w-full bg-foreground/20 rounded-full" />
                    <div className="h-1.5 w-5/6 bg-foreground/20 rounded-full" />
                    <div className="h-1.5 w-4/6 bg-foreground/20 rounded-full" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
