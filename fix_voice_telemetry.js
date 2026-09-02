const fs = require('fs');
let code = fs.readFileSync('src/services/voice/voiceService.ts', 'utf8');

if (!code.includes('export interface VoiceTelemetry')) {
  const telemetryType = `
export interface VoiceTelemetry {
  provider: string;
  model: string;
  voice: string;
  status: string;
  latency: number;
}
`;
  code = code.replace('export interface VoiceService', telemetryType + 'export interface VoiceService');
  
  code = code.replace(/Promise<boolean>/, 'Promise<{ success: boolean; telemetry?: VoiceTelemetry }>');
  code = code.replace(/return true;/g, 'return { success: true, telemetry: { provider: "ElevenLabs", model: "eleven_multilingual_v2", voice: "EXAVITQu4vr4xnSDxMaL", status: "Success", latency: Date.now() - startTime } };');
  code = code.replace(/return false;/g, 'return { success: false, telemetry: { provider: "ElevenLabs (Error)", model: "eleven_multilingual_v2", voice: "EXAVITQu4vr4xnSDxMaL", status: "Failed", latency: Date.now() - startTime } };');
  
  code = code.replace('const res = await fetch', 'const startTime = Date.now();\n      const res = await fetch');
  
  // also handle the catch block fallback where startTime is not defined
  code = code.replace('console.error("Failed to use ElevenLabs", error);\n      return { success: false', 'console.error("Failed to use ElevenLabs", error);\n      return { success: false, telemetry: { provider: "ElevenLabs (Error)", model: "unknown", voice: "unknown", status: "Failed", latency: 0 }');

  fs.writeFileSync('src/services/voice/voiceService.ts', code);
}
