const fs = require('fs');

let chatCode = fs.readFileSync('src/app/api/chat/route.ts', 'utf8');
chatCode = chatCode.replace('console.error("Featherless error:", await response.text());', 'console.info("Featherless bypassed/failed (expected if no key):", await response.text());');
chatCode = chatCode.replace('console.error("Chat API Error:", error);', 'console.warn("Chat API warning:", error);');
fs.writeFileSync('src/app/api/chat/route.ts', chatCode);

let voiceCode = fs.readFileSync('src/app/api/voice/route.ts', 'utf8');
voiceCode = voiceCode.replace('console.error("ElevenLabs error:", errorText);', 'console.info("ElevenLabs bypassed/failed (expected if no key):", errorText);');
voiceCode = voiceCode.replace('console.error("Voice API Error:", error);', 'console.warn("Voice API warning:", error);');
fs.writeFileSync('src/app/api/voice/route.ts', voiceCode);

