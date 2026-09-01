import { InsuranceCase } from "@/types";

export const mockInsurance: Record<string, InsuranceCase> = {
  "demo-knee-001": {
    insurer: "CareHealth Prime",
    approvalAmount: 180000,
    approvedDate: "2026-08-14",
    authorizationId: "AUTH-8923-K",
    status: "partial",
    sourceDocumentIds: ["doc-4"],
    patientResponsibilityEstimate: 127400,
    lineItems: [
      {
        id: "ins-01",
        category: "Surgery & Implant",
        billedAmount: 165000,
        approvedAmount: 150000,
        patientResponsibility: 15000,
        status: "partial",
        evidenceLevel: "high",
        explanation: "Implant cost capped per policy limits.",
        sourceDocumentIds: ["doc-4"]
      },
      {
        id: "ins-02",
        category: "Room & Board",
        billedAmount: 24000,
        approvedAmount: 20000,
        patientResponsibility: 4000,
        status: "partial",
        evidenceLevel: "high",
        explanation: "Room rent cap exceeded by ₹4,000.",
        sourceDocumentIds: ["doc-4"]
      },
      {
        id: "ins-03",
        category: "Additional Procedure",
        billedAmount: 28000,
        approvedAmount: 0,
        patientResponsibility: 28000,
        status: "pending",
        evidenceLevel: "medium",
        explanation: "Coverage needs clarification. Procedure not in original authorization.",
        verificationQuestion: "Was the additional procedure included in the authorization?",
        sourceDocumentIds: ["doc-4"]
      },
      {
        id: "ins-04",
        category: "Diagnostics & Pharmacy",
        billedAmount: 47400, // 17500 + 18500 + 11400
        approvedAmount: 10000,
        patientResponsibility: 37400,
        status: "not-approved",
        evidenceLevel: "low",
        explanation: "Non-medical consumables and non-authorized diagnostics typically excluded.",
        sourceDocumentIds: ["doc-4"]
      },
      {
        id: "ins-05",
        category: "Other Services",
        billedAmount: 43000, // 18000 + 7000 + 4000 + 14000
        approvedAmount: 0,
        patientResponsibility: 43000,
        status: "unknown",
        evidenceLevel: "low",
        explanation: "Requires review against specific policy sub-limits.",
        sourceDocumentIds: ["doc-4"]
      }
    ]
  }
};
