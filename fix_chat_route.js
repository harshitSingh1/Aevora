const fs = require('fs');
let code = fs.readFileSync('src/app/api/chat/route.ts', 'utf8');

if (!code.includes('[Aevora AI]')) {
  // We need to record start time and end time.
  code = code.replace(
    'const response = await fetch("https://api.featherless.ai/v1/chat/completions"',
    'const startTime = Date.now();\n    const response = await fetch("https://api.featherless.ai/v1/chat/completions"'
  );
  
  code = code.replace(
    'return NextResponse.json({',
    `const latency = Date.now() - startTime;
    if (process.env.NODE_ENV !== "production") {
      console.log(\`[Aevora AI] provider=Featherless model=meta-llama/Meta-Llama-3-8B-Instruct status=Success latency=\${latency}ms\`);
    }
    return NextResponse.json({`
  );
  
  code = code.replace(
    'return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });',
    `const latency = Date.now() - startTime;
      if (process.env.NODE_ENV !== "production") {
        console.log(\`[Aevora AI ERROR] provider=Featherless status=Failed latency=\${latency}ms\`);
      }
      return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });`
  );
  
  fs.writeFileSync('src/app/api/chat/route.ts', code);
}
