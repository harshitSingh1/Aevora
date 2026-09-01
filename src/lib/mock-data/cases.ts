import { PatientCase } from "@/types"

export const mockCases: PatientCase[] = [
  {
    id: "demo-knee-001",
    patientName: "Ananya Sharma",
    age: 47,
    title: "Knee Replacement",
    status: "active",
    originalEstimate: 215000,
    insuranceApproved: 180000,
    currentBill: 307400,
    finalBill: 307400,
    financialDrift: 92400,
    financialDriftPercent: 43,
    createdAt: "2026-08-18T10:00:00Z",
    updatedAt: "2026-08-22T10:00:00Z",
  }
];

export const mockPatientCase = mockCases[0];
