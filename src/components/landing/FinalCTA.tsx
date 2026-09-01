"use client"
import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute inset-0 bg-background -z-20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -z-10" />
      
      <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            Take control of your <br className="hidden md:block" />
            <span className="text-primary">healthcare story.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
            Start connecting your estimates, approvals, and bills today. Free for patients.
          </p>
          
          <Link href="/dashboard">
            <Button size="lg" className="h-14 text-base px-10 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Analyze My Documents <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <p className="text-sm text-muted-foreground mt-8">
            No credit card required. Secure and private.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
