"use client"
import * as React from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { Card } from "@/components/ui/card"

export function CareFlowSection() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  const nodes = [
    { label: "Recommendation", desc: "Procedure recommended", color: "bg-primary" },
    { label: "Estimate", desc: "₹2,15,000", color: "bg-primary", bold: true },
    { label: "Insurance", desc: "₹1,80,000 approved", color: "bg-emerald-500", textClass: "text-emerald-600 dark:text-emerald-500", bold: true },
    { label: "Treatment", desc: "Additional procedure added", color: "bg-primary" },
    { label: "Final Bill", desc: "₹3,07,400", color: "bg-amber-500", bold: true },
  ]

  return (
    <section className="py-24 md:py-32 bg-surface border-y border-border" ref={containerRef}>
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="max-w-3xl mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            Follow the story. <br />
            <span className="text-muted-foreground">Not just the bill.</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            CareLedger connects what was recommended, what was estimated, what insurance approved, what happened during treatment, and what finally appeared on the bill.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-[27px] md:left-1/2 top-4 bottom-4 w-1 bg-border rounded-full -translate-x-1/2 z-0" />
          
          <motion.div 
            className="absolute left-[27px] md:left-1/2 top-4 bottom-4 w-1 bg-primary rounded-full -translate-x-1/2 z-0 origin-top"
            style={{ scaleY: scrollYProgress }}
          />

          <div className="flex flex-col gap-12 md:gap-24 relative z-10">
            {nodes.map((node, idx) => {
              const nodeStart = idx * 0.15
              const nodeEnd = nodeStart + 0.1

              // opacity and scale animations based on scroll
              return (
                <div key={idx} className={`flex items-center gap-6 md:gap-12 ${idx % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"}`}>
                  <div className={`hidden md:block w-1/2 ${idx % 2 === 0 ? "text-left" : "text-right"}`} />
                  
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ margin: "-100px", once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-surface border-4 border-background shadow-sm"
                  >
                    <div className={`w-4 h-4 rounded-full ${node.color}`} />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-100px", once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full md:w-1/2"
                  >
                    <Card className="p-6 shadow-md border-border/50 bg-background inline-block">
                      <p className="font-semibold text-lg text-foreground mb-1">{node.label}</p>
                      <p className={`text-base ${node.bold ? "font-bold text-xl" : "text-muted-foreground"} ${node.textClass || ""}`}>
                        {node.desc}
                      </p>
                    </Card>
                  </motion.div>
                </div>
              )
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px", once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-24 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-500 text-xl font-bold">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              +43% financial drift detected
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
