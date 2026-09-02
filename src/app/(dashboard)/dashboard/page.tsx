"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Plus, Mic } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { CareFlow } from "@/components/aevora/CareFlow"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FinancialDriftIndicator } from "@/components/aevora/FinancialDriftIndicator"
import { FindingCard } from "@/components/aevora/FindingCard"
import { DocumentCard } from "@/components/aevora/DocumentCard"
import { AIIndicator } from "@/components/aevora/AIIndicator"

import { useCase } from "@/lib/context/CaseContext"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { FinancialChart } from "@/components/dashboard/FinancialChart"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { mockFindings, mockDocuments } from "@/lib/mock-data"

export default function DashboardOverview() {
  const { currentCase } = useCase()
  const firstName = currentCase?.patientName.split(" ")[0] || "there"

  if (!currentCase) return null

  const findings = mockFindings[currentCase.id] || []

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 pb-24 md:pb-12">
      <PageHeader 
        title={`Good evening, ${firstName}.`}
        description="Here's the current picture of your healthcare and financial journey."
        action={<Button className="gap-2"><Plus className="h-4 w-4" /> New Case</Button>}
      />
      
      <div className="mt-4 space-y-8">
        <SummaryCards />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Financial Journey */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Financial Journey</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-sm text-muted-foreground mb-4">Your current bill compared with the original estimate.</p>
              
              <FinancialDriftIndicator 
                originalEstimate={currentCase.originalEstimate}
                finalBill={currentCase.finalBill || currentCase.currentBill}
              />
              
              <FinancialChart />

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm font-medium text-warning">3 cost changes need clarification</span>
                <Link href="/financial-analysis">
                  <Button variant="ghost" size="sm" className="gap-1 h-8">
                    View Analysis <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Care Journey */}
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Care Journey</CardTitle>
              <AIIndicator text="Tracking progress" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="flex-1 flex items-center py-8">
                <CareFlow />
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                <Link href="/timeline">
                  <Button variant="ghost" size="sm" className="gap-1 h-8">
                    View full timeline <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Needs Attention */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Needs your attention</h3>
            </div>
            <div className="space-y-3">
              {findings.map((finding) => (
                <FindingCard 
                  key={finding.id}
                  status={finding.status as any}
                  title={finding.title}
                  amount={finding.amount ? `₹${finding.amount.toLocaleString('en-IN')}` : undefined}
                  explanation={finding.explanation}
                  actionLabel="Review"
                  href={`/financial-analysis?finding=${finding.id}`}
                />
              ))}
            </div>
          </section>

          {/* Recent Documents */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight">Recent documents</h3>
            </div>
            <div className="space-y-3">
              {mockDocuments.map((doc) => (
                <DocumentCard 
                  key={doc.id}
                  name={doc.name}
                  type={doc.type}
                  status={doc.status}
                  date={doc.date}
                />
              ))}
              <Link href="/documents" className="block mt-4 text-center">
                <Button variant="outline" className="w-full">View all documents</Button>
              </Link>
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">What would you like to do?</h3>
          <QuickActions />
        </section>

        {/* Voice CTA */}
        <section className="mt-12">
          <div className="rounded-2xl border border-border bg-[#0B1F33] p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="space-y-4 relative z-10 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold">Still have a question?</h2>
              <h3 className="text-xl md:text-2xl text-accent font-medium">Talk to Aevora</h3>
              <p className="text-muted-foreground max-w-md text-sm md:text-base">
                Ask about your bill, insurance, or documents. Aevora understands the context of your case.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <Link href="/talk">
                <Button size="lg" className="rounded-full h-14 px-8 gap-3 bg-accent text-primary hover:bg-accent/90 shadow-lg font-semibold text-base">
                  <Mic className="h-5 w-5" />
                  Talk now <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
