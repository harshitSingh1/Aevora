"use client"

import * as React from "react"
import { useCase } from "@/lib/context/CaseContext"
import { mockInsurance, mockTimelineEvents } from "@/lib/mock-data"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency, cn } from "@/lib/utils"
import { motion } from "motion/react"
import { InsuranceCoverageBadge } from "@/components/careledger/insurance/InsuranceCoverageBadge"
import { ShieldCheck, FileText, Mic, Copy, AlertTriangle, ArrowRight, CheckCircle2, Link as LinkIcon, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function InsurancePage() {
  const { currentCase } = useCase()
  const insuranceCase = currentCase ? mockInsurance[currentCase.id] : undefined

  if (!insuranceCase) {
    return (
      <div className="flex flex-col h-full bg-background p-4 md:p-8">
        <PageHeader 
          title="Insurance, explained." 
          description="See what your policy or approval appears to cover, what changed, and what you may still need to verify."
          action={
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Add Document
            </Button>
          }
        />
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md mx-auto space-y-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <ShieldCheck className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Insurance reconciliation is incomplete.</h3>
            <p className="text-sm text-muted-foreground">
              Add your insurance approval, authorization, or claim document to compare coverage with the hospital bill.
            </p>
            <Button className="mt-4 gap-2">
              Add Insurance Document <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const { approvalAmount = 0, patientResponsibilityEstimate = 0, lineItems } = insuranceCase
  const finalBill = currentCase?.finalBill || currentCase?.currentBill || 0
  const estimate = currentCase?.originalEstimate || 0
  const additionalCharges = finalBill - estimate
  
  const itemsToVerify = lineItems.filter(item => ["partial", "unknown", "not-approved"].includes(item.status)).length

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex-none p-4 md:p-6 lg:p-8 border-b border-border/50">
        <PageHeader 
          title="Insurance, explained." 
          description="See what your policy or approval appears to cover, what changed, and what you may still need to verify."
          action={
            <div className="flex gap-2">
              <Link href="/documents">
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4 hidden sm:block" />
                  View Documents
                </Button>
              </Link>
              <Link href="/talk?context=insurance">
                <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  <Mic className="h-4 w-4" />
                  <span className="hidden sm:inline">Talk to CareLedger</span>
                  <span className="sm:hidden">Talk</span>
                </Button>
              </Link>
            </div>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-8 md:space-y-12 hide-scrollbar">
        
        {/* OVERVIEW SECTION */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-surface border-border flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Approved</span>
            <span className="text-2xl md:text-3xl font-light text-foreground">{formatCurrency(approvalAmount)}</span>
          </Card>
          <Card className="p-4 bg-surface border-border flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Final Bill</span>
            <span className="text-2xl md:text-3xl font-light text-foreground">{formatCurrency(finalBill)}</span>
          </Card>
          <Card className="p-4 bg-amber-500/10 border-amber-500/20 flex flex-col gap-1 relative overflow-hidden group">
            <div className="absolute top-2 right-2 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
               <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-amber-700 dark:text-amber-500 uppercase tracking-wider">Patient Responsibility</span>
            <span className="text-2xl md:text-3xl font-medium text-foreground">{formatCurrency(patientResponsibilityEstimate)}</span>
          </Card>
          <Card className="p-4 bg-surface border-border flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Items to Verify</span>
            <span className="text-2xl md:text-3xl font-light text-foreground">{itemsToVerify}</span>
          </Card>
          
          <div className="col-span-2 md:col-span-4 mt-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">DEMO CALCULATION:</span> 
              Final responsibility can depend on policy terms, exclusions, deductibles, co-payments, and insurer processing.
            </p>
          </div>
        </section>

        {/* JOURNEY SECTION */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-6 w-1 rounded-full bg-primary/40" />
            <h2 className="text-lg md:text-xl font-medium text-foreground">The Financial Journey</h2>
          </div>
          
          <div className="relative">
            <div className="absolute left-[3.25rem] md:left-[10%] md:right-[10%] top-6 md:top-6 bottom-6 md:bottom-auto md:h-0.5 w-0.5 md:w-auto bg-border/50 hidden md:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-0 relative z-10">
              <JourneyStep title="Hospital Estimate" amount={estimate} align="start" />
              <JourneyStep title="Insurance Approved" amount={approvalAmount} align="center" />
              <JourneyStep title="Final Bill" amount={finalBill} align="center" isWarning={finalBill > estimate} />
              <JourneyStep title="Patient Responsibility" amount={patientResponsibilityEstimate} align="end" isHighlight footnote="*Demo calculation" />
            </div>
          </div>
        </section>

        {/* RECONCILIATION SECTION */}
        <section>
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
               <div className="h-6 w-1 rounded-full bg-accent/60" />
               <h2 className="text-lg md:text-xl font-medium text-foreground">What changed between approval and billing?</h2>
             </div>
          </div>
          
          <Card className="overflow-hidden border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="px-4 md:px-6 py-4 font-medium">Category</th>
                    <th className="px-4 md:px-6 py-4 font-medium text-right">Estimate</th>
                    <th className="px-4 md:px-6 py-4 font-medium text-right">Final Bill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 md:px-6 py-4 font-medium text-foreground">Total care cost</td>
                    <td className="px-4 md:px-6 py-4 text-right text-muted-foreground">{formatCurrency(estimate)}</td>
                    <td className="px-4 md:px-6 py-4 text-right text-foreground">{formatCurrency(finalBill)}</td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 md:px-6 py-4 font-medium text-foreground">Insurance approved</td>
                    <td className="px-4 md:px-6 py-4 text-right text-muted-foreground">-</td>
                    <td className="px-4 md:px-6 py-4 text-right text-emerald-600 dark:text-emerald-500">{formatCurrency(approvalAmount)}</td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors bg-amber-500/5">
                    <td className="px-4 md:px-6 py-4 font-medium text-amber-900 dark:text-amber-500">Additional charges</td>
                    <td className="px-4 md:px-6 py-4 text-right text-muted-foreground">-</td>
                    <td className="px-4 md:px-6 py-4 text-right font-medium text-amber-700 dark:text-amber-500">+{formatCurrency(additionalCharges)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {additionalCharges > 0 && (
              <div className="p-4 md:p-6 bg-muted/30 border-t border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Review recommended
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    The final bill is higher than the original estimate. Check whether additional services were covered, excluded, or require separate authorization.
                  </p>
                </div>
                <Link href="/financial-analysis">
                  <Button variant="outline" size="sm" className="shrink-0 gap-2">
                    Review financial changes <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </section>

        {/* COVERAGE BREAKDOWN */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-6 w-1 rounded-full bg-primary/40" />
            <h2 className="text-lg md:text-xl font-medium text-foreground">Coverage breakdown</h2>
          </div>
          
          <div className="grid gap-3">
            {lineItems.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="p-4 md:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-border/60 hover:border-border transition-colors group">
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-medium text-foreground">{item.category}</h3>
                      <InsuranceCoverageBadge status={item.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{item.explanation}</p>
                    {item.verificationQuestion && (
                       <p className="text-xs text-muted-foreground italic mt-2">&quot;{item.verificationQuestion}&quot;</p>
                    )}
                  </div>
                  
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-1 bg-muted/30 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none">
                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Billed</span>
                      <span className="font-medium text-foreground">{formatCurrency(item.billedAmount || 0)}</span>
                    </div>
                    
                    {item.approvedAmount !== undefined && (
                      <div className="flex flex-col items-end">
                         <span className="text-[10px] text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Approved</span>
                         <span className="text-sm text-emerald-700 dark:text-emerald-500 font-medium">{formatCurrency(item.approvedAmount)}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CHECKLIST & QUESTIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pb-12">
           {/* CHECKLIST */}
           <section>
             <div className="flex items-center gap-2 mb-6">
                <div className="h-6 w-1 rounded-full bg-primary/40" />
                <h2 className="text-lg md:text-xl font-medium text-foreground">Before you pay</h2>
             </div>
             
             <Card className="p-5 md:p-6 bg-surface border-border h-[calc(100%-3rem)]">
               <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Suggested verification checklist</p>
               
               <ul className="space-y-4">
                 {[
                   "Approved treatment matches final treatment",
                   "Additional procedures have authorization",
                   "Room category matches policy",
                   "Diagnostics are covered",
                   "Consumables are explained",
                   "Patient responsibility is calculated correctly"
                 ].map((task, i) => (
                   <li key={i} className="flex items-start gap-3">
                     <div className="mt-0.5 h-4 w-4 rounded border border-primary/30 flex items-center justify-center shrink-0" />
                     <span className="text-sm text-foreground">{task}</span>
                   </li>
                 ))}
               </ul>
             </Card>
           </section>

           {/* QUESTIONS */}
           <section>
             <div className="flex items-center gap-2 mb-6">
                <div className="h-6 w-1 rounded-full bg-accent/60" />
                <h2 className="text-lg md:text-xl font-medium text-foreground">Questions to ask</h2>
             </div>
             
             <div className="space-y-3">
               {[
                 { title: "Coverage", text: "Can you confirm which parts of this treatment are covered under my approval?" },
                 { title: "Additional procedure", text: "Was the additional procedure covered under the existing authorization?" },
                 { title: "Patient responsibility", text: "Can you explain how my final out-of-pocket amount was calculated?" },
                 { title: "Exclusions", text: "Are any of these charges excluded from my coverage?" }
               ].map((q, i) => (
                 <Card key={i} className="p-4 bg-surface border-border group hover:border-primary/30 transition-colors">
                   <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{q.title}</p>
                   <p className="text-sm text-foreground italic">&quot;{q.text}&quot;</p>
                   <div className="flex items-center gap-3 mt-3">
                     <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-foreground -ml-2">
                       <Copy className="h-3.5 w-3.5" />
                       <span className="text-xs">Copy</span>
                     </Button>
                     <Link href="/talk?context=insurance" className="inline-flex">
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-accent hover:text-accent hover:bg-accent/10">
                          <Mic className="h-3.5 w-3.5" />
                          <span className="text-xs">Ask CareLedger</span>
                        </Button>
                     </Link>
                   </div>
                 </Card>
               ))}
             </div>
           </section>
        </div>

        {/* DISCLAIMER */}
        <div className="pb-12 text-center max-w-2xl mx-auto">
          <p className="text-xs text-muted-foreground">
            CareLedger summarizes available information and helps you prepare questions. It does not determine medical necessity, guarantee coverage, or replace professional advice. Always verify final amounts with your insurer and healthcare provider.
          </p>
        </div>
        
      </div>
    </div>
  )
}

function JourneyStep({ 
  title, 
  amount, 
  align = "center", 
  isHighlight = false, 
  isWarning = false,
  footnote
}: { 
  title: string, 
  amount: number, 
  align?: "start" | "center" | "end",
  isHighlight?: boolean,
  isWarning?: boolean,
  footnote?: string
}) {
  return (
    <div className={cn(
      "flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-3 relative",
      align === "start" ? "md:items-start" : align === "end" ? "md:items-end" : "md:items-center"
    )}>
      {/* Visual node */}
      <div className={cn(
        "h-12 w-12 rounded-full border-2 flex items-center justify-center shrink-0 relative z-10 bg-surface",
        isHighlight ? "border-amber-500 text-amber-500" : isWarning ? "border-amber-500/50 text-amber-600" : "border-primary/30 text-primary"
      )}>
        {isHighlight ? <AlertTriangle className="h-5 w-5" /> : isWarning ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5 opacity-70" />}
      </div>
      
      {/* Content */}
      <div className={cn(
        "flex flex-col",
        align === "start" ? "md:text-left" : align === "end" ? "md:text-right" : "md:text-center"
      )}>
        <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
        <span className={cn(
          "text-lg font-semibold",
          isHighlight ? "text-amber-700 dark:text-amber-500" : "text-foreground"
        )}>
          {formatCurrency(amount)}
        </span>
        {footnote && (
          <span className="text-[10px] text-muted-foreground mt-0.5">{footnote}</span>
        )}
      </div>
      
      {/* Mobile connecting line */}
      <div className="absolute left-6 top-12 bottom-[-1.5rem] w-0.5 bg-border/50 md:hidden z-0" />
    </div>
  )
}
