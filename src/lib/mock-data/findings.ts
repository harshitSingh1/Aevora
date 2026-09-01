import { FinancialFinding } from "@/types";

export const mockFindings: Record<string, FinancialFinding[]> = {
  "demo-knee-001": [
    {
      id: "procedure-001",
      title: "Additional Procedure",
      category: "estimate-change",
      status: "needs-clarification",
      amount: 28000,
      explanation: "A procedure charge was added that does not appear on the original estimate.",
      evidenceLevel: "high",
      evidence: [
        { documentId: "doc-1", label: "Not in Estimate" },
        { documentId: "doc-3", label: "Final Bill (₹28,000)" },
      ],
      relatedEventId: "event-05",
      relatedChargeId: "charge-005",
      recommendedQuestion: "Could you provide an itemized breakdown of the ₹28,000 procedure charge and explain when it was added?",
      careledgerInsight: "The charge appears on the final bill but not the original estimate. The documents confirm the charge, but they don't show whether the additional cost was discussed beforehand."
    },
    {
      id: "diagnostic-001",
      title: "Additional Diagnostics",
      category: "quantity",
      status: "anomaly",
      amount: 17500,
      explanation: "Diagnostics were billed at ₹17,500 compared to the estimated ₹5,000, but supporting diagnostic reports are incomplete.",
      evidenceLevel: "low",
      evidence: [
        { documentId: "doc-3", label: "Final Bill (₹17,500)" },
      ],
      relatedEventId: "event-05",
      relatedChargeId: "charge-006",
      recommendedQuestion: "Could you provide the detailed reports for the additional diagnostic tests billed?",
      careledgerInsight: "Evidence incomplete. Verify the necessity and details of the additional tests."
    },
    {
      id: "consumables-001",
      title: "Consumables",
      category: "other",
      status: "needs-clarification",
      amount: 11400,
      explanation: "Itemized consumable usage requires verification.",
      evidenceLevel: "medium",
      evidence: [
        { documentId: "doc-3", label: "Final Bill (₹11,400)" }
      ],
      relatedChargeId: "charge-008",
      recommendedQuestion: "Could you provide a detailed list of the consumables billed?",
      careledgerInsight: "Review recommended to ensure consumables align with standard procedure requirements."
    }
  ]
};
