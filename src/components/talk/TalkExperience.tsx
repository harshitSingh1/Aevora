"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useCase } from "@/lib/context/CaseContext"
import { useTalkSession } from "@/hooks/useTalkSession"
import { useVoiceConversation } from "@/hooks/useVoiceConversation"
import { TalkContext, CallState } from "@/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VoiceDiagnostics } from "./VoiceDiagnostics"
import { VoiceWaveform } from "@/components/talk/VoiceWaveform"
import { Mic, PhoneOff, MicOff, Settings, List, FileText, ChevronRight, PlayCircle, Loader2, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"
import { mockFindings } from "@/lib/mock-data"
import { mockAdvocacyActions } from "@/lib/mock-data/advocacy"

export function TalkExperience() {
  const { currentCase } = useCase()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const findingId = searchParams?.get("finding")
  const sourceParam = searchParams?.get("context") as TalkContext["source"] || "dashboard"
  
  const initialContext: TalkContext = {
    caseId: currentCase?.id || "",
    source: sourceParam,
    findingId: findingId || undefined,
  }

  const sessionParams = useTalkSession(initialContext)
  const { 
    context, messages, addMessage, callState, setCallState, language
  } = sessionParams

  const voiceParams = useVoiceConversation(sessionParams)
  const { startCall, endCall, interrupt, submitQuery, timer, isMicActive, toggleMic, audioState } = voiceParams

  const [textInput, setTextInput] = React.useState("")
  const [showTranscript, setShowTranscript] = React.useState(true)

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const finding = React.useMemo(() => {
    if (!currentCase || !context.findingId) return null
    return mockFindings[currentCase.id]?.find(f => f.id === context.findingId)
  }, [currentCase, context.findingId])

  // Pre-fill suggested questions based on context
  const suggestedQuestions = finding ? [
    "Why was this charge added?",
    "What should I ask billing?",
    "Is this covered by insurance?",
    "What should I do next?"
  ] : [
    "Explain the bill to me.",
    "Why is my bill so high?",
    "Was I overcharged?",
    "What should I do next?"
  ];

  
  const handleExportTranscript = () => {
    if (messages.length === 0) return;
    const text = messages.map(m => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.role.toUpperCase()}: ${m.text}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aevora-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  
  const handleAddToAdvocacy = () => {
    if (!currentCase) return;
    const actions = mockAdvocacyActions[currentCase.id] || [];
    actions.push({
      id: "act-talk-" + Date.now(),
      title: "Follow up on Talk discussion",
      target: "billing",
      status: "todo",
      question: "Why was this charge added?",
      createdAt: new Date().toISOString()
    });
    mockAdvocacyActions[currentCase.id] = actions;
    alert('Added to Advocacy Plan!');
  };

  const handleSendText = () => {
    if (textInput.trim()) {
      submitQuery(textInput)
      setTextInput("")
    }
  }
  


  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] w-full gap-4 max-w-6xl mx-auto">
      <VoiceDiagnostics telemetry={{ 
        callState, 
        isMicActive: voiceParams.isMicActive, 
        framesSent: voiceParams.framesSent,
        stt: voiceParams.sttTelemetry, 
        ai: voiceParams.aiTelemetry, 
        tts: voiceParams.voiceTelemetry 
      }} />
      
      {/* Main Call Area */}
      <Card className="flex-1 flex flex-col bg-surface border-border overflow-hidden relative">
        <div className="p-4 flex items-center justify-between border-b border-border bg-muted/20 z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium">Aevora Assistant</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {callState !== "idle" && callState !== "ended" && (
              <span className="font-mono">{formatTime(timer)}</span>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowTranscript(!showTranscript)}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          
          <AnimatePresence mode="wait">
            {callState === "idle" && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center max-w-sm"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Mic className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Talk to Aevora</h2>
                <p className="text-muted-foreground mb-8">
                  Your case-aware patient advocacy assistant. Ask about your bill, insurance, or what to ask next.
                </p>
                <Button size="lg" className="rounded-full px-8" onClick={startCall}>
                  Start conversation
                </Button>
              </motion.div>
            )}

            {(callState === "ringing" || callState === "connecting") && (
              <motion.div 
                key="connecting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-32 h-32 relative mb-6">
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="absolute inset-2 rounded-full bg-primary/20 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                </div>
                <h2 className="text-xl font-medium">{callState === "ringing" ? "Calling Aevora..." : "Connecting your case context..."}</h2>
              </motion.div>
            )}

            {(callState === "active" || callState === "listening" || callState === "thinking" || callState === "speaking") && (
              <motion.div 
                key="active"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center w-full max-w-md"
              >
                <div className="mb-12">
                  <VoiceWaveform state={callState} className="scale-150" />
                </div>
                
                <div className="text-center h-12 mb-8">
                  {callState === "listening" && <p className="text-lg text-muted-foreground">Listening</p>}
                  {callState === "thinking" && <p className="text-lg text-muted-foreground">Thinking...</p>}
                  {callState === "speaking" && <p className="text-lg font-medium text-primary">Aevora is speaking</p>}
                  {callState === "active" && <p className="text-lg text-muted-foreground">Ready</p>}
                  {audioState === "error" && <p className="text-sm text-destructive mt-1">Voice unavailable</p>}
                </div>

                {/* Suggestions if active and no input */}
                {callState === "active" && messages.length <= 1 && (
                  <div className="w-full space-y-2 mb-8">
                    {suggestedQuestions.map(q => (
                      <Button key={q} variant="outline" className="w-full justify-start text-left h-auto py-3 bg-surface" onClick={() => submitQuery(q)}>
                        &quot;{q}&quot;
                      </Button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {callState === "error" && (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center max-w-md"
              >
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <PhoneOff className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-destructive">Microphone Access Required</h2>
                <p className="text-muted-foreground mb-8">
                  We couldn&apos;t access your microphone. Please check your browser permissions or try typing a message instead.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setCallState("idle")}>Try again</Button>
                  <Button onClick={() => router.push("/advocacy")}>Back to Advocacy</Button>
                </div>
              </motion.div>
            )}
            {callState === "ended" && (
              <motion.div 
                key="ended"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center max-w-md"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Conversation ended</h2>
                <p className="text-muted-foreground mb-8">
                  You can review the transcript or add actions to your advocacy plan.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => sessionParams.clearSession()}>Start again</Button>
                  <Button onClick={handleAddToAdvocacy}>Add to Advocacy Plan</Button>
                  <Button onClick={() => router.push("/advocacy")}>Back to Advocacy</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call Controls Floating Bottom */}
          {(callState === "active" || callState === "listening" || callState === "thinking" || callState === "speaking") && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-background/80 backdrop-blur-md p-4 rounded-full border border-border shadow-lg">
              <Button 
                variant={isMicActive ? "default" : "outline"} 
                size="icon" 
                className={cn("w-14 h-14 rounded-full", isMicActive ? "bg-accent hover:bg-accent/90" : "bg-surface")}
                onClick={toggleMic}
                disabled={callState === "thinking"}
              >
                {isMicActive ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                className="w-14 h-14 rounded-full"
                onClick={endCall}
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Right Panel: Context & Transcript */}
      {(showTranscript || callState !== "idle") && (
        <div className="w-full lg:w-96 flex flex-col gap-4">
          {/* Context Panel */}
          <Card className="p-4 bg-surface border-border flex flex-col gap-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Case Context
            </h3>
            {finding ? (
              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Discussing Issue</div>
                <div className="font-medium">{finding.title}</div>
                {finding.amount && <div className="text-sm text-primary font-medium mt-1">₹{finding.amount.toLocaleString('en-IN')}</div>}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">General Case Discussion</div>
            )}
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Using your selected Aevora case
            </div>
          </Card>

          {/* Transcript Panel */}
          <Card className="flex-1 flex flex-col bg-surface border-border overflow-hidden">
            <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Transcript</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground pt-8 italic">
                  Messages will appear here once the conversation starts.
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={cn("flex flex-col max-w-[85%]", msg.role === "user" ? "ml-auto" : "mr-auto")}>
                    <div className={cn("text-[10px] font-semibold uppercase tracking-wider mb-1", msg.role === "user" ? "text-right text-muted-foreground" : "text-left text-primary")}>
                      {msg.role === "user" ? "You" : "Aevora"}
                    </div>
                    <div className={cn("p-3 rounded-xl text-sm", msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm")}>
                      {msg.text}
                    </div>
                    {msg.relatedDocumentIds && msg.relatedDocumentIds.length > 0 && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <FileText className="w-3 h-3" /> Based on {msg.relatedDocumentIds.length} document{msg.relatedDocumentIds.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {/* Text Input Fallback */}
            {(callState === "active" || callState === "listening" || callState === "speaking" || callState === "thinking") && (
              <div className="p-3 border-t border-border bg-muted/20">
                <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSendText(); }}>
                  <input 
                    type="text" 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-1 bg-surface border border-border rounded-full px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={callState === "thinking"}
                  />
                  <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!textInput.trim() || callState === "thinking"}>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}
