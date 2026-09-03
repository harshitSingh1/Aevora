const WebSocket = require('ws');
async function test() {
  const tokenRes = await fetch("https://api.elevenlabs.io/v1/single-use-token/realtime_scribe", {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY }
  });
  const token = (await tokenRes.json()).token;
  
  const ws = new WebSocket(`wss://api.elevenlabs.io/v1/speech-to-text/realtime?token=${token}`);
  ws.on('open', () => {
    console.log("Connected");
    const silence = Buffer.alloc(16000 * 2); // 1 sec of 16kHz 16-bit PCM
    ws.send(silence); // Try binary
    ws.send(JSON.stringify({ audio_chunk: silence.toString('base64') }));
    ws.send(JSON.stringify({ type: "audio", audio: silence.toString('base64') }));
    ws.send(JSON.stringify({ type: "input_audio", audio: silence.toString('base64') }));
  });
  ws.on('message', (msg) => {
    console.log("Message:", msg.toString());
  });
}
test();
