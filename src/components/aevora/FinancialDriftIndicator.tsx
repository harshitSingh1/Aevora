import * as React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export type DriftStatus = "positive" | "negative" | "neutral" | "warning" | "critical"

interface FinancialDriftIndicatorProps {
  originalEstimate: number
  finalBill: number
  status?: DriftStatus
  className?: string
}

export function FinancialDriftIndicator({
  originalEstimate,
  finalBill,
  status,
  className,
}: FinancialDriftIndicatorProps) {
  const diff = finalBill - originalEstimate
  const percentage = originalEstimate > 0 ? (diff / originalEstimate) * 100 : 0
  const isIncrease = diff > 0
  const isDecrease = diff < 0

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.abs(val))

  let derivedStatus: DriftStatus = status || "neutral"
  if (!status) {
    if (percentage > 20) derivedStatus = "critical"
    else if (percentage > 5) derivedStatus = "warning"
    else if (percentage < -5) derivedStatus = "positive"
  }

  const statusConfig = {
    positive: "text-success bg-success/10",
    negative: "text-info bg-info/10",
    neutral: "text-muted-foreground bg-muted",
    warning: "text-warning bg-warning/10",
    critical: "text-danger bg-danger/10",
  }

  return (
    <div className={cn("flex flex-col gap-2 rounded-xl border border-border bg-surface p-4", className)}>
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Original Estimate</p>
          <p className="text-lg font-semibold text-muted-foreground line-through decoration-muted-foreground/50">
            {formatCurrency(originalEstimate)}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Final Bill</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(finalBill)}
          </p>
        </div>
      </div>
      
      <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-medium text-muted-foreground">Variance</span>
        <div className={cn("flex items-center gap-2 px-2.5 py-1 rounded-md text-sm font-semibold", statusConfig[derivedStatus])}>
          {isIncrease ? <TrendingUp className="h-4 w-4" /> : isDecrease ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          <span>
            {isIncrease ? "+" : isDecrease ? "-" : ""}
            {formatCurrency(diff)} ({isIncrease ? "+" : ""}{percentage.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  )
}
