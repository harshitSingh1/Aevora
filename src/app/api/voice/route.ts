import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { text, language } = await req.json();

    if (!process.env.ELEVENLABS_API_KEY) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[Aevora TTS ERROR] provider=ElevenLabs status=Bypassed (Demo mode or missing key) latency=${Date.now() - startTime}ms`);
      }
      return NextResponse.json({ error: "Voice synthesis not available in demo mode or without API key." }, { status: 400 });
    }

    // Prepare text for speech
    let speechText = text
      .replace(/[#*→✓☐\-_]/g, "") // Remove markdown and symbols
      .replace(/₹(\d+),?(\d+)/g, "$1$2 rupees")
      .replace(/₹/g, "rupees");

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: speechText,
        model_id: 'eleven_multilingual_v2', // Good conversational model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.info("ElevenLabs bypassed/failed (expected if no key):", errorText);
      if (process.env.NODE_ENV !== "production") {
        console.log(`[Aevora TTS ERROR] provider=ElevenLabs status=Failed latency=${Date.now() - startTime}ms`);
      }
      return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
    }

    const buffer = await response.arrayBuffer();
    
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Aevora TTS] provider=ElevenLabs model=eleven_multilingual_v2 voice=EXAVITQu4vr4xnSDxMaL status=Success latency=${Date.now() - startTime}ms`);
      console.log(`[Aevora Speech] "${speechText}"`);
    }
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg'
      }
    });
  } catch (error) {
    console.warn("Voice API warning:", error);
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Aevora TTS ERROR] provider=ElevenLabs status=Failed latency=${Date.now() - startTime}ms`);
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
