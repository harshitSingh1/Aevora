const fs = require('fs');
let code = fs.readFileSync('src/services/ai/aiService.ts', 'utf8');

if (!code.includes('speechText?: string;')) {
  code = code.replace(
    'text: string;\n    shouldSpeak: boolean;',
    'text: string;\n    speechText?: string;\n    shouldSpeak: boolean;'
  );
  fs.writeFileSync('src/services/ai/aiService.ts', code);
}
