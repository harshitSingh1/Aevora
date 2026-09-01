import { useState, useCallback, useRef, useEffect } from "react";
import { TalkMessage, CallState, AudioState } from "@/types";
import { talkAIService } from "@/services/ai/aiService";
import { browserSpeechService } from "@/services/voice/voiceService";

export function useVoiceConversation(
  sessionParams: {
    context: any;
    messages: TalkMessage[];
    addMessage: (msg: any) => void;
    callState: CallState;
    setCallState: (s: CallState) => void;
    language: string;
  }
) {
  const { context, messages, addMessage, callState, setCallState, language } = sessionParams;
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fake speech recognition for demo
  const [isMicActive, setIsMicActive] = useState(false);

  // Timer logic
  useEffect(() => {
    if (callState === "active" || callState === "listening" || callState === "thinking" || callState === "speaking") {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setTimer(t => t + 1);
        }, 1000);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (callState === "idle" || callState === "ended") {
        setTimeout(() => setTimer(0), 0);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  const startCall = useCallback(() => {
    setCallState("ringing");
    // Play ringing sound (mocked with timeout)
    const ringAudio = new Audio("/sounds/careledger-ring.mp3");
    ringAudio.play().catch(() => console.log("Audio autoplay blocked")); // graceful fallback
    
    setTimeout(() => {
      setCallState("connecting");
      setTimeout(() => {
        setCallState("active");
        addMessage({
          role: "assistant",
          text: "Hi. What would you like to understand?",
          source: "voice"
        });
        browserSpeechService.speak("Hi. What would you like to understand?", language === "hi" ? "hi-IN" : "en-IN").then(() => {
          setCallState("listening");
        });
      }, 1000);
    }, 2000);
  }, [setCallState, addMessage, language]);

  const endCall = useCallback(() => {
    browserSpeechService.stop();
    setCallState("ended");
    setIsMicActive(false);
    setAudioState("ended");
  }, [setCallState]);

  const interrupt = useCallback(() => {
    if (callState === "speaking") {
      browserSpeechService.stop();
      setCallState("active");
    }
  }, [callState, setCallState]);

  const submitQuery = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    interrupt();
    
    addMessage({
      role: "user",
      text,
      source: "typed" // or voice
    });

    setCallState("thinking");

    try {
      const response = await talkAIService.generateAdvocacyResponse(context, messages);
      
      addMessage({
        role: "assistant",
        text: response.text,
        source: "voice",
        relatedDocumentIds: response.relatedDocumentIds
      });

      if (response.shouldSpeak) {
        setCallState("speaking");
        await browserSpeechService.speak(response.text, language === "hi" ? "hi-IN" : "en-IN");
        setCallState("active");
      } else {
        setCallState("active");
      }
    } catch (error) {
      console.error(error);
      addMessage({
        role: "system",
        text: "CareLedger couldn't generate a response right now.",
        source: "system"
      });
      setCallState("active");
    }
  }, [context, messages, addMessage, setCallState, interrupt, language]);

  // Demo mic toggle
  const toggleMic = useCallback(() => {
    if (callState === "speaking") {
      interrupt();
    }
    
    if (isMicActive) {
      setIsMicActive(false);
      setCallState("active");
    } else {
      setIsMicActive(true);
      setCallState("listening");
      // Simulate listening and picking up a query after a delay
      setTimeout(() => {
        setIsMicActive(false);
        // For the sake of the demo, we could auto-submit a query or just stop listening
      }, 3000);
    }
  }, [isMicActive, callState, interrupt, setCallState]);

  return {
    startCall,
    endCall,
    interrupt,
    submitQuery,
    timer,
    isMicActive,
    toggleMic,
    audioState
  };
}
