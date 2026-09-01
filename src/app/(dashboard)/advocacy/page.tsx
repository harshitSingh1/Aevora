"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useCase } from "@/lib/context/CaseContext"
import { mockFindings } from "@/lib/mock-data"
import { mockAdvocacyActions, mockEvidencePacks, mockAdvocacyActivities, generateMockQuestion } from "@/lib/mock-data/advocacy"
import { prepareAdvocacyQuestion, prepareAdvocacyScript } from "@/services/ai/advocacy"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Mic, ArrowRight, CheckCircle2, ChevronRight, FileText, AlertCircle, Phone, Stethoscope, BriefcaseMedical, Landmark, Building2, Copy, Download, Share, User, History, Check, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { Finding } from "@/types"
import { AIIndicator } from "@/components/careledger/AIIndicator"

export default function AdvocacyCenterPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading Advocacy Center...</div>}>
      <AdvocacyContent />
    </React.Suspense>
  )
}

function AdvocacyContent() {
  const { currentCase } = useCase()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const findingIdParam = searchParams?.get("finding")
  
  // State
  const [selectedFindingId, setSelectedFindingId] = React.useState<string | null>(findingIdParam || null)
  const [workspaceTarget, setWorkspaceTarget] = React.useState<"doctor" | "billing" | "insurance" | "facility" | "scheme">("billing")
  const [question, setQuestion] = React.useState<{text: string, why: string} | null>(null)
  const [script, setScript] = React.useState<string[] | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [showEvidencePack, setShowEvidencePack] = React.useState(false)

  
  const handleCopySummary = async () => {
    if (!selectedFinding) return;
    const text = [
      `Finding: ${selectedFinding.title}`,
      `Amount: ₹${selectedFinding.amount?.toLocaleString('en-IN')}`,
      `Question: ${question?.text || ''}`
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleExportEvidence = () => {
    if (!selectedFinding) return;
    const text = [
      'CARELEDGER EVIDENCE PACK',
      '========================',
      `Case: ${currentCase?.patientName}`,
      `Finding: ${selectedFinding.title}`,
      `Amount: ₹${selectedFinding.amount?.toLocaleString('en-IN')}`,
      `Status: Needs clarification`,
      '\nSOURCE DOCUMENTS:',
      ...selectedFinding.evidence.map(ev => `- ${ev.label}`),
      '\nQUESTION PREPARED:',
      question?.text || '',
      '\nNOTES:',
      '...' // We could add notes if we had state for it
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careledger-evidence-${selectedFinding.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  
  const findings = currentCase ? mockFindings[currentCase.id] || [] : []
  const actions = currentCase ? mockAdvocacyActions[currentCase.id] || [] : []
  const packs = currentCase ? mockEvidencePacks[currentCase.id] || [] : []
  const activities = currentCase ? mockAdvocacyActivities[currentCase.id] || [] : []

  const selectedFinding = findings.find(f => f.id === selectedFindingId)

  // Generate question when finding and target change
  React.useEffect(() => {
    if (selectedFinding) {
      setTimeout(() => setIsLoading(true), 0)
      prepareAdvocacyQuestion(selectedFinding.category, workspaceTarget, selectedFinding.amount)
        .then(res => {
          setQuestion({ text: res.question, why: res.why })
          return prepareAdvocacyScript(workspaceTarget, res.question)
        })
        .then(res => {
          setScript(res)
          setIsLoading(false)
        })
    }
  }, [selectedFinding, workspaceTarget])

  const handleCopyScript = () => {
    if (script) {
      navigator.clipboard.writeText(script.join("\n\n"))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 h-full flex flex-col max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <PageHeader 
          title="Patient Advocacy Center" 
          description="Turn confusing healthcare information into clear questions, evidence, and next steps."
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/timeline")}>
            View Timeline
          </Button>
          <Button onClick={() => router.push("/talk")}>
            <Mic className="w-4 h-4 mr-2" />
            Talk to CareLedger
          </Button>
        </div>
      </div>
      
      {!selectedFinding ? (
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-amber-500 bg-surface">
              <div className="text-sm text-muted-foreground font-medium mb-1">Open issues</div>
              <div className="text-3xl font-semibold">3</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-blue-500 bg-surface">
              <div className="text-sm text-muted-foreground font-medium mb-1">Questions prepared</div>
              <div className="text-3xl font-semibold">5</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-purple-500 bg-surface">
              <div className="text-sm text-muted-foreground font-medium mb-1">Evidence packs</div>
              <div className="text-3xl font-semibold">3</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-emerald-500 bg-surface">
              <div className="text-sm text-muted-foreground font-medium mb-1">Follow-up needed</div>
              <div className="text-3xl font-semibold">1</div>
            </Card>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-muted/50 rounded-lg border border-border overflow-x-auto gap-4">
            {["Understand", "Prepare", "Ask", "Document", "Follow up", "Escalate if needed"].map((step, idx, arr) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-sm font-medium mb-2 text-primary">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-medium text-foreground">{step}</span>
                </div>
                {idx < arr.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4 tracking-tight">What needs attention?</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {findings.map(finding => (
                <Card key={finding.id} className="p-5 flex flex-col bg-surface border-border hover:border-border/80 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{finding.title}</h3>
                      {finding.amount && (
                        <p className="text-lg font-medium text-primary mt-1">₹{finding.amount.toLocaleString('en-IN')}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                      {finding.status === "needs-clarification" ? "Needs clarification" : "Review recommended"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-2">
                    {finding.explanation}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button className="w-full justify-between" onClick={() => setSelectedFindingId(finding.id)}>
                      Prepare question <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="ghost" className="w-full text-muted-foreground">
                      View evidence <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              ))}
              
              {findings.length === 0 && (
                <div className="col-span-3 text-center py-12 border border-dashed rounded-lg border-border">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-3" />
                  <h3 className="text-lg font-medium text-foreground mb-1">Nothing needs advocacy yet.</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    CareLedger will surface questions when your documents contain something that needs clarification.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <h2 className="text-xl font-bold mb-4 tracking-tight">Advocacy Plan</h2>
              <div className="space-y-2">
                {actions.map(action => (
                  <div key={action.id} className="flex items-start gap-3 p-3 bg-surface border border-border rounded-lg">
                    <div className="mt-0.5">
                      {action.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{action.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <span className="capitalize">{action.target}</span> • {new Date(action.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 tracking-tight">Recent Activity</h2>
              <div className="relative border-l border-border ml-3 space-y-6 pb-4">
                {activities.map((activity, i) => (
                  <div key={activity.id} className="relative pl-6">
                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                    <p className="text-sm font-medium text-foreground capitalize">
                      {activity.type.replace("-", " ")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                    {activity.note && (
                      <p className="text-xs text-muted-foreground mt-1 bg-muted p-2 rounded">
                        &quot;{activity.note}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] overflow-hidden">
          {/* Main Workspace */}
          <div className="flex-1 flex flex-col h-full bg-surface border border-border rounded-xl overflow-y-auto">
            <div className="p-6 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Button variant="link" className="p-0 h-auto" onClick={() => setSelectedFindingId(null)}>Advocacy Center</Button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium">Finding Workspace</span>
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">{selectedFinding.title}</h2>
                  {selectedFinding.amount && (
                    <p className="text-xl font-medium text-primary">₹{selectedFinding.amount.toLocaleString('en-IN')}</p>
                  )}
                </div>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Needs clarification
                </Badge>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-8">
              {/* Target Selection */}
              <div>
                <h3 className="text-base font-semibold mb-3">Who do you want to ask?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "doctor", label: "Doctor", icon: Stethoscope },
                    { id: "billing", label: "Billing", icon: Landmark },
                    { id: "insurance", label: "Insurance", icon: ShieldCheck },
                    { id: "facility", label: "Facility Desk", icon: Building2 },
                  ].map(target => (
                    <Button 
                      key={target.id}
                      variant={workspaceTarget === target.id ? "default" : "outline"}
                      className={cn(
                        "h-auto py-3 px-4 flex flex-col gap-2 items-center justify-center transition-all",
                        workspaceTarget === target.id ? "" : "bg-surface"
                      )}
                      onClick={() => setWorkspaceTarget(target.id as any)}
                    >
                      <target.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{target.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Question & Script */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    Prepare for the conversation
                    <AIIndicator text="AI Suggested" />
                  </h3>
                </div>
                
                <Card className="bg-muted/30 border-border overflow-hidden">
                  <div className="p-5 space-y-4">
                    {isLoading ? (
                      <div className="py-8 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm">Preparing a concise question for {workspaceTarget}...</p>
                      </div>
                    ) : (
                      <>
                        {question && (
                          <div className="space-y-2">
                            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Question for {workspaceTarget}
                            </div>
                            <div className="text-lg font-medium text-foreground italic border-l-4 border-primary pl-4 py-1">
                              &quot;{question.text}&quot;
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 bg-surface p-3 rounded-lg border border-border">
                              <span className="font-semibold text-foreground mr-1">Why this question?</span>
                              {question.why}
                            </p>
                          </div>
                        )}
                        
                        {script && (
                          <div className="pt-4 mt-4 border-t border-border">
                            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                              Suggested Script
                            </div>
                            <div className="space-y-3">
                              {script.map((line, idx) => (
                                <div key={idx} className="flex gap-3 text-sm">
                                  <div className="text-muted-foreground/50 select-none mt-0.5 text-xs">
                                    {idx === 0 ? "Start" : idx === 1 ? "Ask" : idx === 2 ? "Follow up" : "Close"}
                                  </div>
                                  <div className="text-foreground">{line}</div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex gap-2 mt-6">
                              <Button variant="outline" className="flex-1 bg-surface" onClick={handleCopyScript}>
                                {copied ? <Check className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? "Script copied" : "Copy script"}
                              </Button>
                              <Button className="flex-1">
                                Create Action Plan
                              </Button>
                            </div>
                            <p className="text-[10px] text-muted-foreground text-center mt-3 max-w-sm mx-auto">
                              AI-generated questions are suggestions based on the information available in your case. Review them before using them.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              </div>

              {/* Action Plan Preview */}
              <div>
                <h3 className="text-base font-semibold mb-3">Action Plan</h3>
                <Card className="bg-surface border-border p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 group">
                      <button className="w-5 h-5 rounded border-2 border-muted-foreground/30 shrink-0 mt-0.5 hover:border-primary flex items-center justify-center transition-colors" />
                      <span className="text-sm text-foreground">Ask {workspaceTarget} for clarification regarding {selectedFinding.title.toLowerCase()}</span>
                    </div>
                    <div className="flex items-start gap-3 group">
                      <button className="w-5 h-5 rounded border-2 border-muted-foreground/30 shrink-0 mt-0.5 hover:border-primary flex items-center justify-center transition-colors" />
                      <span className="text-sm text-foreground">Record response from {workspaceTarget}</span>
                    </div>
                    <div className="flex items-start gap-3 group">
                      <button className="w-5 h-5 rounded border-2 border-muted-foreground/30 shrink-0 mt-0.5 hover:border-primary flex items-center justify-center transition-colors" />
                      <span className="text-sm text-foreground">Follow up if unresolved</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Response Capture & Resolution */}
              <div>
                <h3 className="text-base font-semibold mb-3">Follow-up</h3>
                <Card className="bg-surface border-border p-4 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">What did they say?</label>
                    <textarea 
                      className="w-full bg-muted/20 border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary h-20"
                      placeholder="e.g., Billing said they will send an itemized breakdown..."
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <Button variant="outline" size="sm">Save follow-up</Button>
                    <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Context Panel */}
          <div className="w-full lg:w-80 flex flex-col gap-4 h-full">
            <Card className="p-4 bg-surface border-border flex flex-col">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Evidence
              </h3>
              <div className="space-y-2 flex-1">
                {selectedFinding.evidence.map((ev, i) => (
                  <div key={i} className="text-sm flex items-start gap-2 p-2 bg-muted/30 rounded border border-border/50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{ev.label}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-surface" onClick={() => setShowEvidencePack(true)}>
                <BriefcaseMedical className="w-4 h-4 mr-2 text-primary" />
                Create Evidence Pack
              </Button>
            </Card>

            <Card className="p-4 bg-surface border-border flex-1 overflow-y-auto">
              <h3 className="text-sm font-semibold mb-3">Escalation</h3>
              <p className="text-xs text-muted-foreground mb-4">
                If your question remains unanswered, CareLedger can help you understand possible next steps.
              </p>
              
              <div className="space-y-4">
                <div className="border-l-2 border-border pl-3">
                  <div className="text-sm font-medium text-foreground mb-1">1. Follow up</div>
                  <div className="text-xs text-muted-foreground mb-2">Follow up with the same department and reference your previous request.</div>
                  <Button variant="link" className="h-auto p-0 text-xs text-primary">Prepare follow-up →</Button>
                </div>
                <div className="border-l-2 border-border pl-3">
                  <div className="text-sm font-medium text-foreground mb-1">2. Written Request</div>
                  <div className="text-xs text-muted-foreground mb-2">Ask for the explanation in writing.</div>
                  <Button variant="link" className="h-auto p-0 text-xs text-primary">Create written request →</Button>
                </div>
                <div className="border-l-2 border-border pl-3 opacity-70">
                  <div className="text-sm font-medium text-foreground mb-1">3. Support Channel</div>
                  <div className="text-xs text-muted-foreground mb-2">Contact the appropriate grievance/support channel.</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Escalation options vary by provider, insurer, location, and situation. Verify the appropriate process with the relevant organization. CareLedger does not provide legal advice.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Evidence Pack Modal */}
      <AnimatePresence>
        {showEvidencePack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <BriefcaseMedical className="w-5 h-5 text-primary" />
                  CareLedger Evidence Pack
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowEvidencePack(false)}>
                  <span className="sr-only">Close</span>
                  <XIcon className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <p className="text-sm text-muted-foreground italic">
                  Keep relevant information together when speaking with billing, insurance, or a healthcare provider.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Case</div>
                    <div className="font-medium">{currentCase?.patientName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Issue</div>
                    <div className="font-medium text-foreground">{selectedFinding?.title}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Amount</div>
                    <div className="font-medium text-primary">₹{selectedFinding?.amount?.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Status</div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Needs clarification</Badge>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">Source Documents</div>
                  <div className="space-y-2">
                    {selectedFinding?.evidence.map((ev, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>{ev.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">Question Prepared</div>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border text-sm italic font-medium">
                    &quot;{question?.text}&quot;
                  </div>
                </div>
                
                <div className="border-t border-border pt-6">
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">Patient Notes</div>
                  <textarea 
                    className="w-full bg-surface border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary h-24"
                    placeholder="Add your notes..."
                  />
                </div>
              </div>
              
              <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3">
                <Button variant="outline" className="bg-surface" onClick={handleCopySummary}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Summary
                </Button>
                <Button onClick={handleExportEvidence}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
