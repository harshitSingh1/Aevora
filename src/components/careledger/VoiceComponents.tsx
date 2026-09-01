"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Mic, Phone, PhoneOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type VoiceState = "idle" | "calling" | "connecting" | "connected" | "listening" | "thinking" | "speaking" | "ended"

interface VoiceButtonProps {
  state: VoiceState
  onClick?: () => void
  className?: string
}

export function VoiceButton({ state, onClick, className }: VoiceButtonProps) {
  const isIdleOrEnded = state === "idle" || state === "ended"
  
  return (
    <Button
      size="lg"
      className={cn(
        "rounded-full px-6 gap-2 shadow-md transition-all duration-300",
        isIdleOrEnded 
          ? "bg-accent text-primary hover:bg-accent/90" 
          : "bg-danger text-white hover:bg-danger/90",
        className
      )}
      onClick={onClick}
    >
      {isIdleOrEnded ? (
        <>
          <Phone className="h-5 w-5" />
          <span>Talk to CareLedger</span>
        </>
      ) : (
        <>
          <PhoneOff className="h-5 w-5" />
          <span>End Call</span>
        </>
      )}
    </Button>
  )
}

interface VoiceStatusProps {
  state: VoiceState
  className?: string
}

export function VoiceStatus({ state, className }: VoiceStatusProps) {
  const stateLabels: Record<VoiceState, string> = {
    idle: "Ready to assist",
    calling: "Calling...",
    connecting: "Connecting securely...",
    connected: "Connected",
    listening: "Listening...",
    thinking: "Analyzing...",
    speaking: "CareLedger is speaking",
    ended: "Call ended",
  }

  const isProcessing = state === "calling" || state === "connecting" || state === "thinking"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isProcessing && <Loader2 className="h-4 w-4 animate-spin text-accent" />}
      {!isProcessing && state === "listening" && (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
        </span>
      )}
      <span className="text-sm font-medium text-foreground">{stateLabels[state]}</span>
    </div>
  )
}

interface VoiceWaveformProps {
  state: VoiceState
  className?: string
}

export function VoiceWaveform({ state, className }: VoiceWaveformProps) {
  const isActive = state === "listening" || state === "speaking"
  
  // A simple CSS-based mock waveform
  return (
    <div className={cn("flex items-center justify-center gap-1 h-16", className)}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 rounded-full bg-accent"
          animate={{
            height: isActive ? ["20%", "80%", "40%", "100%", "30%"][i] : "20%",
          }}
          transition={{
            duration: 0.8,
            repeat: isActive ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.1,
          }}
          style={{ height: "20%" }}
        />
      ))}
    </div>
  )
}
