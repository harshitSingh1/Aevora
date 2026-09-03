const fs = require('fs');

const sttPath = 'src/app/api/elevenlabs/token-stt/route.ts';
const sttCode = `import { NextResponse } from "next/server";

export async function POST() {
    if (process.env.DEMO_MODE === "true") {
        return NextResponse.json({ token: "demo_stt_token" });
    }
    if (!process.env.ELEVENLABS_API_KEY) {
        return NextResponse.json({ error: "missing_key" }, { status: 401 });
    }
    try {
        const res = await fetch("https://api.elevenlabs.io/v1/single-use-token/realtime_scribe", {
            method: "POST",
            headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY }
        });
        const data = await res.json();
        if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
    }
}
`;

const ttsPath = 'src/app/api/elevenlabs/token-tts/route.ts';
const ttsCode = `import { NextResponse } from "next/server";

export async function POST() {
    if (process.env.DEMO_MODE === "true") {
        return NextResponse.json({ token: "demo_tts_token" });
    }
    if (!process.env.ELEVENLABS_API_KEY) {
        return NextResponse.json({ error: "missing_key" }, { status: 401 });
    }
    try {
        const res = await fetch("https://api.elevenlabs.io/v1/single-use-token/tts_websocket", {
            method: "POST",
            headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY }
        });
        const data = await res.json();
        if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
    }
}
`;

fs.mkdirSync('src/app/api/elevenlabs/token-stt', { recursive: true });
fs.writeFileSync(sttPath, sttCode);

fs.mkdirSync('src/app/api/elevenlabs/token-tts', { recursive: true });
fs.writeFileSync(ttsPath, ttsCode);

