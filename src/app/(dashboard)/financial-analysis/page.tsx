"use client"
import * as React from "react"
import { useCase } from "@/lib/context/CaseContext"
import { mockCharges, mockFindings } from "@/lib/mock-data"
import { formatCurrency, calculateFinancialDrift, calculateDriftPercentage, calculatePatientResponsibility, calculateCategoryTotals, cn } from "@/lib/utils"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, BarChart, Bar, Cell } from "recharts"
import { ArrowRight, AlertCircle, FileText, CheckCircle2, Mic, Receipt, Info, Download, Bookmark } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { EvidenceLevelBadge } from "@/components/aevora/EvidenceLevelBadge"
import { FinancialDriftIndicator } from "@/components/aevora/FinancialDriftIndicator"

export default function FinancialAnalysisPage() {
  const { currentCase } = useCase()
  
  const charges = React.useMemo(() => {
    return currentCase ? (mockCharges[currentCase.id] || []) : []
  }, [currentCase])

  const findings = React.useMemo(() => {
    return currentCase ? (mockFindings[currentCase.id] || []) : []
  }, [currentCase])

  const [showHowWeGotHere, setShowHowWeGotHere] = React.useState(false)

  if (!currentCase || charges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center text-muted-foreground mb-6">
          <Receipt className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Nothing to analyze yet.</h2>
        <p className="text-muted-foreground mb-8">
          Upload a hospital bill or original estimate to start tracking your financial commitment.
        </p>
        <Button>Upload Document &rarr;</Button>
      </div>
    )
  }

  const originalEstimate = currentCase.originalEstimate
  const finalBill = currentCase.finalBill || currentCase.currentBill
  const drift = calculateFinancialDrift(originalEstimate, finalBill)
  const driftPercent = calculateDriftPercentage(originalEstimate, finalBill)
  
  const patientResponsibility = calculatePatientResponsibility(finalBill, currentCase.insuranceApproved)

  // Chart data: Progression
  const chartData = [
    { date: "Aug 12", value: 0 },
    { date: "Aug 13", value: originalEstimate },
    { date: "Aug 14", value: originalEstimate },
    { date: "Aug 16", value: originalEstimate },
    { date: "Aug 18", value: 243000, event: "Additional procedure", change: 28000, status: "Needs clarification" },
    { date: "Aug 19", value: 274000, event: "Diagnostics", change: 31000, status: "Needs clarification" },
    { date: "Aug 20", value: finalBill, event: "Final Bill", change: 33400, status: "Verified" },
  ]

  // Chart data: Category
  const categoryTotals = calculateCategoryTotals(charges)
  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value)

  const itemsNeedingClarification = findings.filter(f => f.status === "needs-clarification" || f.status === "anomaly" || f.status === "discrepancy").length

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 pb-24 md:pb-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Financial Intelligence</h1>
          <p className="text-muted-foreground">Understand how your healthcare costs changed throughout your care journey.</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold uppercase text-muted-foreground">Demo Case</p>
            <p className="font-semibold">{currentCase.patientName}</p>
            <p className="text-xs text-muted-foreground">{currentCase.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2"><Bookmark className="w-4 h-4" /> Save review</Button>
            <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export summary</Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Summary & Drift */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Hero Financial Summary */}
          <Card className="p-6 md:p-8 overflow-hidden relative border-border shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-6 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Original Estimate</p>
                    <p className="text-2xl font-semibold text-foreground">{formatCurrency(originalEstimate)}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted-foreground/30 hidden md:block" />
                  <div className="text-right md:text-left">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Final Bill</p>
                    <p className="text-3xl font-bold text-foreground">{formatCurrency(finalBill)}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex items-baseline gap-3 mb-2">
                    <p className="text-sm font-semibold text-muted-foreground">Financial Drift</p>
                    <span className="text-xl font-bold text-amber-600 dark:text-amber-500">
                      +{formatCurrency(drift)}
                    </span>
                    <span className="text-sm font-bold text-amber-600/70 dark:text-amber-500/70">
                      +{driftPercent}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Your final bill is {formatCurrency(drift)} higher than the original estimate.</p>
                  
                  {itemsNeedingClarification > 0 && (
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-700 dark:text-amber-500 px-3 py-1.5 rounded-full text-sm font-medium">
                      <AlertCircle className="w-4 h-4" />
                      {itemsNeedingClarification} items need clarification
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                <Button size="lg" className="w-full text-base font-semibold py-6 shadow-md" onClick={() => setShowHowWeGotHere(true)}>
                  How did I get here?
                </Button>
                <Link href="/talk" className="w-full">
                  <Button variant="outline" size="lg" className="w-full gap-2 text-primary border-primary/20 hover:bg-primary/5">
                    <Mic className="w-4 h-4" /> Talk to Aevora
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Financial Drift Graph */}
          <Card className="p-6 md:p-8 border-border shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight mb-1">Financial Drift</h2>
              <p className="text-sm text-muted-foreground">See where your financial commitment changed during the care journey.</p>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    dx={-10}
                  />
                  <RechartsTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border border-border p-4 rounded-lg shadow-lg z-50">
                            <p className="font-semibold text-sm mb-1">{data.date}</p>
                            {data.event && <p className="text-sm font-medium mb-3">{data.event}</p>}
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Financial commitment</p>
                              <p className="font-bold text-lg">{formatCurrency(data.value)}</p>
                            </div>
                            {data.change > 0 && (
                              <div className="mt-2 pt-2 border-t border-border flex justify-between gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Change</p>
                                  <p className="text-sm font-semibold text-amber-600 dark:text-amber-500">+{formatCurrency(data.change)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">Status</p>
                                  <p className="text-sm font-medium text-amber-600 dark:text-amber-500">{data.status}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="stepAfter" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "hsl(var(--surface))", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
              <Info className="w-3 h-3" /> Note: This graph represents financial commitment based on documents, not medical severity.
            </p>
          </Card>
          
          {/* Final Bill by Category */}
          <Card className="p-6 md:p-8 border-border shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight mb-1">Final bill by category</h2>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 500 }} />
                  <RechartsTooltip 
                    cursor={{ fill: 'hsl(var(--accent)/0.1)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border border-border p-3 rounded-md shadow-md">
                            <p className="text-sm font-medium text-muted-foreground">{data.name}</p>
                            <p className="text-lg font-bold">{formatCurrency(data.value)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="hsl(var(--primary))" fillOpacity={0.8 - (index * 0.05)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Column: Findings & Action Items */}
        <div className="space-y-8">
          
          {/* Findings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Findings</h2>
                <p className="text-sm text-muted-foreground">Areas that may deserve a closer look.</p>
              </div>
            </div>

            <div className="space-y-4">
              {findings.map(finding => (
                <Link key={finding.id} href={`/bill-review?finding=${finding.id}`} className="block">
                  <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer group shadow-sm bg-surface">
                    <div className="flex justify-between items-start mb-2">
                      <p className={cn("text-xs font-semibold uppercase tracking-wider", finding.status === "needs-clarification" || finding.status === "anomaly" ? "text-amber-600 dark:text-amber-500" : (finding.status === "discrepancy" ? "text-destructive" : "text-muted-foreground"))}>
                        {finding.status.replace("-", " ")}
                      </p>
                      {finding.amount && (
                        <p className="font-bold text-sm">
                          {formatCurrency(finding.amount)}
                        </p>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{finding.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {finding.explanation}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <EvidenceLevelBadge level={finding.evidenceLevel} />
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Insurance Reconciliation */}
          <Card className="p-6 bg-surface shadow-sm border-border">
            <h2 className="text-lg font-bold tracking-tight mb-4">Insurance vs patient responsibility</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Original estimate</span>
                <span className="font-medium">{formatCurrency(originalEstimate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Insurance approved</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-500">{formatCurrency(currentCase.insuranceApproved)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-sm text-muted-foreground">Final bill</span>
                <span className="font-medium">{formatCurrency(finalBill)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold">Patient responsibility</span>
                <span className="text-xl font-bold">{formatCurrency(patientResponsibility)}</span>
              </div>
            </div>
            
            <div className="mt-6 w-full h-8 flex rounded-md overflow-hidden bg-muted">
              <div 
                className="bg-emerald-500/80 h-full flex items-center justify-center px-2 border-r border-background/20" 
                style={{ width: `${(currentCase.insuranceApproved / finalBill) * 100}%` }}
                title="Insurance"
              />
              <div 
                className="bg-primary/80 h-full flex items-center justify-center px-2" 
                style={{ width: `${(patientResponsibility / finalBill) * 100}%` }}
                title="Patient Responsibility"
              />
            </div>
            <div className="flex justify-between mt-3 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80" /> Insurance</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-primary/80" /> Patient</span>
            </div>
            
            <p className="text-[11px] text-muted-foreground mt-6 text-center">
              DEMO CALCULATION. The final patient responsibility depends on the insurer&apos;s approval, exclusions, deductibles, and the final billed amount.
            </p>
          </Card>

        </div>
      </div>

      {/* How Did We Get Here Drawer/Modal */}
      <AnimatePresence>
        {showHowWeGotHere && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowHowWeGotHere(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative bg-background border border-border shadow-2xl rounded-2xl w-full max-w-lg p-6 md:p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold tracking-tight mb-2">How did I get here?</h3>
              <p className="text-muted-foreground mb-8">Follow the progression from your original estimate to the final bill.</p>
              
              <div className="space-y-0 relative pl-4">
                
                {/* Connecting Line */}
                <div className="absolute left-[34px] top-8 bottom-16 w-px bg-border -z-10" />

                {/* Estimate */}
                <div className="flex items-start gap-5 pb-8 relative">
                  <div className="w-10 h-10 rounded-full bg-surface border-2 border-border flex items-center justify-center shrink-0 mt-1">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-xl font-bold">{formatCurrency(originalEstimate)}</p>
                    <p className="text-sm text-muted-foreground">Original estimate</p>
                  </div>
                </div>

                {/* Increments */}
                {charges.filter(c => c.financialImpact && c.financialImpact > 0).sort((a,b) => (b.financialImpact || 0) - (a.financialImpact || 0)).map(charge => (
                  <div key={charge.id} className="flex items-start gap-5 pb-8 relative group">
                    <div className="w-10 h-10 rounded-full bg-surface border-2 border-border flex items-center justify-center shrink-0 mt-1 group-hover:border-amber-500/50 transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    </div>
                    <div className="pt-0.5 w-full flex justify-between items-start">
                      <div>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-500">
                          +{formatCurrency(charge.financialImpact!)}
                        </p>
                        <p className="text-sm font-medium">{charge.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Final Bill */}
                <div className="flex items-start gap-5 relative pt-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground border-2 border-primary flex items-center justify-center shrink-0 shadow-md">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div className="pt-0.5 w-full">
                    <p className="text-2xl font-bold">{formatCurrency(finalBill)}</p>
                    <p className="text-sm text-muted-foreground font-medium">Final bill</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-6 bg-surface p-4 rounded-lg border border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Change</p>
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-500">+{formatCurrency(drift)} (+{driftPercent}%)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-500">{itemsNeedingClarification} items require review</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setShowHowWeGotHere(false)}>Close</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
