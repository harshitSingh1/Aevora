export interface AnalysisResult {
  isVerified: boolean
  confidenceScore: number
  findings: Array<{
    type: "clarification" | "anomaly" | "discrepancy" | "verified"
    title: string
    description: string
    amount?: number
  }>
}
