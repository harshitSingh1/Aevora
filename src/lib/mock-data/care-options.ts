import { CareOption } from "@/types";

export const mockCareOptions: Record<string, CareOption[]> = {
  "demo-knee-001": [
    {
      id: "option-1",
      name: "Sanjeevani Multispeciality Hospital",
      type: "private",
      estimatedCost: {
        min: 307400,
        max: 307400,
        label: "Final Bill"
      },
      insuranceStatus: "possible",
      eligibility: "likely",
      availability: "high",
      waitingTime: "Admitted",
      distance: "Current",
      evidenceLevel: "high",
      notes: "Current private facility. High financial drift identified."
    },
    {
      id: "option-2",
      name: "Demo Government Orthopedic Centre",
      type: "government",
      estimatedCost: {
        min: 80000,
        max: 140000,
        label: "Illustrative demo data"
      },
      insuranceStatus: "covered",
      eligibility: "verify",
      availability: "low",
      waitingTime: "6-8 weeks typical",
      distance: "12 km",
      requirements: ["BPL Card or specific scheme eligibility", "Referral from primary care"],
      evidenceLevel: "low",
      notes: "A lower-cost pathway may exist, but eligibility, clinical suitability, availability, waiting time, and referral requirements should be verified."
    }
  ]
};
