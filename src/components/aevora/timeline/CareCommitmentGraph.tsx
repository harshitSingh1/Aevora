import * as React from "react"
import { CareTimelineEvent } from "@/types"
import { formatCurrency, cn } from "@/lib/utils"
import { motion } from "motion/react"

interface CareCommitmentGraphProps {
  events: CareTimelineEvent[]
  selectedEventId?: string
  onSelectEvent: (id: string) => void
}

export function CareCommitmentGraph({ events, selectedEventId, onSelectEvent }: CareCommitmentGraphProps) {
  // We only want to plot events that are key milestones in the financial journey.
  // For the graph, we'll plot all events that have a cumulativeCost or financialImpact defined,
  // or specifically map out Recommendation -> Estimate -> Insurance -> Treatment -> Final Bill.
  // Let's filter to major events for the top graph to keep it clean, as requested.
  
  const graphTypes = ["recommendation", "estimate", "insurance", "treatment", "procedure", "final_bill"]
  const majorEvents = events.filter(e => graphTypes.includes(e.type) || e.type === "interim_bill")

  return (
    <div className="w-full py-6 overflow-x-auto relative no-scrollbar">
      <div className="min-w-max px-4 md:px-8 py-8">
        <div className="flex items-start justify-between relative">
          
          {/* Connecting lines */}
          <div className="absolute left-8 right-8 top-5 h-0.5 bg-border -z-10" />
          
          {majorEvents.map((event, index) => {
            const isSelected = selectedEventId === event.id
            const isLast = index === majorEvents.length - 1
            const hasIncrease = (event.financialImpact || 0) > 0
            
            return (
              <div 
                key={event.id} 
                className="flex flex-col items-center relative group cursor-pointer"
                style={{ width: 140 }}
                onClick={() => onSelectEvent(event.id)}
              >
                {/* Node */}
                <motion.div
                  animate={{ 
                    scale: isSelected ? 1.2 : 1,
                    borderColor: isSelected ? "hsl(var(--primary))" : "hsl(var(--border))" 
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 bg-surface flex items-center justify-center transition-colors shadow-sm",
                    isSelected ? "border-primary text-primary" : "border-border text-muted-foreground",
                    event.status === "warning" && !isSelected ? "border-amber-500/50" : ""
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    isSelected ? "bg-primary" : "bg-muted-foreground/30",
                    event.status === "warning" && !isSelected ? "bg-amber-500" : ""
                  )} />
                </motion.div>

                {/* Vertical drop line to amount if it's a major financial node */}
                {event.cumulativeCost !== undefined && (
                  <div className="absolute top-10 w-px h-8 bg-border" />
                )}

                {/* Label */}
                <div className="mt-4 text-center">
                  <p className={cn(
                    "text-sm font-medium transition-colors",
                    isSelected ? "text-foreground font-semibold" : "text-muted-foreground"
                  )}>
                    {event.title.length > 15 ? event.type.replace("_", " ") : event.title}
                  </p>
                </div>
                
                {/* Amount / Graph Value */}
                {event.cumulativeCost !== undefined && (
                  <div className="mt-6 flex flex-col items-center relative">
                    {/* The L-shape connector for drift if applicable */}
                    {hasIncrease && index > 0 && (
                      <div className="absolute -top-4 -left-14 text-xs font-semibold text-amber-600 dark:text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        +{formatCurrency(event.financialImpact!)}
                      </div>
                    )}
                    <span className={cn(
                      "text-base font-bold",
                      hasIncrease ? "text-amber-600 dark:text-amber-500" : "text-foreground"
                    )}>
                      {formatCurrency(event.cumulativeCost)}
                    </span>
                  </div>
                )}
                
                {/* Tooltip on hover */}
                <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-3 py-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-50">
                  <p className="font-semibold">{event.date}</p>
                  <p>{event.title}</p>
                  {event.financialImpact !== undefined && (
                    <p className={event.financialImpact > 0 ? "text-amber-400" : ""}>
                      {event.financialImpact > 0 ? "+" : ""}{formatCurrency(event.financialImpact)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
