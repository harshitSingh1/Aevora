const fs = require('fs');
let code = fs.readFileSync('src/hooks/useVoiceConversation.ts', 'utf8');

code = code.replace(/await browserSpeechService\.speak([^;]+);/g, `const success = await browserSpeechService.speak$1;
        if (!success) {
          setAudioState("error");
          // Optionally add a system message or flag to show voice unavailable
        }`);
fs.writeFileSync('src/hooks/useVoiceConversation.ts', code);
