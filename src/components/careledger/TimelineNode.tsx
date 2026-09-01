import * as React from "react"
import { LucideIcon, CheckCircle, Circle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type TimelineNodeStatus = "completed" | "current" | "upcoming" | "warning" | "discrepancy"

interface TimelineNodeProps {
  status: TimelineNodeStatus
  title: string
  date?: string
  description?: string
  amount?: string
  icon?: LucideIcon
  isLast?: boolean
  className?: string
}

export function TimelineNode({
  status,
  title,
  date,
  description,
  amount,
  icon: Icon,
  isLast = false,
  className,
}: TimelineNodeProps) {
  const isCompleted = status === "completed"
  const isCurrent = status === "current"
  const isWarning = status === "warning" || status === "discrepancy"

  return (
    <div className={cn("relative flex gap-4", className)}>
      {!isLast && (
        <div 
          className={cn(
            "absolute left-[19px] top-10 bottom-[-16px] w-[2px]",
            isCompleted ? "bg-accent" : "bg-border"
          )} 
        />
      )}
      
      <div className="relative z-10 flex flex-col items-center mt-1 shrink-0">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-surface shadow-sm",
            isCompleted && "border-accent text-accent",
            isCurrent && "border-primary bg-primary text-primary-foreground",
            isWarning && "border-warning text-warning",
            status === "upcoming" && "border-border text-muted-foreground bg-muted"
          )}
        >
          {Icon ? (
            <Icon className="h-5 w-5" />
          ) : isCompleted ? (
            <CheckCircle className="h-5 w-5" />
          ) : isWarning ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </div>
      </div>
      
      <div className={cn("flex flex-col pb-8 pt-1 w-full", isLast && "pb-0")}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
          <div>
            <h4 className={cn("text-base font-semibold", 
              isWarning && "text-warning",
              status === "upcoming" && "text-muted-foreground"
            )}>
              {title}
            </h4>
            {date && <span className="text-xs font-medium text-muted-foreground mt-0.5 block">{date}</span>}
          </div>
          {amount && (
            <div className="font-semibold text-foreground bg-surface-muted px-2 py-1 rounded-md text-sm border border-border">
              {amount}
            </div>
          )}
        </div>
        
        {description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
