const fs = require('fs');
let code = fs.readFileSync('src/hooks/useVoiceConversation.ts', 'utf8');

code = code.replace(
  'const response = await talkAIService.generateAdvocacyResponse(context, messages);',
  'const currentMessages = [...messages, { id: Date.now().toString(), role: "user" as const, text, timestamp: new Date().toISOString(), source: "typed" as const }];\n      const response = await talkAIService.generateAdvocacyResponse(context, currentMessages);'
);

fs.writeFileSync('src/hooks/useVoiceConversation.ts', code);
