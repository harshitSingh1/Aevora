const fs = require('fs');

let content = fs.readFileSync('src/app/api/chat/route.ts', 'utf8');

// 1. Rewrite prompt JSON part
const promptRegex = /Output your response as JSON matching this schema:[\s\S]*?\}/;
content = content.replace(promptRegex, `Respond directly in plain text. Your exact response will be spoken to the user. Do not use asterisks, bolding, or markdown. Use spoken numbers (e.g. "twenty-eight thousand") instead of symbols.`);

// 2. Change model name
content = content.replace(/"meta-llama\/Meta-Llama-3-8B-Instruct", \/\/ or similar fast conversational model/g, '"meta-llama/Meta-Llama-3.1-8B-Instruct",');

// 3. Update logging model name
content = content.replace(/model=meta-llama\/Meta-Llama-3-8B-Instruct/g, 'model=meta-llama/Meta-Llama-3.1-8B-Instruct');

// 4. Add AbortController and handle JSON parsing gracefully since it's now plain text
content = content.replace(/const response = await fetch\("https:\/\/api\.featherless\.ai\/v1\/chat\/completions", \{/, 
`const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch("https://api.featherless.ai/v1/chat/completions", {
      signal: controller.signal,`);

content = content.replace(/if \(\!response\.ok\)/, `clearTimeout(timeoutId);

    if (!response.ok)`);

content = content.replace(/try \{\s*let rawContent = data\.choices\?\.\[0\]\?\.message\?\.content \|\| "\{\}";[\s\S]*?\} catch \(e\) \{[\s\S]*?\}/, 
`text = data.choices?.[0]?.message?.content || text;
    speechText = text.replace(/[#*→✓☐\\-_]/g, "");`);

content = content.replace(/catch \(error\) \{/, `catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ 
        text: "I'm sorry, I am taking too long to think. Please try asking again.",
        speechText: "I'm sorry, I am taking too long to think. Please try asking again.",
        shouldSpeak: true 
      }, { status: 200 });
    }`);


fs.writeFileSync('src/app/api/chat/route.ts', content);
