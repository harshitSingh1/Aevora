import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CallState } from "@/types";

interface VoiceWaveformProps {
  state: CallState;
  className?: string;
}

export function VoiceWaveform({ state, className }: VoiceWaveformProps) {
  const isSpeaking = state === "speaking" || state === "listening";
  
  return (
    <div className={cn("flex items-center justify-center gap-1 h-12", className)}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "w-2 rounded-full",
            state === "speaking" ? "bg-primary" : state === "listening" ? "bg-accent" : "bg-muted-foreground/30"
          )}
          animate={{
            height: isSpeaking ? ["8px", "32px", "16px", "40px", "8px"] : "8px",
          }}
          transition={{
            duration: isSpeaking ? 1.5 : 0.5,
            repeat: isSpeaking ? Infinity : 0,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
