const fs = require('fs');
let code = fs.readFileSync('src/services/ai/aiService.ts', 'utf8');

if (!code.includes('telemetry?:')) {
  code = code.replace(
    'relatedDocumentIds?: string[];',
    `relatedDocumentIds?: string[];
    telemetry?: {
      provider: string;
      model: string;
      latency: number;
      status: string;
      mode: string;
    };`
  );
  
  // Make aiService return telemetry mock
  code = code.replace(
    'return getMockTalkResponse(context, messages);',
    `const mockRes = await getMockTalkResponse(context, messages);
      return {
        ...mockRes,
        telemetry: {
          provider: "Demo Fallback",
          model: "mock-deterministic",
          latency: 1000,
          status: "Success",
          mode: "Demo"
        }
      };`
  );

  // Make API fetch also track latency
  code = code.replace(
    'const res = await fetch("/api/chat"',
    'const startTime = Date.now();\n      const res = await fetch("/api/chat"'
  );

  code = code.replace(
    'return data;',
    `return {
          ...data,
          telemetry: {
            provider: "Featherless",
            model: "meta-llama/Meta-Llama-3-8B-Instruct",
            latency: Date.now() - startTime,
            status: "Success",
            mode: "API"
          }
        };`
  );
  
  // Fallback if API fails
  code = code.replace(
    'return getMockTalkResponse(context, messages);',
    `const mockRes2 = await getMockTalkResponse(context, messages);
    return {
      ...mockRes2,
      telemetry: {
        provider: "Demo Fallback (Error)",
        model: "mock-deterministic",
        latency: 1000,
        status: "Failed",
        mode: "Demo"
      }
    };`
  );

  fs.writeFileSync('src/services/ai/aiService.ts', code);
}
