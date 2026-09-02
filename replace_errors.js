const fs = require('fs');

let voiceCode = fs.readFileSync('src/services/voice/voiceService.ts', 'utf8');
voiceCode = voiceCode.replace('console.error("ElevenLabs API failed:", await res.text());', 'console.info("ElevenLabs API bypassed/failed (expected if no key):", await res.text());');
voiceCode = voiceCode.replace('console.error("Failed to use ElevenLabs", error);', 'console.warn("Failed to use ElevenLabs", error);');
fs.writeFileSync('src/services/voice/voiceService.ts', voiceCode);

let aiCode = fs.readFileSync('src/services/ai/aiService.ts', 'utf8');
aiCode = aiCode.replace('console.error("Chat API fetch error, falling back to mock", e);', 'console.info("Chat API fetch bypassed/failed (expected if no key), falling back to mock");');
fs.writeFileSync('src/services/ai/aiService.ts', aiCode);

let hookCode = fs.readFileSync('src/hooks/useVoiceConversation.ts', 'utf8');
hookCode = hookCode.replace('console.error(error);', 'console.warn("Conversation API warning:", error);');
fs.writeFileSync('src/hooks/useVoiceConversation.ts', hookCode);

