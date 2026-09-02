async function test() {
  const response = await fetch("https://api.featherless.ai/v1/models", {
    headers: {
      "Authorization": `Bearer ${process.env.FEATHERLESS_API_KEY}`
    }
  });
  const data = await response.json();
  const available = data.data.slice(0, 10).map(m => m.id);
  console.log(available);
}
test();
