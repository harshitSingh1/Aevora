"use client"

import * as React from "react"
import { useCase } from "@/lib/context/CaseContext"
import { mockCareOptions } from "@/lib/mock-data"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn, formatCurrency } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"
import { EligibilityIndicator } from "@/components/aevora/care-options/EligibilityIndicator"
import { Mic, Info, ShieldCheck, MapPin, Clock, Stethoscope, ChevronRight, X, HeartPulse, AlertCircle } from "lucide-react"
import Link from "next/link"
import { CarePreferences, CareOption } from "@/types"

export default function CareOptionsPage() {
  const { currentCase } = useCase()
  
  const options = React.useMemo(() => {
    return currentCase ? mockCareOptions[currentCase.id] || [] : []
  }, [currentCase])

  const [priorities, setPriorities] = React.useState<CarePreferences["priorities"]>([])
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(null)

  const togglePriority = (p: CarePreferences["priorities"][number]) => {
    setPriorities(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  // Sort options based on priorities
  const sortedOptions = React.useMemo(() => {
    if (priorities.length === 0) return options
    
    return [...options].sort((a, b) => {
      let scoreA = 0
      let scoreB = 0
      
      if (priorities.includes("cost")) {
        if (a.type !== "private") scoreA += 1
        if (b.type !== "private") scoreB += 1
      }
      if (priorities.includes("coverage")) {
        if (a.insuranceStatus === "possible") scoreA += 1
        if (b.insuranceStatus === "possible") scoreB += 1
      }
      if (priorities.includes("eligibility")) {
        if (a.eligibility === "likely") scoreA += 1
        if (b.eligibility === "likely") scoreB += 1
      }
      if (priorities.includes("waiting")) {
         if (a.waitingTime === "Usually lower") scoreA += 1
         if (b.waitingTime === "Usually lower") scoreB += 1
      }
      if (priorities.includes("distance")) {
        // Just a simple heuristic for mock
        if (a.distance === "8 km") scoreA += 1
        if (b.distance === "8 km") scoreB += 1
      }
      
      return scoreB - scoreA
    })
  }, [options, priorities])

  if (options.length === 0) {
    return (
      <div className="flex flex-col h-full bg-background p-4 md:p-8">
        <PageHeader 
          title="Explore your care options." 
          description="Compare potential care settings using cost, coverage, eligibility, access, and practical requirements."
        />
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md mx-auto space-y-4">
             <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Stethoscope className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Start with a treatment.</h3>
            <p className="text-sm text-muted-foreground">
              Start with a treatment or care question to compare available pathways.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex-none p-4 md:p-6 lg:p-8 border-b border-border/50">
        <PageHeader 
          title="Explore your care options." 
          description="Compare potential care settings using cost, coverage, eligibility, access, and practical requirements."
          action={
            <Link href="/talk?context=care-option">
              <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Ask Aevora</span>
                <span className="sm:hidden">Ask</span>
              </Button>
            </Link>
          }
        />
        <div className="mt-4 p-3 bg-muted/40 rounded-lg border border-border/50 text-xs text-muted-foreground flex items-start gap-2">
           <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
           <p>
             <strong>Aevora does not determine which treatment is medically appropriate.</strong> Discuss treatment choices with a qualified healthcare professional.
           </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-8 md:space-y-12 hide-scrollbar">
        
        {/* INPUT & PRIORITIES */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-6 bg-surface border border-border rounded-xl">
             <div>
               <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">What are you exploring?</p>
               <p className="text-sm font-medium text-foreground">{currentCase?.title || "Knee replacement"}</p>
             </div>
             <div>
               <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Location</p>
               <p className="text-sm font-medium text-foreground">Meerut</p>
             </div>
             <div>
               <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Coverage</p>
               <p className="text-sm font-medium text-foreground">Demo Health Insurance</p>
             </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-1 rounded-full bg-accent/60" />
              <h2 className="text-lg font-medium text-foreground">What matters most to you?</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { id: "cost", label: "Lower cost" },
                { id: "coverage", label: "Insurance coverage" },
                { id: "waiting", label: "Shorter waiting time" },
                { id: "distance", label: "Nearby" },
                { id: "eligibility", label: "Scheme eligibility" }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => togglePriority(p.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                    priorities.includes(p.id as any)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface text-muted-foreground border-border hover:border-primary/30"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section>
          {priorities.length > 0 && (
             <div className="mb-4">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-500">
                  Options sorted by best match for your selected priorities.
                </p>
             </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <AnimatePresence>
              {sortedOptions.map((opt, idx) => (
                <motion.div
                  key={opt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Card className={cn(
                    "flex flex-col h-full bg-surface border transition-all duration-300",
                    selectedOptionId === opt.id ? "border-primary ring-1 ring-primary/20" : "border-border hover:border-primary/30"
                  )}>
                     <div className="p-5 border-b border-border/50 flex-none">
                       <div className="flex items-start justify-between gap-4">
                         <h3 className="font-semibold text-lg text-foreground">{opt.name}</h3>
                         <div className={cn(
                           "px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider",
                           opt.type === "private" ? "bg-blue-500/10 text-blue-700 dark:text-blue-500" :
                           opt.type === "government" ? "bg-amber-500/10 text-amber-700 dark:text-amber-500" :
                           "bg-emerald-500/10 text-emerald-700 dark:text-emerald-500"
                         )}>
                           {opt.type}
                         </div>
                       </div>
                       
                       <div className="mt-4">
                         <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Estimated Cost</p>
                         <p className={cn(
                           "font-medium",
                           opt.estimatedCost?.min ? "text-xl text-foreground" : "text-md text-emerald-700 dark:text-emerald-500"
                         )}>
                           {opt.estimatedCost?.min 
                             ? `${formatCurrency(opt.estimatedCost.min)} – ${formatCurrency(opt.estimatedCost.max!)}`
                             : opt.estimatedCost?.label
                           }
                         </p>
                         <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                           <AlertCircle className="h-3 w-3" />
                           {opt.evidenceLevel === "low" ? "Requires confirmation" : "Estimated"}
                         </p>
                       </div>
                     </div>
                     
                     <div className="flex-1 p-5 space-y-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Insurance & Scheme</p>
                          <EligibilityIndicator status={opt.eligibility} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/30">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Waiting</p>
                            <p className="text-sm font-medium text-foreground">{opt.waitingTime}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Distance</p>
                            <p className="text-sm font-medium text-foreground">{opt.distance}</p>
                          </div>
                        </div>
                     </div>
                     
                     <div className="p-4 border-t border-border/50 mt-auto">
                        <Button 
                          variant={selectedOptionId === opt.id ? "default" : "outline"} 
                          className="w-full"
                          onClick={() => setSelectedOptionId(opt.id === selectedOptionId ? null : opt.id)}
                        >
                          {selectedOptionId === opt.id ? "Hide details" : "View details"}
                        </Button>
                     </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* DETAILS SECTION */}
        <AnimatePresence mode="wait">
          {selectedOptionId && (
            <motion.section
              key="details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-border">
                {(() => {
                  const opt = sortedOptions.find(o => o.id === selectedOptionId)
                  if (!opt) return null
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                       <div className="lg:col-span-2 space-y-6">
                          <div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">Before you choose</h2>
                            <p className="text-sm text-muted-foreground mb-4">{opt.notes}</p>
                          </div>
                          
                          <Card className="p-5 md:p-6 bg-surface border-border">
                             <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Verification Checklist</p>
                             <ul className="space-y-4">
                               {opt.verificationItems?.map((task, i) => (
                                 <li key={i} className="flex items-start gap-3">
                                   <div className="mt-0.5 h-4 w-4 rounded border border-primary/30 flex items-center justify-center shrink-0" />
                                   <span className="text-sm text-foreground">{task}</span>
                                 </li>
                               ))}
                             </ul>
                          </Card>
                          
                          <Card className="p-5 md:p-6 bg-amber-500/5 border-amber-500/20">
                             <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-500 mb-2 flex items-center gap-2">
                               <AlertCircle className="h-4 w-4" />
                               Data Status: {opt.evidenceLevel === "low" ? "Requires confirmation" : "Estimated"}
                             </h4>
                             <p className="text-sm text-muted-foreground">
                               Cost and eligibility are informational estimates based on demographic or benchmark data. They do not represent a guaranteed quote or medical recommendation.
                             </p>
                          </Card>
                       </div>
                       
                       <div className="space-y-4">
                         <h3 className="text-lg font-medium text-foreground">Questions for your doctor</h3>
                         <div className="space-y-3">
                           {[
                             "Are there medically appropriate alternatives I should know about?",
                             "Would this procedure be appropriate at another facility?",
                             "Would waiting for another facility affect my treatment?",
                             "Would I need a referral to access this option?"
                           ].map((q, i) => (
                             <Card key={i} className="p-4 bg-surface border-border hover:border-primary/30 transition-colors">
                               <p className="text-sm text-foreground italic">&quot;{q}&quot;</p>
                             </Card>
                           ))}
                         </div>
                       </div>
                    </div>
                  )
                })()}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* TRUST SECTION */}
        <div className="pt-12 pb-8 border-t border-border mt-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
             <HeartPulse className="h-8 w-8 text-primary mx-auto opacity-50" />
             <h2 className="text-2xl font-light tracking-tight text-foreground">Cost is one factor. Care is bigger than cost.</h2>
             <p className="text-sm text-muted-foreground">
               A lower-cost option may involve different availability, waiting time, eligibility requirements, travel, or clinical considerations. Always discuss medically appropriate options with your healthcare professional.
             </p>
          </div>
        </div>

      </div>
    </div>
  )
}
