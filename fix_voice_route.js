const fs = require('fs');
let code = fs.readFileSync('src/app/api/voice/route.ts', 'utf8');

if (!code.includes('[Aevora TTS]')) {
  // We need to record start time and end time.
  code = code.replace(
    'const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL`',
    'const startTime = Date.now();\n    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL`'
  );
  
  code = code.replace(
    'return new NextResponse(buffer, {',
    `const latency = Date.now() - startTime;
    if (process.env.NODE_ENV !== "production") {
      console.log(\`[Aevora TTS] provider=ElevenLabs model=eleven_multilingual_v2 voice=EXAVITQu4vr4xnSDxMaL status=Success latency=\${latency}ms\`);
      console.log(\`[Aevora Speech] "\${speechText}"\`);
    }
    return new NextResponse(buffer, {`
  );
  
  code = code.replace(
    'return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });',
    `const latency = Date.now() - startTime;
      if (process.env.NODE_ENV !== "production") {
        console.log(\`[Aevora TTS ERROR] provider=ElevenLabs status=Failed latency=\${latency}ms\`);
      }
      return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });`
  );
  
  fs.writeFileSync('src/app/api/voice/route.ts', code);
}
