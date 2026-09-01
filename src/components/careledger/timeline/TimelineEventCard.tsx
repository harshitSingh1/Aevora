import * as React from "react"
import { CareTimelineEvent } from "@/types"
import { formatCurrency, cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Stethoscope, FileText, ShieldCheck, Activity, Pill, 
  TestTube, Receipt, ChevronDown, ChevronUp, AlertCircle, FileSearch, ArrowRight
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { EvidenceBadge } from "@/components/careledger/EvidenceBadge"

const ICONS = {
  recommendation: Stethoscope,
  estimate: FileText,
  insurance: ShieldCheck,
  admission: Activity,
  treatment: Activity,
  procedure: Pill,
  diagnostic: TestTube,
  interim_bill: Receipt,
  final_bill: Receipt,
  discharge: FileText,
}

interface TimelineEventCardProps {
  event: CareTimelineEvent;
  isSelected?: boolean;
  onSelect?: () => void;
  onAskClick?: () => void;
}

export function TimelineEventCard({ event, isSelected, onSelect, onAskClick }: TimelineEventCardProps) {
  const [expanded, setExpanded] = React.useState(false)
  const isExpanded = expanded || isSelected

  const Icon = ICONS[event.type] || Activity

  const statusColors = {
    completed: "bg-surface text-muted-foreground border-border",
    current: "bg-primary text-primary-foreground border-primary",
    upcoming: "bg-surface-muted text-muted-foreground border-border",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-500 border-amber-500/20",
    discrepancy: "bg-destructive/10 text-destructive border-destructive/20",
  }

  const isWarningOrDiscrepancy = event.status === "warning" || event.status === "discrepancy"

  return (
    <Card 
      className={cn(
        "relative transition-all duration-300 border", 
        isSelected ? "ring-2 ring-primary border-primary shadow-md" : "hover:border-primary/50 shadow-sm",
        isWarningOrDiscrepancy && !isSelected ? "border-amber-500/30" : ""
      )}
    >
      <div 
        className="p-4 md:p-5 cursor-pointer select-none flex flex-col"
        onClick={() => {
          if (onSelect) onSelect()
          setExpanded(!isExpanded)
        }}
      >
        {/* Header line */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 border", statusColors[event.status])}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground capitalize">{event.type.replace("_", " ")}</p>
              <h3 className="text-base md:text-lg font-semibold text-foreground leading-tight">{event.title}</h3>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-medium text-muted-foreground">{event.date}</p>
          </div>
        </div>

        {/* Short description and collapsed financial */}
        <div className="pl-13 flex justify-between items-end">
          <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
          {event.financialImpact !== undefined && !isExpanded && (
            <div className={cn("text-sm font-semibold whitespace-nowrap ml-4", event.financialImpact > 0 ? "text-amber-600 dark:text-amber-500" : "text-foreground")}>
              {event.financialImpact > 0 ? "+" : ""}{formatCurrency(event.financialImpact)}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 md:px-5 pl-4 md:pl-[68px]">
              <div className="border-t border-border pt-4 mt-2 space-y-5">
                
                {/* Financials & Context Row */}
                {(event.financialImpact !== undefined || event.cumulativeCost !== undefined || event.careContext) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.careContext && (
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Care Context</p>
                        <p className="text-sm text-foreground leading-relaxed">{event.careContext}</p>
                      </div>
                    )}
                    
                    {event.financialImpact !== undefined && (
                      <div className="bg-surface rounded-lg p-3 border border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Financial Impact</p>
                        <p className={cn("text-lg font-bold", event.financialImpact > 0 ? "text-amber-600 dark:text-amber-500" : "text-foreground")}>
                          {event.financialImpact > 0 ? "+" : ""}{formatCurrency(event.financialImpact)}
                        </p>
                      </div>
                    )}
                    
                    {event.cumulativeCost !== undefined && (
                      <div className="bg-surface rounded-lg p-3 border border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Cumulative Cost</p>
                        <p className="text-lg font-bold text-foreground">
                          {formatCurrency(event.cumulativeCost)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Status / Why this matters */}
                {isWarningOrDiscrepancy && (
                  <div className="bg-amber-500/5 rounded-lg p-4 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-500 mb-1">Why this matters</p>
                        <p className="text-sm text-foreground">
                          This charge was not present in the original estimate and increases the final financial responsibility. Review is recommended.
                        </p>
                        
                        {onAskClick && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Suggested question</p>
                            <p className="text-sm font-medium italic text-foreground bg-background p-2 rounded border border-border inline-block">
                              &quot;Could you explain why this was added after the original estimate?&quot;
                            </p>
                            <Button size="sm" variant="outline" className="mt-2 block" onClick={(e) => {
                              e.stopPropagation();
                              onAskClick();
                            }}>
                              Ask CareLedger <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Evidence & Findings */}
                {(event.evidence || event.relatedFindingIds) && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Evidence</p>
                    <div className="flex flex-wrap gap-2">
                      {event.evidence?.map((doc, i) => (
                        <div key={i} className="inline-flex items-center gap-1.5 bg-surface border border-border rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground">
                          <FileSearch className="w-3.5 h-3.5 text-muted-foreground" />
                          {doc.label}
                        </div>
                      ))}
                      {event.relatedFindingIds && event.relatedFindingIds.length > 0 && (
                        <EvidenceBadge status={event.status === "discrepancy" ? "discrepancy" : "needs-clarification"} className="ml-2" />
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
