import { TalkContext, TalkMessage } from "@/types";
import { getMockTalkResponse } from "./mockTalkService";

export interface AIService {
  generateAdvocacyResponse(context: TalkContext, messages: TalkMessage[]): Promise<{
    text: string;
    speechText?: string;
    shouldSpeak: boolean;
    relatedFindingId?: string;
    relatedDocumentIds?: string[];
    telemetry?: {
      provider: string;
      model: string;
      latency: number;
      status: string;
      mode: string;
    };
  }>;
}

export const talkAIService: AIService = {
  async generateAdvocacyResponse(context, messages) {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const mockRes = await getMockTalkResponse(context, messages);
      return {
        ...mockRes,
        telemetry: {
          provider: "Demo Fallback",
          model: "mock-deterministic",
          latency: 1000,
          status: "Success",
          mode: "Demo"
        }
      };
    }
    
    try {
      const startTime = Date.now();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, messages })
      });
      
      if (res.ok) {
        const data = await res.json();
        return {
          ...data,
          telemetry: {
            provider: "Featherless",
            model: "Qwen/Qwen2.5-7B-Instruct",
            latency: Date.now() - startTime,
            status: "Success",
            mode: "API"
          }
        };
      }
    } catch (e) {
      console.info("Chat API fetch bypassed/failed (expected if no key), falling back to mock");
    }
    
    // Fallback to mock if API fails
    const mockRes2 = await getMockTalkResponse(context, messages);
    return {
      ...mockRes2,
      telemetry: {
        provider: "Demo Fallback (Error)",
        model: "mock-deterministic",
        latency: 1000,
        status: "Failed",
        mode: "Demo"
      }
    };
  }
};
