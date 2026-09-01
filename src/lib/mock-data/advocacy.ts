import { AdvocacyAction, EvidencePack, AdvocacyActivity } from "@/types";

export const mockAdvocacyActions: Record<string, AdvocacyAction[]> = {
  "demo-knee-001": []
};

export const mockEvidencePacks: Record<string, EvidencePack[]> = {
  "demo-knee-001": []
};

export const mockAdvocacyActivities: Record<string, AdvocacyActivity[]> = {
  "demo-knee-001": [
    {
      id: "act-1",
      type: "finding-created",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      relatedFindingId: "procedure-001",
      note: "Financial finding identified: Additional Procedure."
    }
  ]
};

export const generateMockQuestion = (findingId: string, target: string, amount?: number) => {
  if (target === "billing") {
    return "Could you provide an itemized breakdown of this charge and explain when it was added?";
  }
  if (target === "insurance") {
    return "Could you confirm whether this additional procedure was included in my authorization?";
  }
  if (target === "doctor") {
    return "Could you explain why this additional procedure was needed and whether it was discussed before it was performed?";
  }
  return "Could you provide more context on this discrepancy?";
};

export const generateMockScript = (target: string, question: string) => {
  return [
    "Hello,",
    "I am reviewing my final bill and would like clarification regarding some charges. These charges do not appear in the original estimate available to me.",
    question,
    "Thank you."
  ];
};
