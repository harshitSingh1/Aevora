import { useState, useCallback, useRef, useEffect } from "react";
import { TalkContext, TalkMessage, TalkLanguage, CallState, AudioState } from "@/types";
import { talkAIService } from "@/services/ai/aiService";
import { browserSpeechService } from "@/services/voice/voiceService";

export function useTalkSession(initialContext: TalkContext) {
  const [context, setContext] = useState<TalkContext>(initialContext);
  const [messages, setMessages] = useState<TalkMessage[]>([]);
  const [language, setLanguage] = useState<TalkLanguage>("en");
  const [callState, setCallState] = useState<CallState>("idle");
  
  const addMessage = useCallback((msg: Omit<TalkMessage, "id" | "timestamp">) => {
    const newMessage: TalkMessage = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const clearSession = useCallback(() => {
    setMessages([]);
    setCallState("idle");
  }, []);

  return {
    context,
    setContext,
    messages,
    addMessage,
    language,
    setLanguage,
    callState,
    setCallState,
    clearSession
  };
}
