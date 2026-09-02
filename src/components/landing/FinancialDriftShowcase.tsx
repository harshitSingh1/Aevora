"use client"
import * as React from "react"
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
import { ArrowDown } from "lucide-react"

export function FinancialDriftShowcase() {
  const items = [
    { label: "Additional procedure", amount: "+₹28,000" },
    { label: "Diagnostics", amount: "+₹17,500" },
    { label: "Room charges", amount: "+₹14,000" },
    { label: "Consumables", amount: "+₹11,400" },
    { label: "Other", amount: "+₹21,500" },
  ]

  return (
    <section className="py-24 md:py-32 bg-slate-900 text-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              When the number changes, <br />
              <span className="text-emerald-400">know why.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl">
              A final bill can look very different from the original estimate. Aevora traces the changes instead of hiding them inside one final number.
            </p>
          </motion.div>

          <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <Card className="bg-slate-800 border-slate-700 p-6 md:p-8 shadow-2xl relative z-10">
              
              {/* Summary */}
              <div className="flex flex-col gap-6 mb-8 relative">
                <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                  <span className="text-slate-400 font-medium">Original Estimate</span>
                  <span className="text-xl font-semibold text-white">₹2,15,000</span>
                </div>
                
                <div className="absolute top-[42px] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 border-[3px] border-slate-800">
                  <ArrowDown className="w-4 h-4" />
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-200 font-semibold">Final Bill</span>
                  <span className="text-2xl font-bold text-white">₹3,07,400</span>
                </div>
              </div>

              {/* Drift */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex justify-between items-center mb-6"
              >
                <div>
                  <p className="text-sm font-semibold text-amber-500">Financial drift detected</p>
                  <p className="text-xs text-amber-500/80 mt-0.5">Review recommended</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-500">+₹92,400</p>
                  <p className="text-sm font-bold text-amber-500">+43%</p>
                </div>
              </motion.div>

              {/* Breakdown */}
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: 0.6 + (idx * 0.1) }}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-medium text-slate-200">{item.amount}</span>
                  </motion.div>
                ))}
              </div>

            </Card>
            
            {/* Background glow */}
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl -z-10 rounded-full transform translate-x-10 translate-y-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
