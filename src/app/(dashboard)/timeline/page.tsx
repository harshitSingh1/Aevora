"use client"
import * as React from "react"
import { useCase } from "@/lib/context/CaseContext"
import { mockTimelineEvents } from "@/lib/mock-data"
import { CareTimelineEvent } from "@/types"
import { formatCurrency, cn } from "@/lib/utils"
import { TimelineEventCard } from "@/components/aevora/timeline/TimelineEventCard"
import { CareCommitmentGraph } from "@/components/aevora/timeline/CareCommitmentGraph"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Filter, FileText, AlertCircle, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/layout/PageHeader"

export default function TimelinePage() {
  const { currentCase } = useCase()
  const events = React.useMemo(() => {
    return currentCase ? (mockTimelineEvents[currentCase.id] || []) : []
  }, [currentCase])

  const [selectedEventIdState, setSelectedEventIdState] = React.useState<string | undefined>()

  const isValidSelection = React.useMemo(() => {
    return events.some(e => e.id === selectedEventIdState)
  }, [events, selectedEventIdState])

  // Use the last event as default if no event is explicitly selected (or if the selected event doesn't exist in current case)
  const selectedEventId = (isValidSelection ? selectedEventIdState : undefined) ?? (events.length > 0 ? events[events.length - 1].id : undefined)

  const [searchQuery, setSearchQuery] = React.useState("")
  const [showHowWeGotHere, setShowHowWeGotHere] = React.useState(false)

  const filteredEvents = React.useMemo(() => {
    if (!searchQuery) return events
    const q = searchQuery.toLowerCase()
    return events.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.description?.toLowerCase().includes(q) || 
      e.type.toLowerCase().includes(q)
    )
  }, [events, searchQuery])

  if (!currentCase || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center text-muted-foreground mb-6">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your care timeline starts here.</h2>
        <p className="text-muted-foreground mb-8">
          Upload a healthcare estimate, bill, prescription, insurance document, or report to begin building your timeline.
        </p>
        <Button>Upload Document &rarr;</Button>
      </div>
    )
  }

  const itemsNeedingReview = events.filter(e => e.status === "warning" || e.status === "discrepancy").length

  return (
    <div className="flex-1 overflow-y-auto w-full relative pb-12">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Care Timeline</h1>
          <p className="text-sm text-muted-foreground">See how your treatment, decisions, and healthcare costs evolved.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold">{currentCase.patientName}</p>
            <p className="text-xs text-muted-foreground uppercase">{currentCase.title} • DEMO CASE</p>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex">View Documents &rarr;</Button>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-12">
        
        {/* Top Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-surface/50 border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Journey</p>
            <p className="text-lg font-bold">{events.length} events</p>
          </Card>
          <Card className="p-4 bg-surface/50 border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Date Range</p>
            <p className="text-lg font-bold">{events[0].date} - {events[events.length - 1].date}</p>
          </Card>
          <Card className="p-4 bg-amber-500/5 border-amber-500/20">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-500 uppercase mb-1">Financial Drift</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-bold text-amber-700 dark:text-amber-500">
                +{formatCurrency(currentCase.financialDrift || 0)}
              </p>
              <p className="text-sm font-bold text-amber-700/70 dark:text-amber-500/70">
                +{currentCase.financialDriftPercent}%
              </p>
            </div>
          </Card>
          <Card className="p-4 bg-surface/50 border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Needs Review</p>
            <p className="text-lg font-bold">{itemsNeedingReview}</p>
          </Card>
        </div>

        {/* Care Commitment Graph */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Care Commitment Graph</h2>
              <p className="text-sm text-muted-foreground">Track how your expected healthcare cost changed.</p>
            </div>
          </div>
          <Card className="bg-surface shadow-sm border-border overflow-hidden">
            <CareCommitmentGraph 
              events={events} 
              selectedEventId={selectedEventId}
              onSelectEvent={(id) => {
                setSelectedEventIdState(id)
                document.getElementById(`timeline-event-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }}
            />
          </Card>
        </div>

        {/* Timeline Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 w-full space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold tracking-tight">Chronological History</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search timeline..." 
                    className="pl-9 w-48 h-9 text-sm bg-surface"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="h-9 px-3"><Filter className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="relative border-l-2 border-border/60 ml-4 md:ml-6 space-y-8 pb-12">
              {filteredEvents.map((event, index) => (
                <div key={event.id} id={`timeline-event-${event.id}`} className="relative pl-6 md:pl-10">
                  {/* Timeline dot */}
                  <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-surface border-2 border-primary z-10" />
                  
                  <TimelineEventCard 
                    event={event} 
                    isSelected={selectedEventId === event.id}
                    onSelect={() => setSelectedEventIdState(event.id)}
                    onAskClick={() => {
                      // Navigate to talk placeholder logic
                      alert("Connecting to Aevora Voice AI for event: " + event.id)
                    }}
                  />
                  
                  {/* How did we get here button near the final bill */}
                  {index === events.length - 1 && event.type === "final_bill" && (
                    <div className="mt-8 flex justify-center w-full">
                      <Button variant="secondary" onClick={() => setShowHowWeGotHere(true)}>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        How did we get here?
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop Right Side Panel */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24">
              <Card className="p-5 bg-surface border-border shadow-sm">
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Timeline Actions</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-left">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Timeline PDF
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left text-amber-700 dark:text-amber-500 border-amber-500/30 hover:bg-amber-500/10">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Review {itemsNeedingReview} Findings
                  </Button>
                </div>
                
                {events.find(e => e.id === selectedEventId)?.evidence && (
                  <div className="mt-8">
                    <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Related Documents</h4>
                    <div className="space-y-2">
                      {events.find(e => e.id === selectedEventId)?.evidence?.map((doc, i) => (
                        <div key={i} className="flex items-center p-2 rounded-md hover:bg-accent/10 text-sm cursor-pointer border border-transparent hover:border-accent/20 transition-colors">
                          <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">{doc.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>

        </div>
      </div>

      {/* How Did We Get Here Modal */}
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
              className="relative bg-background border border-border shadow-2xl rounded-2xl w-full max-w-md p-6 z-10"
            >
              <h3 className="text-xl font-bold tracking-tight mb-6">How did we get here?</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-border">
                  <div>
                    <p className="text-lg font-bold">{formatCurrency(currentCase.originalEstimate)}</p>
                    <p className="text-sm text-muted-foreground">Original estimate</p>
                  </div>
                </div>

                <div className="py-2 space-y-4">
                  {events.filter(e => e.financialImpact && e.financialImpact > 0).map(e => (
                    <div key={e.id} className="flex justify-between items-start group">
                      <div>
                        <p className={cn("text-base font-semibold", e.status === "warning" ? "text-amber-600 dark:text-amber-500" : "text-foreground")}>
                          +{formatCurrency(e.financialImpact!)}
                        </p>
                        <p className="text-sm text-muted-foreground">{e.title}</p>
                      </div>
                      {e.status === "warning" && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-medium text-amber-700 bg-amber-500/10 px-2 py-1 rounded">Needs Review</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-border">
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(currentCase.finalBill || currentCase.currentBill)}</p>
                    <p className="text-sm text-muted-foreground">Final bill</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-500">+{currentCase.financialDriftPercent}% drift</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button onClick={() => setShowHowWeGotHere(false)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
