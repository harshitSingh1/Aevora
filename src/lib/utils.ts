import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateFinancialDrift(originalEstimate: number, finalBill: number): number {
  return finalBill - originalEstimate;
}

export function calculateDriftPercentage(originalEstimate: number, finalBill: number): number {
  if (originalEstimate === 0) return 0;
  return Math.round(((finalBill - originalEstimate) / originalEstimate) * 100);
}

export function calculatePatientResponsibility(finalBill: number, insuranceApproved: number): number {
  return Math.max(0, finalBill - insuranceApproved);
}

export function calculateChargeDelta(estimatedAmount: number = 0, billedAmount: number): number {
  return billedAmount - estimatedAmount;
}

export function calculateCategoryTotals(charges: { category: string, billedAmount: number }[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const charge of charges) {
    if (!totals[charge.category]) totals[charge.category] = 0;
    totals[charge.category] += charge.billedAmount;
  }
  return totals;
}

export function calculateEvidenceCoverage(charges: { documentReferences?: unknown[] }[]): { covered: number, total: number, percentage: number } {
  if (!charges || charges.length === 0) return { covered: 0, total: 0, percentage: 0 };
  const total = charges.length;
  const covered = charges.filter(c => c.documentReferences && c.documentReferences.length > 0).length;
  const percentage = Math.round((covered / total) * 100);
  return { covered, total, percentage };
}
