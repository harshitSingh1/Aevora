const fs = require('fs');

let chatCode = fs.readFileSync('src/app/api/chat/route.ts', 'utf8');
chatCode = chatCode.replace(
  'if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.DEMO_MODE === "true" || !process.env.FEATHERLESS_API_KEY) {',
  'if (!process.env.FEATHERLESS_API_KEY) {'
);
chatCode = chatCode.replace(
  '"meta-llama/Meta-Llama-3-8B-Instruct"',
  '"Qwen/Qwen2.5-7B-Instruct"'
);
fs.writeFileSync('src/app/api/chat/route.ts', chatCode);

let voiceCode = fs.readFileSync('src/app/api/voice/route.ts', 'utf8');
voiceCode = voiceCode.replace(
  'if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.DEMO_MODE === "true" || !process.env.ELEVENLABS_API_KEY) {',
  'if (!process.env.ELEVENLABS_API_KEY) {'
);
fs.writeFileSync('src/app/api/voice/route.ts', voiceCode);

let aiService = fs.readFileSync('src/services/ai/aiService.ts', 'utf8');
aiService = aiService.replace(
  'if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.DEMO_MODE === "true") {',
  'if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {'
);
// Make sure to replace model name in telemetry too
aiService = aiService.replace(
  '"meta-llama/Meta-Llama-3-8B-Instruct"',
  '"Qwen/Qwen2.5-7B-Instruct"'
);
fs.writeFileSync('src/services/ai/aiService.ts', aiService);
