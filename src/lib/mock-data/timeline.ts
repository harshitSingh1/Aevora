import { CareTimelineEvent } from "@/types";

export const mockTimelineEvents: Record<string, CareTimelineEvent[]> = {
  "demo-knee-001": [
    {
      id: "event-01",
      date: "2026-08-18",
      type: "admission",
      title: "Admission",
      description: "Patient admitted for planned knee replacement.",
      status: "completed",
    },
    {
      id: "event-02",
      date: "2026-08-18",
      type: "diagnostic",
      title: "Pre-operative evaluation",
      description: "Blood tests, imaging and anesthesia evaluation recorded.",
      status: "completed",
    },
    {
      id: "event-03",
      date: "2026-08-19",
      type: "procedure",
      title: "Surgery",
      description: "Total knee replacement performed.",
      status: "completed",
    },
    {
      id: "event-04",
      date: "2026-08-20",
      type: "treatment",
      title: "Post-operative care",
      description: "Routine monitoring and physiotherapy.",
      status: "completed",
    },
    {
      id: "event-05",
      date: "2026-08-21",
      type: "diagnostic",
      title: "Additional diagnostic imaging",
      description: "Additional imaging appears in the case.",
      status: "discrepancy",
      financialImpact: 17500,
      relatedFindingIds: ["diagnostic-001"]
    },
    {
      id: "event-06",
      date: "2026-08-22",
      type: "discharge",
      title: "Discharge",
      description: "Patient discharged.",
      status: "completed",
    },
    {
      id: "event-07",
      date: "2026-08-22",
      type: "final_bill",
      title: "Final bill generated",
      description: "Final bill: ₹3,07,400",
      status: "completed",
      financialImpact: 307400
    }
  ]
};
import { FinancialEvent } from "@/types";

export const mockFinancialEvents: FinancialEvent[] = [
  { day: "Aug 18", amount: 215000, event: "Original Estimate" },
  { day: "Aug 21", amount: 232500, event: "Diagnostics Added" },
  { day: "Aug 22", amount: 260500, event: "Procedure Added" },
  { day: "Final", amount: 307400, event: "Final Bill" }
];
