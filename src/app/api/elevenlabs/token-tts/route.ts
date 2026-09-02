import { NextResponse } from "next/server";
export async function POST() {
    if (process.env.DEMO_MODE === "true" || !process.env.ELEVENLABS_API_KEY) {
        return NextResponse.json({ token: "demo_tts_token" });
    }
    try {
        const res = await fetch("https://api.elevenlabs.io/v1/single-use-token/tts_websocket", {
            method: "POST",
            headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY }
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
    }
}
