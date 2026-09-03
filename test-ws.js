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
    ws.send(JSON.stringify({ text: " " })); // See if it takes config?
    // Send 1 second of silence
    const silence = Buffer.alloc(16000 * 2); // 1 sec of 16kHz 16-bit PCM
    ws.send(JSON.stringify({ user_audio_chunk: silence.toString('base64') }));
    // Try the other format too
    ws.send(JSON.stringify({ message_type: "input_audio_chunk", audio_base_64: silence.toString('base64') }));
  });
  ws.on('message', (msg) => {
    console.log("Message:", msg.toString());
  });
  ws.on('error', (err) => console.log("Error:", err));
  ws.on('close', (code, reason) => console.log("Closed:", code, reason.toString()));
  setTimeout(() => ws.close(), 5000);
}
test();
