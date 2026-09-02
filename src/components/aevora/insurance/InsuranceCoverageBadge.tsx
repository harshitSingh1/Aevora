import * as React from "react"
import { CheckCircle2, AlertCircle, HelpCircle, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export type CoverageStatus = "approved" | "partial" | "not-approved" | "pending" | "unknown"

interface InsuranceCoverageBadgeProps {
  status: CoverageStatus
  className?: string
}

export function InsuranceCoverageBadge({ status, className }: InsuranceCoverageBadgeProps) {
  const config = {
    approved: {
      icon: CheckCircle2,
      label: "Approved",
      className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-500/20",
    },
    partial: {
      icon: AlertCircle,
      label: "Partial / verify",
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-500 border-amber-500/20",
    },
    pending: {
      icon: Clock,
      label: "Pending",
      className: "bg-blue-500/10 text-blue-700 dark:text-blue-500 border-blue-500/20",
    },
    "not-approved": {
      icon: XCircle,
      label: "Not approved",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    unknown: {
      icon: HelpCircle,
      label: "Verify",
      className: "bg-muted text-muted-foreground border-border",
    },
  }

  const { icon: Icon, label, className: variantClassName } = config[status] || config.unknown

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
