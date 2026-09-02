"use client"

import * as React from "react"
import { UploadCloud, File as FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DocumentUploaderProps {
  onUpload?: (files: File[]) => void
  className?: string
}

export function DocumentUploader({ onUpload, className }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      onUpload?.(files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      onUpload?.(files)
    }
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-colors",
        isDragging
          ? "border-accent bg-accent/5"
          : "border-border bg-surface hover:bg-muted/50",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <UploadCloud className="h-6 w-6" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-foreground">
        Drop your healthcare documents here
      </h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Support for PDF, JPG, or PNG. Maximum file size 10MB.
      </p>
      
      <label className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <span>Browse files</span>
        <input
          type="file"
          className="sr-only"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInput}
        />
      </label>
    </div>
  )
}
