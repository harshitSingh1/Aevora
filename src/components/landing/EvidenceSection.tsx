"use client"
import * as React from "react"
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
import { AlertCircle, FileText } from "lucide-react"

export function EvidenceSection() {
  return (
    <section className="py-24 md:py-32 bg-background border-t border-border overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            Don&apos;t just flag it. <br />
            <span className="text-primary">Show the evidence.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            CareLedger should explain why something was flagged and show the information that led to the finding.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-5xl mx-auto">
          
          {/* Document Preview (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className="bg-surface border border-border rounded-xl p-4 md:p-8 h-full shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Final Bill.pdf</span>
              </div>
              
              <div className="space-y-4 opacity-40">
                <div className="flex justify-between">
                  <div className="h-2 w-32 bg-foreground/50 rounded" />
                  <div className="h-2 w-16 bg-foreground/50 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-2 w-40 bg-foreground/50 rounded" />
                  <div className="h-2 w-16 bg-foreground/50 rounded" />
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, backgroundColor: "rgba(234, 179, 8, 0)" }}
                whileInView={{ opacity: 1, backgroundColor: "rgba(234, 179, 8, 0.2)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="my-4 -mx-2 px-2 py-3 rounded border border-amber-500/50 flex justify-between items-center"
              >
                <div className="space-y-2">
                  <div className="h-2 w-36 bg-foreground/80 rounded" />
                  <div className="h-2 w-24 bg-foreground/50 rounded" />
                </div>
                <div className="font-bold text-foreground">₹28,000</div>
              </motion.div>

              <div className="space-y-4 opacity-40">
                <div className="flex justify-between">
                  <div className="h-2 w-28 bg-foreground/50 rounded" />
                  <div className="h-2 w-16 bg-foreground/50 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-2 w-32 bg-foreground/50 rounded" />
                  <div className="h-2 w-16 bg-foreground/50 rounded" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Finding Card (Right) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <Card className="p-6 md:p-8 bg-background border-border shadow-lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-700 dark:text-amber-500 mb-1">Needs clarification</h3>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg text-foreground">Additional procedure</span>
                      <span className="font-bold text-lg text-foreground">₹28,000</span>
                    </div>
                  </div>
                </div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5 }}
                  className="text-foreground leading-relaxed mb-6"
                >
                  Added after the original estimate.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.8 }}
                  className="mb-6 bg-surface p-4 rounded-lg border border-border"
                >
                  <p className="text-sm font-semibold text-foreground mb-2">Evidence:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Hospital estimate</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Insurance approval</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Final bill</li>
                  </ul>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2.1 }}
                  className="bg-primary/5 p-4 rounded-lg border border-primary/10"
                >
                  <p className="text-sm font-semibold text-primary mb-1">Recommended question:</p>
                  <p className="text-sm text-foreground font-medium italic">
                    &quot;Could you explain why this procedure was added after the original estimate?&quot;
                  </p>
                </motion.div>
              </Card>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
