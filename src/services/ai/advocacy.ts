import { generateMockQuestion, generateMockScript } from "@/lib/mock-data/advocacy"

export const prepareAdvocacyQuestion = async (
  findingType: string,
  target: "doctor" | "billing" | "insurance" | "facility" | "scheme",
  amount?: number
): Promise<{ question: string, why: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))

  return {
    question: generateMockQuestion(findingType, target, amount),
    why: "The charge appears on the final bill but not the original estimate."
  }
}

export const prepareAdvocacyScript = async (
  target: "doctor" | "billing" | "insurance" | "facility" | "scheme",
  question: string
): Promise<string[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))

  return generateMockScript(target, question)
}
