import { TalkContext, TalkMessage } from "@/types";

export const getMockTalkResponse = async (context: TalkContext, messages: TalkMessage[]) => {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 1000));
  
  const lastMessage = messages[messages.length - 1];
  const lowerText = lastMessage?.text.toLowerCase().trim() || "";
  
  // Create a structured response helper
  const createResponse = (text: string, speechText?: string, relatedDocumentIds?: string[]) => {
    return {
      text,
      speechText: speechText || text.replace(/₹(\d+),?(\d+)/g, "$1$2 rupees").replace(/₹/g, "rupees"),
      shouldSpeak: true,
      relatedDocumentIds
    };
  };

  // 1. CAPABILITY & NAVIGATION INTENTS (Strict matches to avoid leakage)
  if (lowerText === "hi" || lowerText === "hii" || lowerText === "hello") {
    return createResponse("Hi. What would you like to understand?");
  }
  
  if (lowerText.includes("where is advocacy plan") || lowerText.includes("where is the advocacy plan")) {
    return createResponse(
      "The Advocacy Plan is in the Advocacy Center. You can open it from the sidebar.",
      "The Advocacy Plan is in the Advocacy Center. You can open it from the sidebar."
    );
  }

  if (lowerText.includes("can you access my current billing information") || 
      lowerText.includes("can you see my hospital records") || 
      lowerText.includes("what can you actually access")) {
    return createResponse(
      "I can use the billing information available in this case. I can't directly access your hospital's live billing system.",
      "I can use the billing information available in this case. I can't directly access your hospital's live billing system."
    );
  }

  // 2. SPECIFIC CONTEXT/FINDING INTENTS
  if (lowerText.includes("why was this charge added") || lowerText.includes("why was the ₹28,000 charge added") || lowerText.includes("why was this procedure added")) {
    return createResponse(
      "It appears on the final bill but not the original estimate. The available documents don't explain why it was added.",
      "It appears on the final bill, but not the original estimate. The available documents don't explain why it was added.",
      ["doc-1", "doc-3"]
    );
  }

  if (lowerText.includes("what should i ask them") || lowerText.includes("what should i ask billing") || lowerText.includes("what should i say")) {
    return createResponse(
      "Ask what the ₹28,000 charge covers, when it was added, and whether it was included in your authorization.",
      "Ask what the twenty-eight-thousand-rupee charge covers, when it was added, and whether it was included in your authorization."
    );
  }
  
  if (lowerText.includes("what if they don't explain it") || lowerText.includes("what if they don't") || lowerText.includes("what next")) {
    return createResponse(
      "Record their response and keep the bill and estimate together. That gives you a clear record for the next step."
    );
  }

  if (lowerText.includes("was it covered") || lowerText.includes("covered by insurance") || lowerText.includes("what about insurance")) {
    return createResponse(
      "The case shows an approved amount of ₹1,80,000, but the available documents don't show that this specific charge was approved.",
      "The case shows an approved amount of one-hundred-eighty-thousand rupees, but the available documents don't show that this specific charge was approved.",
      ["doc-4"]
    );
  }

  if (lowerText.includes("what evidence do you have") || lowerText.includes("show me the evidence")) {
    return createResponse(
      "The finding is supported by the final bill and the original estimate. I can show you the documents side by side.",
      "The finding is supported by the final bill and the original estimate. I can show you the documents side by side.",
      ["doc-1", "doc-3"]
    );
  }
  
  if (lowerText.includes("what should i ask my doctor") || lowerText.includes("doctor")) {
    return createResponse(
      "Could you explain why this procedure was necessary and whether there were lower-cost alternatives?"
    );
  }

  if (lowerText.includes("what should i do next") || lowerText.includes("next step")) {
    return createResponse(
      "I'd start with billing. Ask them to explain the charges that weren't in the original estimate, and record their response."
    );
  }

  if (lowerText.includes("explain the bill") || lowerText.includes("explain my bill")) {
    return createResponse(
      "Your final bill is ₹3.07 lakh, compared with the original estimate of ₹2.15 lakh. The biggest difference is a ₹28,000 procedure that wasn't in the estimate.",
      "Your final bill is three-point-zero-seven lakh, compared with the original estimate of two-point-one-five lakh. The biggest difference is a twenty-eight-thousand rupee procedure that wasn't in the estimate."
    );
  }
  
  if (lowerText.includes("why is my bill so high") || lowerText.includes("overcharged")) {
    return createResponse(
      "I found three differences worth reviewing. The largest is a ₹28,000 procedure that doesn't appear in the original estimate.",
      "I found three differences worth reviewing. The largest is a twenty-eight-thousand rupee procedure that doesn't appear in the original estimate."
    );
  }

  if (lowerText.includes("sue") || lowerText.includes("legal") || lowerText.includes("lawyer")) {
    return createResponse(
      "I can't give you legal advice. First, gather the itemized bill, supporting documents, and the hospital's explanation. That gives you a clearer record if you need professional advice later."
    );
  }

  if (lowerText.includes("medical") || lowerText.includes("stop treatment") || lowerText.includes("medicine")) {
    return createResponse(
      "Don't stop a prescribed medicine based on my response. Please confirm any medication change with your doctor or pharmacist."
    );
  }

  if (lowerText.includes("fraud") || lowerText.includes("scammed") || lowerText.includes("scam")) {
    return createResponse(
      "I can't determine that from these documents. I can show you the charges that differ from the estimate and help you prepare questions to verify them."
    );
  }

  if (lowerText.includes("confused")) {
    return createResponse(
      "That's okay. The simplest thing to know is that your final bill is ₹92,400 higher than the original estimate. I can walk you through where that difference comes from.",
      "That's okay. The simplest thing to know is that your final bill is ninety-two-thousand-four-hundred rupees higher than the original estimate. I can walk you through where that difference comes from."
    );
  }
  
  if (lowerText === "okay" || lowerText === "ok") {
    return createResponse("Is there anything else you'd like to check?");
  }

  if (lowerText === "why?" || lowerText === "tell me more") {
    return createResponse(
      "The documents don't provide the underlying reason, so we have to ask the hospital or insurer for clarification."
    );
  }

  // Generic fallback
  return createResponse(
    "Yes. I can help you understand the bill, check supporting evidence, and decide what to ask next."
  );
};
