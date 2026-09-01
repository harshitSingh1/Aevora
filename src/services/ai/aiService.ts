import { TalkContext, TalkMessage } from "@/types";
import { getMockTalkResponse } from "./mockTalkService";

export interface AIService {
  generateAdvocacyResponse(context: TalkContext, messages: TalkMessage[]): Promise<{
    text: string;
    shouldSpeak: boolean;
    relatedFindingId?: string;
    relatedDocumentIds?: string[];
  }>;
}

export const talkAIService: AIService = {
  async generateAdvocacyResponse(context, messages) {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.DEMO_MODE === "true" || true) {
      // For now, always use mock
      return getMockTalkResponse(context, messages);
    }
    // Future Featherless Implementation...
    return getMockTalkResponse(context, messages);
  }
};
