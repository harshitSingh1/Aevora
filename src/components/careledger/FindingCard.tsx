import Link from "next/link"
import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EvidenceBadge, type EvidenceStatus } from "./EvidenceBadge"

interface FindingCardProps {
  status: EvidenceStatus
  title: string
  amount?: string
  explanation: string
  onAction?: () => void
  actionLabel?: string
  className?: string
  href?: string
}

export function FindingCard({
  status,
  title,
  amount,
  explanation,
  onAction,
  actionLabel = "View evidence",
  className,
  href,
}: FindingCardProps) {
  const innerContent = (
    <>
      <div className="flex items-start justify-between gap-4">
        <EvidenceBadge status={status} />
        {amount && (
          <span className="font-semibold text-foreground">{amount}</span>
        )}
      </div>
      
      <div className="mt-1">
        <h4 className={cn("text-base font-semibold text-foreground", href && "group-hover:text-primary transition-colors")}>{title}</h4>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {explanation}
        </p>
      </div>
      
      {(onAction || href) && (
        <div className="mt-2 flex">
          {href ? (
             <div className="flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors">
               {actionLabel} <ArrowRight className="ml-1.5 h-4 w-4" />
             </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={onAction} className="h-8 px-2 -ml-2 text-accent hover:text-accent/80 hover:bg-accent/10">
              {actionLabel} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cn("flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 shadow-sm hover:border-primary/50 transition-colors block cursor-pointer group", className)}>
        {innerContent}
      </Link>
    )
  }

  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 shadow-sm", className)}>
      {innerContent}
    </div>
  )
}
