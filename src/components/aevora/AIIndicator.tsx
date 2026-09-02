"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIIndicatorProps {
  className?: string
  text?: string
}

export function AIIndicator({ className, text = "Aevora AI" }: AIIndicatorProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20"
      >
        <Sparkles className="h-3 w-3 text-accent" />
      </motion.div>
      <span className="text-xs font-medium text-muted-foreground">{text}</span>
    </div>
  )
}
