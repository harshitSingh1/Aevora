const fs = require('fs');
let code = fs.readFileSync('src/hooks/useVoiceConversation.ts', 'utf8');

code = code.replace(
  'const success = await browserSpeechService.speak(response.speechText || response.text, language === "hi" ? "hi-IN" : "en-IN");',
  'const { success, telemetry } = await browserSpeechService.speak(response.speechText || response.text, language === "hi" ? "hi-IN" : "en-IN");'
);

// We should also store the telemetry states in useVoiceConversation
if (!code.includes('const [aiTelemetry, setAiTelemetry]')) {
  code = code.replace(
    'const [audioState, setAudioState] = useState<AudioState>("idle");',
    `const [audioState, setAudioState] = useState<AudioState>("idle");
  const [aiTelemetry, setAiTelemetry] = useState<any>(null);
  const [voiceTelemetry, setVoiceTelemetry] = useState<any>(null);`
  );
  
  code = code.replace(
    'if (response.shouldSpeak) {',
    `setAiTelemetry(response.telemetry || null);
      if (response.shouldSpeak) {`
  );
  
  code = code.replace(
    'if (!success) {',
    `setVoiceTelemetry(telemetry || null);
        if (!success) {`
  );
  
  code = code.replace(
    'audioState\n  };',
    `audioState,
    aiTelemetry,
    voiceTelemetry
  };`
  );
  
  fs.writeFileSync('src/hooks/useVoiceConversation.ts', code);
}
