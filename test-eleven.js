async function test() {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: "Hello. This is a test.",
      model_id: 'eleven_multilingual_v2'
    })
  });
  console.log("Status:", response.status);
  const data = await response.arrayBuffer();
  console.log("Audio bytes:", data.byteLength);
  if (!response.ok) {
    const text = new TextDecoder().decode(data);
    console.log("Error:", text);
  }
}
test();
