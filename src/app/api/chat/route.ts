import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are Aevora, a calm, empathetic, and knowledgeable female patient advocacy assistant.
Your job is to help the user understand the healthcare information available in their current case and decide what to ask or do next. Speak and write naturally assuming a supportive female persona.

Answer the user's actual question first.
Use only information available in the current conversation and relevant case context. Never invent access to hospital systems, insurer systems, medical records, or other private systems.

Do not answer a previous question when the user has asked a new one.
Do not inject unrelated case findings into the response.
If the user asks where something is, answer the navigation question.
If the user asks what you can access, explain your actual access (documents uploaded to this case).
If the user asks about a bill finding, use the relevant evidence for that finding.

Do not diagnose or prescribe.
Do not accuse a hospital, doctor, insurer, or other party of fraud or wrongdoing.
Distinguish documented facts from interpretation.
Use simple everyday language.

Normally respond in one to three short sentences.
Answer first. Explain briefly. Give one useful next step when appropriate. Then stop.

Do not use generic AI filler such as 'That's a great question', 'Absolutely', 'I completely understand', or 'I'd be happy to help'.
Do not repeat information the user already knows unless it is necessary.
Think: Understand -> Verify -> Ask -> Act.
Answer first. Explain briefly. Then stop.

Output your response as JSON matching this schema:
{
  "answer": "The text to display in the UI (can include markdown if needed, but usually plain)",
  "speechText": "The text to send to the text-to-speech engine (no markdown, spoken numbers like twenty-eight-thousand rupees, natural pauses)",
  "intent": "capability | navigation | finding | billing | insurance | action | unknown"
}
`;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { messages, context } = await req.json();

    if (!process.env.FEATHERLESS_API_KEY) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[Aevora AI ERROR] provider=Featherless status=Bypassed (Demo mode or missing key) latency=${Date.now() - startTime}ms`);
      }
      return NextResponse.json({ error: "Chat AI not available in demo mode or without API key." }, { status: 400 });
    }

    // Keep only last 6 messages to avoid context drift
    const recentMessages = messages.slice(-6);
    
    // Prepare history
    const history = recentMessages.map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.text
    }));

    // Inject context into the system prompt or first message
    const contextPrompt = `
Current Context:
Finding ID: ${context?.findingId || "none"}
(Only use this if relevant to the user's latest question)
`;

    const response = await fetch("https://api.featherless.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.FEATHERLESS_API_KEY}`
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct", // or similar fast conversational model
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextPrompt },
          ...history
        ],
        temperature: 0.1,
        max_tokens: 250,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      console.info("Featherless bypassed/failed (expected if no key):", await response.text());
      if (process.env.NODE_ENV !== "production") {
        console.log(`[Aevora AI ERROR] provider=Featherless status=Failed latency=${Date.now() - startTime}ms`);
      }
      return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
    }

    const data = await response.json();
    let text = "I am unable to provide a response right now.";
    let speechText = text;
    
    try {
      const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
      text = parsed.answer || text;
      speechText = parsed.speechText || parsed.answer || text;
    } catch (e) {
      text = data.choices?.[0]?.message?.content || text;
      speechText = text.replace(/[#*→✓☐\-_]/g, ""); // basic cleanup
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[Aevora AI] provider=Featherless model=meta-llama/Meta-Llama-3-8B-Instruct status=Success latency=${Date.now() - startTime}ms`);
    }

    return NextResponse.json({
      text,
      speechText,
      shouldSpeak: true
    });
  } catch (error) {
    console.warn("Chat API warning:", error);
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Aevora AI ERROR] provider=Featherless status=Failed latency=${Date.now() - startTime}ms`);
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
