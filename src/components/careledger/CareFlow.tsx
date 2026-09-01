"use client"
import * as React from "react"
import { motion } from "motion/react"
import { Activity, FileText, Shield, Receipt } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"

export type CareFlowStepId = "recommendation" | "estimate" | "insurance" | "treatment" | "bill" | string

export interface CareFlowStep {
  id: CareFlowStepId
  label: string
  shortLabel?: string
  status: "pending" | "current" | "completed" | "warning" | "discrepancy"
  amount?: number
  date?: string
  eventId?: string
  icon?: React.ReactNode
}

interface CareFlowProps {
  steps?: CareFlowStep[]
  activeStep?: CareFlowStepId
  className?: string
  orientation?: "horizontal" | "vertical"
  onNodeClick?: (id: string, eventId?: string) => void
}

const defaultSteps: CareFlowStep[] = [
  { id: "recommendation", label: "Recommendation", status: "completed" },
  { id: "estimate", label: "Estimate", status: "completed" },
  { id: "insurance", label: "Insurance", status: "current" },
  { id: "treatment", label: "Treatment", status: "pending" },
  { id: "bill", label: "Final Bill", status: "pending" },
]

const icons: Record<string, React.ElementType> = {
  recommendation: Activity,
  estimate: FileText,
  insurance: Shield,
  treatment: Activity,
  bill: Receipt,
}

export function CareFlow({ steps = defaultSteps, orientation = "horizontal", onNodeClick, className }: CareFlowProps) {
  const isHorizontal = orientation === "horizontal"

  return (
    <div className={cn("w-full py-6", isHorizontal ? "overflow-x-auto no-scrollbar" : "", className)}>
      <div className={cn("flex min-w-max", isHorizontal ? "items-center justify-between gap-4 px-4 md:px-0" : "flex-col items-start gap-4 px-4")}>
        {steps.map((step, index) => {
          const IconComp = step.icon ? null : (icons[step.id] || Activity)
          const isCompleted = step.status === "completed"
          const isCurrent = step.status === "current"
          const isWarning = step.status === "warning" || step.status === "discrepancy"
          const isLast = index === steps.length - 1

          return (
            <React.Fragment key={step.id}>
              <div 
                className={cn("relative z-10", isHorizontal ? "flex flex-col items-center gap-3" : "flex flex-row items-center gap-4 cursor-pointer w-full")}
                onClick={() => onNodeClick?.(step.id, step.eventId)}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 bg-surface transition-colors duration-500 shrink-0",
                    isCompleted && "border-accent text-accent",
                    isCurrent && "border-primary bg-primary text-primary-foreground shadow-md",
                    isWarning && "border-warning text-warning",
                    step.status === "pending" && "border-border text-muted-foreground"
                  )}
                >
                  {step.icon ? step.icon : (IconComp && <IconComp className="h-5 w-5" />)}
                  
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
                
                <div className={cn("flex flex-col", isHorizontal ? "items-center" : "items-start")}>
                  <span
                    className={cn(
                      "font-medium",
                      isHorizontal ? "text-xs text-center" : "text-base",
                      (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground",
                      isWarning && "text-warning"
                    )}
                  >
                    {isHorizontal && step.shortLabel ? step.shortLabel : step.label}
                  </span>
                  
                  {/* Additional info for vertical view mostly */}
                  {(step.amount !== undefined || step.date) && !isHorizontal && (
                    <div className="flex items-center gap-2 mt-0.5">
                      {step.date && <span className="text-xs text-muted-foreground font-medium">{step.date}</span>}
                      {step.date && step.amount !== undefined && <span className="text-muted-foreground/30">•</span>}
                      {step.amount !== undefined && (
                        <span className={cn("text-sm font-semibold", isWarning ? "text-warning" : "text-foreground")}>
                          {formatCurrency(step.amount)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {!isLast && (
                <div className={cn(
                  "relative bg-border flex-shrink-0",
                  isHorizontal ? "flex-1 h-0.5 min-w-[60px] mb-6" : "w-0.5 h-10 ml-[23px] my-1"
                )}>
                  {isCompleted && (
                    <motion.div
                      className={cn("absolute inset-0 bg-accent", isHorizontal ? "origin-left" : "origin-top")}
                      initial={isHorizontal ? { scaleX: 0 } : { scaleY: 0 }}
                      animate={isHorizontal ? { scaleX: 1 } : { scaleY: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
