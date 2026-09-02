"use client"
import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Mic, Phone } from "lucide-react"

export function VoiceSection() {
  const [demoState, setDemoState] = React.useState<"idle" | "calling" | "connected">("idle")

  const handleDemoClick = () => {
    if (demoState !== "idle") return
    setDemoState("calling")
    setTimeout(() => setDemoState("connected"), 1500)
    setTimeout(() => setDemoState("idle"), 8000) // reset for demo purposes
  }

  return (
    <section id="talk-to-ai" className="py-24 md:py-32 bg-slate-900 text-slate-50 overflow-hidden scroll-mt-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              Still have a question? <br />
              <span className="text-cyan-400">Just talk to Aevora.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl mb-8">
              Ask about your bill, insurance, documents, or what you should ask your doctor. Aevora already understands the case you&apos;re looking at.
            </p>
          </motion.div>

          <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 flex flex-col items-center h-[500px]">
              
              <div className="w-full flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-sm font-medium text-slate-300">Aevora AI</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">00:00</span>
              </div>

              <div className="flex-1 w-full flex flex-col items-center justify-center relative">
                <AnimatePresence mode="wait">
                  {demoState === "idle" && (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={handleDemoClick}
                    >
                      <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-600 transition-colors">
                        <Phone className="w-10 h-10" />
                      </div>
                      <p className="mt-6 text-slate-400 font-medium">Ready when you are</p>
                      <p className="text-xs text-slate-500 mt-2">Click to try</p>
                    </motion.div>
                  )}

                  {demoState === "calling" && (
                    <motion.div 
                      key="calling"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-24 h-24 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 relative">
                        <Phone className="w-10 h-10 animate-pulse" />
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-500 animate-ping opacity-50" />
                      </div>
                      <p className="mt-6 text-slate-400 font-medium animate-pulse">Calling Aevora...</p>
                    </motion.div>
                  )}

                  {demoState === "connected" && (
                    <motion.div 
                      key="connected"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col"
                    >
                      <div className="flex flex-col items-center mb-auto pt-4">
                        <div className="flex items-center justify-center gap-1 h-12">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ height: ["20%", "80%", "20%"] }}
                              transition={{ repeat: Infinity, duration: 1 + (i * 0.2), ease: "easeInOut" }}
                              className="w-1.5 bg-cyan-400 rounded-full"
                            />
                          ))}
                        </div>
                        <p className="mt-4 text-cyan-400 text-sm font-medium">Listening...</p>
                      </div>

                      <div className="bg-slate-700/50 rounded-xl p-4 mt-auto mb-4 border border-slate-600">
                        <div className="flex flex-col gap-4 text-sm">
                          <div className="self-end bg-cyan-900/50 text-cyan-100 p-3 rounded-2xl rounded-br-sm max-w-[80%]">
                            Why did my bill increase?
                          </div>
                          <div className="self-start bg-slate-600/50 text-slate-200 p-3 rounded-2xl rounded-bl-sm max-w-[85%]">
                            Mostly because three new charges were added: a procedure, diagnostics, and additional room charges.
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
            
            {/* Background glow */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl -z-10 rounded-full transform -translate-x-10 translate-y-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
