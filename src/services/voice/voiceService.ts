export interface AudioResult {
  url?: string;
  buffer?: ArrayBuffer;
}

export interface VoiceTelemetry {
  provider: string;
  model: string;
  voice: string;
  status: string;
  latency: number;
}

export interface VoiceService {
  synthesize(text: string, language?: string): Promise<AudioResult>;
}

class AevoraVoiceService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;

  async speak(text: string, language: string = "en-IN"): Promise<{ success: boolean; telemetry?: VoiceTelemetry }> {
    this.stop();
    const startTime = Date.now();
    try {
      // Clean up text slightly for browser fallback if API fails
      const speechText = text
        .replace(/[#*→✓☐\-_]/g, "")
        .replace(/₹(\d+),?(\d+)/g, "$1$2 rupees")
        .replace(/₹/g, "rupees");

      const res = await fetch("/api/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: speechText, language })
      });

      if (res.ok) {
        const blob = await res.blob();
        this.currentObjectUrl = URL.createObjectURL(blob);
        this.currentAudio = new Audio(this.currentObjectUrl);
        
        await new Promise<void>((resolve, reject) => {
          if (!this.currentAudio) {
            resolve();
            return;
          }
          this.currentAudio.onended = () => resolve();
          this.currentAudio.onerror = (e) => {
            console.error("Audio playback error", e);
            resolve();
          };
          this.currentAudio.play().catch((e) => {
            console.warn("Audio autoplay blocked", e);
            resolve();
          });
        });
        
        this.cleanup();
        return { success: true, telemetry: { provider: "ElevenLabs", model: "eleven_multilingual_v2", voice: "EXAVITQu4vr4xnSDxMaL", status: "Success", latency: Date.now() - startTime } };
      } else {
        console.info("ElevenLabs API bypassed/failed (expected if no key):", await res.text());
        return { success: false, telemetry: { provider: "ElevenLabs (Error)", model: "eleven_multilingual_v2", voice: "EXAVITQu4vr4xnSDxMaL", status: "Failed", latency: Date.now() - startTime } };
      }
    } catch (error) {
      console.warn("Failed to use ElevenLabs", error);
      return { success: false, telemetry: { provider: "ElevenLabs (Error)", model: "unknown", voice: "unknown", status: "Failed", latency: Date.now() - startTime } };
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    this.cleanup();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  private cleanup() {
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
    this.currentAudio = null;
  }
}

export const browserSpeechService = new AevoraVoiceService();
