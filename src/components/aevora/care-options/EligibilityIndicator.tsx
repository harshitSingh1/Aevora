import * as React from "react"
import { CheckCircle2, AlertCircle, HelpCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type EligibilityStatus = "likely" | "uncertain" | "unlikely" | "verify"

interface EligibilityIndicatorProps {
  status: EligibilityStatus
  className?: string
}

export function EligibilityIndicator({ status, className }: EligibilityIndicatorProps) {
  const config = {
    likely: {
      icon: CheckCircle2,
      label: "Likely eligible",
      className: "text-emerald-700 dark:text-emerald-500",
      iconClass: "text-emerald-500",
    },
    uncertain: {
      icon: AlertCircle,
      label: "Eligibility uncertain",
      className: "text-amber-700 dark:text-amber-500",
      iconClass: "text-amber-500",
    },
    unlikely: {
      icon: XCircle,
      label: "Likely not eligible",
      className: "text-destructive",
      iconClass: "text-destructive",
    },
    verify: {
      icon: HelpCircle,
      label: "Verification required",
      className: "text-muted-foreground",
      iconClass: "text-muted-foreground",
    },
  }

  const { icon: Icon, label, className: textClass, iconClass } = config[status]

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Icon className={cn("h-4 w-4", iconClass)} />
      <span className={cn("text-sm font-medium", textClass)}>{label}</span>
    </div>
  )
}
