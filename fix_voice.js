const fs = require('fs');
let code = fs.readFileSync('src/services/voice/voiceService.ts', 'utf8');

code = code.replace(/async speak[\s\S]*?stop\(\) \{/, `async speak(text: string, language: string = "en-IN"): Promise<boolean> {
    this.stop();
    try {
      // Clean up text slightly for browser fallback if API fails
      const speechText = text
        .replace(/[#*→✓☐\\-_]/g, "")
        .replace(/₹(\\d+),?(\\d+)/g, "$1$2 rupees")
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
        return true;
      } else {
        console.error("ElevenLabs API failed:", await res.text());
        return false;
      }
    } catch (error) {
      console.error("Failed to use ElevenLabs", error);
      return false;
    }
  }

  stop() {`);

fs.writeFileSync('src/services/voice/voiceService.ts', code);
