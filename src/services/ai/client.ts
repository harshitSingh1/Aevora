import { analyzeDocument as mockAnalyzeDocument } from "./mock-ai"

export async function analyzeDocument(file: File) {
  // In the future, we will check if FEATHERLESS_API_KEY is available and use the real API
  return mockAnalyzeDocument(file)
}
