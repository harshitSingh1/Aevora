"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useCase } from "@/lib/context/CaseContext"

export function SummaryCards() {
  const { currentCase } = useCase()
  
  if (!currentCase) return null

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val)
    
  const patientResponsibility = Math.max(0, currentCase.currentBill - currentCase.insuranceApproved)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Treatment Cost</p>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(currentCase.finalBill || currentCase.currentBill)}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Current final bill
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Insurance</p>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-success">
              {formatCurrency(currentCase.insuranceApproved)}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Approved
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Patient Responsibility</p>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(patientResponsibility)}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Current estimate
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 relative overflow-hidden">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Review</p>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-warning">3</span>
              <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              Items need attention
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
