async function test() {
  const models = ["Qwen/Qwen2.5-7B-Instruct", "HuggingFaceH4/zephyr-7b-beta", "microsoft/Phi-3-mini-128k-instruct", "google/gemma-2-9b-it", "meta-llama/Llama-3.1-8B-Instruct"];
  for (const model of models) {
    const response = await fetch("https://api.featherless.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.FEATHERLESS_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "Test." }],
        max_tokens: 10
      })
    });
    console.log(model, response.status, await response.text());
  }
}
test();
