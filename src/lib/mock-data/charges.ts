import { FinancialCharge } from "@/types";

export const mockCharges: Record<string, FinancialCharge[]> = {
  "demo-knee-001": [
    {
      id: "charge-001",
      description: "Room Charges",
      category: "room",
      estimatedAmount: 15000,
      billedAmount: 24000,
      financialImpact: 9000,
      status: "verified",
      evidenceLevel: "high",
      documentReferences: [
        { documentId: "doc-1", label: "Estimate (₹15,000)" },
        { documentId: "doc-3", label: "Final Bill (₹24,000)" }
      ]
    },
    {
      id: "charge-002",
      description: "Surgery",
      category: "procedure",
      estimatedAmount: 120000,
      billedAmount: 120000,
      financialImpact: 0,
      status: "verified",
      evidenceLevel: "high",
      documentReferences: [
        { documentId: "doc-1", label: "Estimate (₹1,20,000)" },
        { documentId: "doc-3", label: "Final Bill (₹1,20,000)" }
      ]
    },
    {
      id: "charge-003",
      description: "Implant",
      category: "equipment",
      estimatedAmount: 45000,
      billedAmount: 45000,
      financialImpact: 0,
      status: "verified",
      evidenceLevel: "high",
      documentReferences: [
        { documentId: "doc-1", label: "Estimate (₹45,000)" },
        { documentId: "doc-3", label: "Final Bill (₹45,000)" }
      ]
    },
    {
      id: "charge-004",
      description: "Doctor / Professional Charges",
      category: "consultation",
      estimatedAmount: 0,
      billedAmount: 18000,
      financialImpact: 18000,
      status: "verified",
      evidenceLevel: "medium",
      documentReferences: [
        { documentId: "doc-3", label: "Final Bill" }
      ]
    },
    {
      id: "charge-005",
      description: "Additional Procedure",
      category: "procedure",
      estimatedAmount: 0,
      billedAmount: 28000,
      financialImpact: 28000,
      status: "needs-clarification",
      evidenceLevel: "medium",
      relatedFindingId: "procedure-001",
      documentReferences: [
        { documentId: "doc-3", label: "Final Bill" },
        { documentId: "doc-1", label: "Not in Estimate" }
      ]
    },
    {
      id: "charge-006",
      description: "Diagnostics",
      category: "diagnostics",
      estimatedAmount: 5000,
      billedAmount: 17500,
      financialImpact: 12500,
      status: "discrepancy",
      evidenceLevel: "low",
      relatedFindingId: "diagnostic-001",
      documentReferences: [
        { documentId: "doc-3", label: "Final Bill" }
      ]
    },
    {
      id: "charge-007",
      description: "Medicines",
      category: "pharmacy",
      estimatedAmount: 5000,
      billedAmount: 18500,
      financialImpact: 13500,
      status: "needs-clarification",
      evidenceLevel: "medium",
      documentReferences: [
        { documentId: "doc-3", label: "Final Bill" }
      ]
    },
    {
      id: "charge-008",
      description: "Consumables",
      category: "pharmacy",
      estimatedAmount: 25000,
      billedAmount: 11400,
      financialImpact: 11400,
      status: "anomaly",
      evidenceLevel: "low",
      relatedFindingId: "consumables-001",
      documentReferences: [
        { documentId: "doc-3", label: "Final Bill" }
      ]
    },
    {
      id: "charge-009",
      description: "Physiotherapy",
      category: "therapy",
      estimatedAmount: 0,
      billedAmount: 7000,
      financialImpact: 7000,
      status: "verified",
      evidenceLevel: "high",
      documentReferences: [
        { documentId: "doc-3", label: "Final Bill" }
      ]
    },
    {
      id: "charge-010",
      description: "Administrative Charges",
      category: "other",
      estimatedAmount: 0,
      billedAmount: 4000,
      financialImpact: 4000,
      status: "verified",
      evidenceLevel: "medium",
      documentReferences: [
        { documentId: "doc-3", label: "Final Bill" }
      ]
    },
    {
      id: "charge-011",
      description: "Miscellaneous",
      category: "other",
      estimatedAmount: 0,
      billedAmount: 14000,
      financialImpact: 14000,
      status: "needs-clarification",
      evidenceLevel: "low",
      documentReferences: [
        { documentId: "doc-3", label: "Final Bill" }
      ]
    }
  ]
};
