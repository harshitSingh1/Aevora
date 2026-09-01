"use client"
import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, ArrowDown } from "lucide-react"

// Reuse components if possible, or build simple mock versions for the hero
// Since we have CareFlow, FinancialDriftIndicator, let's just build a custom composite here 
// that mimics them to avoid complex prop requirements of the real ones, or we can use the real ones if they are simple enough.
// For the hero, a highly controlled animated SVG or set of divs is often better to match the prompt's exact sequence.

const heroDemo = {
  originalEstimate: 215000,
  insuranceApproved: 180000,
  finalBill: 307400,
  financialDrift: 92400,
  financialDriftPercent: 43,
}

export function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-background -z-10" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <motion.div 
            className="flex flex-col gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Know what you&apos;re agreeing to. <br className="hidden md:block" />
                <span className="text-primary">Before you pay for it.</span>
              </h1>
            </motion.div>
            
            <motion.div variants={item}>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                CareLedger connects your treatment, hospital estimates, insurance, and bills to show where your healthcare costs come from — and what you should verify before paying.
              </p>
            </motion.div>
            
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto h-14 text-base px-8">
                  Explore Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 text-base px-8 bg-surface">
                  See How It Works <ArrowDown className="ml-2 h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={item} className="mt-4 p-4 rounded-xl bg-surface/50 border border-border/50 max-w-xl">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground font-medium">Built for clarity, not diagnosis.</strong><br/>
                CareLedger helps users understand healthcare documents and financial decisions. It does not replace their doctor.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Product Visualization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="relative lg:ml-auto w-full max-w-md mx-auto lg:mx-0"
          >
            <motion.div 
              animate={{ y: [0, -6, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Card className="p-6 bg-surface shadow-2xl shadow-primary/10 border-border/50 backdrop-blur-sm">
                
                <div className="flex flex-col gap-6 relative">
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border -z-10" />

                  {/* Node 1 */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface border-2 border-primary flex items-center justify-center shrink-0 z-10 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Recommendation</p>
                      <p className="text-sm text-muted-foreground">Procedure recommended</p>
                    </div>
                  </motion.div>

                  {/* Node 2 */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface border-2 border-primary flex items-center justify-center shrink-0 z-10 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Estimate</p>
                      <p className="text-sm font-semibold text-foreground">₹2,15,000</p>
                    </div>
                  </motion.div>

                  {/* Node 3 */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface border-2 border-emerald-500 flex items-center justify-center shrink-0 z-10 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Insurance</p>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-500">₹1,80,000 approved</p>
                    </div>
                  </motion.div>

                  {/* Node 4 */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.7 }} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface border-2 border-primary flex items-center justify-center shrink-0 z-10 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Treatment</p>
                    </div>
                  </motion.div>

                  {/* Node 5 */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.0 }} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface border-2 border-amber-500 flex items-center justify-center shrink-0 z-10 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    </div>
                    <div className="w-full">
                      <p className="font-medium text-foreground">Final Bill</p>
                      <p className="text-lg font-bold text-foreground">₹3,07,400</p>
                      
                      {/* Drift Alert */}
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        transition={{ delay: 2.5 }}
                        className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-amber-700 dark:text-amber-500">Financial Drift</span>
                          <span className="text-sm font-bold text-amber-700 dark:text-amber-500">+43%</span>
                        </div>
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-500">+₹92,400</span>
                      </motion.div>

                      {/* Clarification Alert */}
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ delay: 3.0 }}
                        className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        3 items need clarification
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
