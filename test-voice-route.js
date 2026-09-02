async function test() {
  const res = await fetch("http://localhost:3000/api/voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: "Hello. This is a test.",
      language: "en-IN"
    })
  });
  console.log("Status:", res.status);
  const buf = await res.arrayBuffer();
  console.log("Audio bytes:", buf.byteLength);
}
test();
