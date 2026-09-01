"use client"
import * as React from "react"
import { motion } from "motion/react"
import { ShieldCheck, UserCircle, Lock, Stethoscope } from "lucide-react"

export function TrustStrip() {
  const items = [
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Evidence-first", desc: "Understand why something was flagged." },
    { icon: <UserCircle className="h-5 w-5" />, title: "Patient-first", desc: "Designed to help people ask better questions." },
    { icon: <Lock className="h-5 w-5" />, title: "Privacy-conscious", desc: "Healthcare information deserves care." },
    { icon: <Stethoscope className="h-5 w-5" />, title: "Not a doctor", desc: "AI assists understanding, not medical decisions." },
  ]

  return (
    <section className="py-12 border-y border-border bg-surface/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex items-start gap-3"
            >
              <div className="mt-0.5 text-primary">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
