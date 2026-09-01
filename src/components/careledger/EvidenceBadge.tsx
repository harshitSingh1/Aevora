import * as React from "react"
import { CheckCircle, HelpCircle, AlertTriangle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type EvidenceStatus = "verified" | "needs-clarification" | "anomaly" | "discrepancy"

interface EvidenceBadgeProps {
  status: EvidenceStatus
  className?: string
}

export function EvidenceBadge({ status, className }: EvidenceBadgeProps) {
  const config = {
    verified: {
      icon: CheckCircle,
      label: "Verified",
      className: "bg-success/10 text-success border-success/20",
    },
    "needs-clarification": {
      icon: HelpCircle,
      label: "Needs Clarification",
      className: "bg-warning/10 text-warning border-warning/20",
    },
    anomaly: {
      icon: AlertTriangle,
      label: "Benchmark Anomaly",
      className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    },
    discrepancy: {
      icon: XCircle,
      label: "Strong Discrepancy",
      className: "bg-danger/10 text-danger border-danger/20",
    },
  }

  const { icon: Icon, label, className: variantClassName } = config[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        variantClassName,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}
