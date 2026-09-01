import { TalkContext, TalkMessage } from "@/types";

export const getMockTalkResponse = async (context: TalkContext, messages: TalkMessage[]) => {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 1500));

  const lastMessage = messages[messages.length - 1];
  const lowerText = lastMessage?.text.toLowerCase() || "";
  
  if (lowerText.includes("why was this charge added") || lowerText.includes("why was this procedure added") || lowerText.includes("added")) {
    return {
      text: "It appears on the final bill but not the original estimate. The documents confirm the charge, but they don't show whether the additional cost was discussed beforehand.",
      shouldSpeak: true,
      relatedDocumentIds: ["doc-1", "doc-3"]
    };
  }

  if (lowerText.includes("what should i ask billing") || lowerText.includes("ask") || lowerText.includes("what should i say")) {
    return {
      text: "Ask billing for an itemized explanation and whether the procedure was included in your insurance authorization.",
      shouldSpeak: true
    };
  }
  
  if (lowerText.includes("what if they don't explain it") || lowerText.includes("unresolved") || lowerText.includes("what next")) {
    return {
      text: "Ask for the explanation and itemized charge in writing. If it remains unresolved, you can follow up through the appropriate hospital support or grievance channel.",
      shouldSpeak: true
    };
  }

  if (lowerText.includes("why might i still have to pay") || lowerText.includes("still owe") || lowerText.includes("insurance pay")) {
    return {
      text: "Your final bill is ₹3,07,400 while the demo approval is ₹1,80,000. The remaining amount isn't necessarily all payable by you; deductibles, exclusions, and co-payments can affect the final responsibility.",
      shouldSpeak: true,
      relatedDocumentIds: ["doc-4"]
    };
  }

  if (lowerText.includes("compare before choosing") || lowerText.includes("another facility") || lowerText.includes("compare")) {
    return {
      text: "Compare cost, coverage, eligibility, availability, waiting time, and distance. Clinical suitability should still be discussed with your healthcare professional.",
      shouldSpeak: true
    };
  }
  
  if (lowerText.includes("sue") || lowerText.includes("legal")) {
    return {
      text: "That depends on the facts and local law. I can help organize the documents and questions, but a qualified legal professional should advise you on your options.",
      shouldSpeak: true
    };
  }

  if (lowerText.includes("medical") || lowerText.includes("stop treatment")) {
    return {
      text: "That's a medical decision. Your doctor is the right person to discuss whether the procedure is appropriate. I can help you prepare questions about the cost, alternatives, and insurance coverage.",
      shouldSpeak: true
    };
  }

  if (lowerText.includes("fraud") || lowerText.includes("illegal")) {
    return {
      text: "We can't tell from the available documents. The charge is different from the estimate, but that alone doesn't show it was incorrect.",
      shouldSpeak: true
    };
  }

  // Generic fallback
  return {
    text: "I understand you have a question. Based on the case context, I'd suggest asking for an itemized breakdown and written explanation.",
    shouldSpeak: true
  };
};
