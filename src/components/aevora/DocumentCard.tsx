import * as React from "react"
import { FileText, CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type DocumentStatus = "uploading" | "processing" | "analyzed" | "error"

interface DocumentCardProps {
  name: string
  type?: string
  status: DocumentStatus
  date?: string
  onAction?: () => void
  className?: string
}

export function DocumentCard({
  name,
  type = "Document",
  status,
  date,
  onAction,
  className,
}: DocumentCardProps) {
  const isAnalyzed = status === "analyzed"
  const isError = status === "error"
  const isProcessing = status === "processing" || status === "uploading"

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-all hover:shadow-sm",
        isError && "border-danger/50 bg-danger/5",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            isAnalyzed ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground",
            isError && "bg-danger/10 text-danger"
          )}
        >
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-foreground line-clamp-1">{name}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{type}</span>
            {date && (
              <>
                <span>•</span>
                <span>{date}</span>
              </>
            )}
          </div>
          
          <div className="mt-1.5 flex items-center gap-1.5">
            {isAnalyzed && (
              <span className="flex items-center gap-1 text-xs font-medium text-success">
                <CheckCircle className="h-3.5 w-3.5" />
                Analyzed
              </span>
            )}
            {isProcessing && (
              <span className="flex items-center gap-1 text-xs font-medium text-accent">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {status === "processing" ? "Analyzing..." : "Uploading..."}
              </span>
            )}
            {isError && (
              <span className="flex items-center gap-1 text-xs font-medium text-danger">
                <AlertCircle className="h-3.5 w-3.5" />
                Processing failed
              </span>
            )}
          </div>
        </div>
      </div>
      
      <Button variant="ghost" size="sm" onClick={onAction} className="shrink-0 gap-1" disabled={isProcessing}>
        View <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
