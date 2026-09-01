import { Document } from "@/types";

export const mockDocuments: Document[] = [
  { id: "doc-1", name: "Hospital_Estimate_Aug.pdf", type: "Estimate", status: "analyzed", date: "Aug 14, 2026" },
  { id: "doc-2", name: "Discharge_Summary.pdf", type: "Summary", status: "analyzed", date: "Aug 22, 2026" },
  { id: "doc-3", name: "Final_Bill.pdf", type: "Bill", status: "analyzed", date: "Aug 22, 2026" },
  { id: "doc-4", name: "Insurance_Approval.pdf", type: "Authorization", status: "analyzed", date: "Aug 14, 2026" },
  { id: "doc-5", name: "Diagnostic_Report.pdf", type: "Report", status: "analyzed", date: "Aug 21, 2026" }
];
