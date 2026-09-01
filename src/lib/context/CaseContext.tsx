"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { PatientCase } from "@/types"
import { mockCases } from "@/lib/mock-data/cases"

interface CaseContextType {
  currentCase: PatientCase | null
  cases: PatientCase[]
  setCurrentCase: (caseId: string) => void
  isDemo: boolean
}

const CaseContext = createContext<CaseContextType | undefined>(undefined)

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases] = useState<PatientCase[]>(mockCases)
  const [currentCaseId, setCurrentCaseId] = useState<string>(cases[0].id)
  
  // Checking for environment variable is usually done carefully in Next.js
  // For demo, we default to true if DEMO_MODE is not explicitly false
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== "false"

  const currentCase = cases.find(c => c.id === currentCaseId) || null

  const setCurrentCase = (caseId: string) => {
    setCurrentCaseId(caseId)
  }

  return (
    <CaseContext.Provider value={{ currentCase, cases, setCurrentCase, isDemo }}>
      {children}
    </CaseContext.Provider>
  )
}

export function useCase() {
  const context = useContext(CaseContext)
  if (context === undefined) {
    throw new Error("useCase must be used within a CaseProvider")
  }
  return context
}
