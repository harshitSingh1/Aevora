import * as React from "react"
import { CheckCircle2, CheckCircle, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type EvidenceLevel = "high" | "medium" | "low" | "partial"

interface EvidenceLevelBadgeProps {
  level: EvidenceLevel
  className?: string
}

export function EvidenceLevelBadge({ level, className }: EvidenceLevelBadgeProps) {
  const config = {
    high: {
      icon: CheckCircle2,
      label: "Strong evidence",
      className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-500/20",
    },
    medium: {
      icon: CheckCircle,
      label: "Partial evidence",
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-500 border-amber-500/20",
    },
    partial: {
      icon: CheckCircle,
      label: "Partial evidence",
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-500 border-amber-500/20",
    },
    low: {
      icon: HelpCircle,
      label: "Limited evidence",
      className: "bg-muted text-muted-foreground border-border",
    },
  }

  const { icon: Icon, label, className: variantClassName } = config[level] || config.low

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        variantClassName,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}
