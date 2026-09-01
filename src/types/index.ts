export type CaseStatus = "active" | "completed" | "draft"

export interface PatientCase {
  id: string
  patientName: string
  age?: number
  title: string
  status: CaseStatus
  originalEstimate: number
  insuranceApproved: number
  currentBill: number
  finalBill?: number
  financialDrift?: number
  financialDriftPercent?: number
  createdAt: string
  updatedAt: string
}

export type InsuranceLineItem = {
  id: string;
  category: string;
  billedAmount?: number;
  approvedAmount?: number;
  patientResponsibility?: number;
  status: "approved" | "partial" | "not-approved" | "pending" | "unknown";
  evidenceLevel: "high" | "medium" | "low";
  sourceDocumentIds?: string[];
  explanation?: string;
  verificationQuestion?: string;
};

export type InsuranceCase = {
  insurer?: string;
  approvalAmount?: number;
  approvedDate?: string;
  authorizationId?: string;
  status: "approved" | "partial" | "pending" | "unknown";
  lineItems: InsuranceLineItem[];
  sourceDocumentIds: string[];
  patientResponsibilityEstimate?: number;
};

export type CareOption = {
  id: string;
  name: string;
  type: "private" | "government" | "scheme";
  estimatedCost?: {
    min?: number;
    max?: number;
    label?: string;
  };
  insuranceStatus: "covered" | "possible" | "unknown" | "not-covered";
  eligibility: "likely" | "uncertain" | "unlikely" | "verify";
  availability: "high" | "medium" | "low" | "unknown";
  waitingTime?: string;
  distance?: string;
  requirements?: string[];
  evidenceLevel: "high" | "medium" | "low";
  verificationItems?: string[];
  notes?: string;
};

export type CarePreferences = {
  priorities: ("cost" | "coverage" | "distance" | "waiting" | "eligibility")[];
};

export interface FinancialEvent {
  day: string
  amount: number
  event: string
}

export interface Document {
  id: string
  name: string
  type: string
  status: "uploading" | "processing" | "analyzed" | "error"
  date: string
}

export interface Finding {
  id: string
  status: "verified" | "clarification" | "anomaly" | "discrepancy"
  title: string
  amount?: string
  explanation: string
}

export type TimelineEventType =
  | "recommendation"
  | "estimate"
  | "insurance"
  | "admission"
  | "treatment"
  | "procedure"
  | "diagnostic"
  | "interim_bill"
  | "final_bill"
  | "discharge";

export type TimelineEventStatus =
  | "completed"
  | "current"
  | "upcoming"
  | "warning"
  | "discrepancy";

export type DocumentReference = {
  documentId: string;
  page?: number;
  region?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  label?: string;
};

export type FinancialFinding = {
  id: string;
  title: string;
  category: "estimate-change" | "duplicate" | "missing-evidence" | "benchmark-anomaly" | "insurance" | "quantity" | "other";
  status: "verified" | "needs-clarification" | "anomaly" | "discrepancy";
  amount?: number;
  explanation: string;
  evidenceLevel: "high" | "medium" | "low";
  evidence: { documentId: string; label: string }[];
  relatedEventId?: string;
  relatedChargeId?: string;
  documentReferences?: DocumentReference[];
  recommendedQuestion?: string;
  recommendation?: string;
  documentFact?: string;
  careledgerInsight?: string;
};

export type FinancialCharge = {
  id: string;
  description: string;
  category: string;
  estimatedAmount?: number;
  billedAmount: number;
  financialImpact?: number;
  date?: string;
  status: "verified" | "needs-clarification" | "anomaly" | "discrepancy";
  evidenceLevel: "high" | "medium" | "low";
  documentReferences?: DocumentReference[];
  relatedFindingId?: string;
};

export type CareTimelineEvent = {
  id: string;
  date: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  careContext?: string;
  financialImpact?: number;
  cumulativeCost?: number;
  status: TimelineEventStatus;
  evidence?: {
    documentId: string;
    label: string;
  }[];
  relatedFindingIds?: string[];
  metadata?: Record<string, unknown>;
};

export type AdvocacyAction = {
  id: string;
  title: string;
  description?: string;
  target: "doctor" | "billing" | "insurance" | "facility" | "scheme";
  status: "todo" | "in-progress" | "completed";
  relatedFindingId?: string;
  relatedEvidenceIds?: string[];
  question?: string;
  createdAt: string;
  completedAt?: string;
};

export type EvidencePack = {
  id: string;
  title: string;
  caseId: string;
  findingIds: string[];
  eventIds: string[];
  documentIds: string[];
  insuranceItemIds?: string[];
  questions: string[];
  notes?: string;
  createdAt: string;
  status: "draft" | "ready" | "shared";
};

export type AdvocacyContext = {
  caseId: string;
  findingId?: string;
  eventId?: string;
  target: "doctor" | "billing" | "insurance" | "facility" | "scheme";
  goal: "understand" | "verify" | "explain" | "request-evidence" | "follow-up";
  selectedEvidenceIds: string[];
};

export type TalkContext = {
  caseId: string;
  source: "dashboard" | "financial" | "finding" | "insurance" | "care-option" | "advocacy";
  findingId?: string;
  eventId?: string;
  chargeId?: string;
  documentIds?: string[];
  insuranceItemId?: string;
  careOptionId?: string;
  advocacyTarget?: "doctor" | "billing" | "insurance" | "facility" | "scheme";
};

export type AdvocacyActivity = {
  id: string;
  type: "finding-created" | "question-prepared" | "question-asked" | "response-recorded" | "follow-up" | "resolved";
  timestamp: string;
  relatedFindingId?: string;
  note?: string;
};

export type TalkMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  source: "typed" | "voice" | "demo";
  relatedFindingId?: string;
  relatedDocumentIds?: string[];
  audioUrl?: string;
};

export type TalkLanguage = "en" | "hi";

export type TalkSession = {
  id: string;
  caseId: string;
  context: TalkContext;
  messages: TalkMessage[];
  language: TalkLanguage;
  startedAt: string;
  endedAt?: string;
};

export type CallState = "idle" | "ringing" | "connecting" | "active" | "listening" | "thinking" | "speaking" | "paused" | "ended" | "error";
export type AudioState = "idle" | "loading" | "playing" | "paused" | "ended" | "error";


