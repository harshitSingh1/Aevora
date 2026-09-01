export interface AudioResult {
  url?: string;
  buffer?: ArrayBuffer;
}

export interface VoiceService {
  synthesize(text: string, language?: string): Promise<AudioResult>;
}

export const browserSpeechService = {
  speak(text: string, language: string = "en-IN") {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        resolve();
        return;
      }
      
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        resolve();
      };
      
      utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        resolve(); // resolve anyway to not break the flow
      };
      
      window.speechSynthesis.speak(utterance);
    });
  },
  stop() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
};
