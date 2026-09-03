const WebSocket = require('ws');
async function test() {
  const tokenRes = await fetch("https://api.elevenlabs.io/v1/single-use-token/realtime_scribe", {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY }
  });
  const token = (await tokenRes.json()).token;
  
  const ws = new WebSocket(`wss://api.elevenlabs.io/v1/speech-to-text/realtime?token=${token}`);
  ws.on('open', () => {
    const silence = Buffer.alloc(16000 * 2);
    // test EXACTLY what useVoiceConversation is sending
    const jsonStr = JSON.stringify({
      message_type: "input_audio_chunk",
      audio_base_64: silence.toString('base64')
    });
    console.log("Sending:", jsonStr.substring(0, 50));
    ws.send(jsonStr);
  });
  ws.on('message', (msg) => {
    console.log("Message:", msg.toString());
  });
  setTimeout(() => process.exit(0), 4000);
}
test();
