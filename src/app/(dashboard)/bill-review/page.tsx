"use client"
import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useCase } from "@/lib/context/CaseContext"
import { mockCharges, mockFindings } from "@/lib/mock-data"
import { formatCurrency, calculateEvidenceCoverage, cn } from "@/lib/utils"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, AlertCircle, Search, Filter, Mic, ChevronRight, Bookmark } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { EvidenceLevelBadge } from "@/components/aevora/EvidenceLevelBadge"
import { SyntheticBillViewer } from "@/components/aevora/bill-review/SyntheticBillViewer"
import { Input } from "@/components/ui/input"

export default function BillReviewPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading review...</div>}>
      <BillReviewContent />
    </React.Suspense>
  )
}

function BillReviewContent() {
  const { currentCase } = useCase()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const initialFindingId = searchParams?.get("finding")

  const charges = React.useMemo(() => {
    return currentCase ? (mockCharges[currentCase.id] || []) : []
  }, [currentCase])

  const findings = React.useMemo(() => {
    return currentCase ? (mockFindings[currentCase.id] || []) : []
  }, [currentCase])

  const [selectedFindingId, setSelectedFindingId] = React.useState<string | undefined>(initialFindingId || undefined)
  const [viewMode, setViewMode] = React.useState<"document" | "analysis">("analysis") // For mobile

  // Sync selected finding with the URL and update related charge selection
  React.useEffect(() => {
    if (selectedFindingId) {
      const finding = findings.find(f => f.id === selectedFindingId)
      // We will derive the selectedChargeId during render instead of setting state
    }
  }, [selectedFindingId, findings])

  // Derive selected charge ID
  const selectedFinding = React.useMemo(() => findings.find(f => f.id === selectedFindingId), [findings, selectedFindingId])
  const [overrideChargeId, setOverrideChargeId] = React.useState<string | undefined>()
  const selectedChargeId = overrideChargeId || selectedFinding?.relatedChargeId

  // Sync clicking a charge in the document back to the finding
  const handleChargeClick = (chargeId: string) => {
    setOverrideChargeId(chargeId)
    const finding = findings.find(f => f.relatedChargeId === chargeId)
    if (finding) {
      setSelectedFindingId(finding.id)
      setViewMode("analysis") // switch to analysis view on mobile
      
      // Update URL without reload
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set("finding", finding.id)
      window.history.pushState({}, "", newUrl.toString())
      
      // Scroll to finding if in view
      document.getElementById(`finding-card-${finding.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    } else {
      setSelectedFindingId(undefined)
      // Clear URL param
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete("finding")
      window.history.pushState({}, "", newUrl.toString())
    }
  }

  if (!currentCase || charges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Nothing to review yet.</h1>
        <p className="text-muted-foreground mb-8">Upload a hospital bill to start reviewing individual charges.</p>
        <Button>Upload Bill &rarr;</Button>
      </div>
    )
  }

  const finalBill = currentCase.finalBill || currentCase.currentBill
  const originalEstimate = currentCase.originalEstimate
  const itemsNeedingClarification = findings.filter(f => f.status === "needs-clarification" || f.status === "anomaly" || f.status === "discrepancy").length
  const evidenceCoverage = calculateEvidenceCoverage(charges)

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 md:px-8 py-4 bg-background z-20 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Aevora</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/financial-analysis" className="hover:text-foreground transition-colors">Financial Intelligence</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-foreground">Bill Review</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Review your bill</h1>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex md:hidden bg-surface p-1 rounded-lg border border-border">
          <Button 
            variant={viewMode === "document" ? "secondary" : "ghost"} 
            size="sm" 
            className="flex-1"
            onClick={() => setViewMode("document")}
          >
            Document
          </Button>
          <Button 
            variant={viewMode === "analysis" ? "secondary" : "ghost"} 
            size="sm" 
            className="flex-1"
            onClick={() => setViewMode("analysis")}
          >
            Analysis
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT PANEL: Document Preview (45%) */}
        <div className={cn(
          "w-full lg:w-[45%] h-full p-4 md:p-6 lg:p-8 bg-muted/20 border-r border-border overflow-hidden",
          viewMode === "document" ? "block" : "hidden lg:block"
        )}>
          <SyntheticBillViewer 
            charges={charges} 
            patientName={currentCase.patientName} 
            selectedChargeId={selectedChargeId}
            onChargeClick={handleChargeClick}
          />
        </div>

        {/* RIGHT PANEL: Analysis (55%) */}
        <div className={cn(
          "w-full lg:w-[55%] h-full overflow-y-auto relative",
          viewMode === "analysis" ? "block" : "hidden lg:block"
        )}>
          
          <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto space-y-8 pb-32">
            
            {/* Bill Analysis Summary */}
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-4">Bill analysis</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card className="p-4 bg-surface shadow-sm">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total billed</p>
                  <p className="text-lg font-bold">{formatCurrency(finalBill)}</p>
                </Card>
                <Card className="p-4 bg-surface shadow-sm">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Original est.</p>
                  <p className="text-lg font-bold">{formatCurrency(originalEstimate)}</p>
                </Card>
                <Card className="p-4 bg-surface shadow-sm sm:col-span-1 col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Difference</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-500">+{formatCurrency(finalBill - originalEstimate)}</p>
                </Card>
                
                <Card className="p-4 bg-surface shadow-sm">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Items reviewed</p>
                  <p className="text-lg font-bold">{charges.length}</p>
                </Card>
                <Card className="p-4 bg-amber-500/10 border-amber-500/20 shadow-sm">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-500 uppercase tracking-wider mb-1">Needs clarify</p>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-500">{itemsNeedingClarification}</p>
                </Card>
                <Card className="p-4 bg-surface shadow-sm sm:col-span-1 col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Evidence</p>
                  <p className="text-lg font-bold">{evidenceCoverage.covered} / {evidenceCoverage.total} <span className="text-sm font-medium text-muted-foreground">charges</span></p>
                </Card>
              </div>
            </div>

            {/* Selected Finding Detail (If selected) */}
            <AnimatePresence mode="popLayout">
              {selectedFinding && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-background border-2 border-primary rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-5 md:p-6 border-b border-border">
                    <div className="flex justify-between items-start mb-3">
                      <p className={cn("text-xs font-semibold uppercase tracking-wider", selectedFinding.status === "needs-clarification" || selectedFinding.status === "anomaly" ? "text-amber-600 dark:text-amber-500" : (selectedFinding.status === "discrepancy" ? "text-destructive" : "text-primary"))}>
                        {selectedFinding.status.replace("-", " ")}
                      </p>
                      <Button variant="ghost" size="sm" className="h-8 -mt-2 -mr-2" onClick={() => {
                        setSelectedFindingId(undefined)
                        setOverrideChargeId(undefined)
                        const newUrl = new URL(window.location.href)
                        newUrl.searchParams.delete("finding")
                        window.history.pushState({}, "", newUrl.toString())
                      }}>Close</Button>
                    </div>
                    
                    <div className="flex justify-between items-end gap-4 mb-2">
                      <h3 className="text-xl font-bold tracking-tight">{selectedFinding.title}</h3>
                      {selectedFinding.amount && (
                        <p className="text-xl font-bold">{formatCurrency(selectedFinding.amount)}</p>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{selectedFinding.explanation}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Evidence Level</p>
                        <EvidenceLevelBadge level={selectedFinding.evidenceLevel} />
                      </div>
                      {selectedFinding.relatedEventId && (
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Related Event</p>
                          <Link href={`/timeline?event=${selectedFinding.relatedEventId}`}>
                            <Button variant="link" className="p-0 h-auto text-primary text-sm font-medium">View in timeline &rarr;</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-surface p-5 md:p-6 border-b border-border space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Document Fact</p>
                      <div className="bg-background border border-border p-3 rounded-md">
                        <p className="text-sm font-medium">{selectedFinding.documentFact}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                        Aevora Insight
                        <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold tracking-normal uppercase">AI</span>
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedFinding.aevoraInsight}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedFinding.evidence.map((doc, i) => (
                          <div key={i} className="inline-flex items-center gap-1.5 bg-background border border-border rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm">
                            {doc.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 md:p-6 bg-amber-500/5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-500 mb-2">What should I ask?</p>
                    <p className="text-sm font-medium italic text-foreground mb-4">
                      &quot;{selectedFinding.recommendedQuestion}&quot;
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href={`/talk?finding=${selectedFinding.id}`} className="flex-1">
                        <Button className="w-full gap-2"><Mic className="w-4 h-4" /> Ask Aevora</Button>
                      </Link>
                      <Link href={`/advocacy?finding=${selectedFinding.id}`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2 border-amber-500/20 text-amber-700 dark:text-amber-500 hover:bg-amber-500/10">
                          Prepare Advocacy <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-2 text-center border-t border-border">
                    <p className="text-[10px] text-muted-foreground">
                      Aevora identifies areas for review based on available documents. A flagged item is not proof of an incorrect or fraudulent charge.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Findings List */}
            <div className={cn("space-y-4 transition-all duration-300", selectedFinding ? "opacity-40 pointer-events-none grayscale-[50%]" : "")}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Findings</h2>
                  <p className="text-sm text-muted-foreground">Areas that may deserve a closer look.</p>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2"><Filter className="w-4 h-4" /> Filter</Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search findings..." className="pl-9 bg-surface" />
              </div>

              <div className="space-y-3 pt-2">
                {findings.map(finding => (
                  <Card 
                    key={finding.id} 
                    id={`finding-card-${finding.id}`}
                    className={cn(
                      "p-4 cursor-pointer transition-all duration-200 border",
                      selectedFindingId === finding.id ? "border-primary ring-1 ring-primary shadow-md" : "hover:border-primary/50 bg-surface shadow-sm"
                    )}
                    onClick={() => {
                      setSelectedFindingId(finding.id)
                      const newUrl = new URL(window.location.href)
                      newUrl.searchParams.set("finding", finding.id)
                      window.history.pushState({}, "", newUrl.toString())
                    }}
                  >
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
                    <h3 className="font-semibold text-foreground mb-1">{finding.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                      {finding.explanation}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <EvidenceLevelBadge level={finding.evidenceLevel} />
                      <div className="text-xs font-medium text-primary flex items-center gap-1">
                        View details <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Charge Table */}
            <div className="pt-8 border-t border-border mt-8">
              <h2 className="text-xl font-bold tracking-tight mb-6">Detailed charges</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-surface text-muted-foreground text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-md">Charge</th>
                      <th className="px-4 py-3">Original Est.</th>
                      <th className="px-4 py-3">Final Bill</th>
                      <th className="px-4 py-3">Change</th>
                      <th className="px-4 py-3 rounded-tr-md">Evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {charges.map(charge => (
                      <tr key={charge.id} className="hover:bg-accent/5 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{charge.description}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatCurrency(charge.estimatedAmount || 0)}</td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(charge.billedAmount)}</td>
                        <td className="px-4 py-3">
                          {charge.financialImpact && charge.financialImpact > 0 ? (
                            <span className="text-amber-600 dark:text-amber-500 font-medium">+{formatCurrency(charge.financialImpact)}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <EvidenceLevelBadge level={charge.evidenceLevel} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
