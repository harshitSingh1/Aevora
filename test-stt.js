require('dotenv').config();
const WebSocket = require('ws');
async function test() {
  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text/realtime_scribe", {
    method: "POST", headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY }
  });
  console.log(await res.text());
}
test();
