const fs = require('fs');
let code = fs.readFileSync('src/hooks/useVoiceConversation.ts', 'utf8');

// Add a ref to track the current active query turn
if (!code.includes('const turnRef = useRef(0);')) {
  code = code.replace(
    'const timerRef = useRef<NodeJS.Timeout | null>(null);',
    'const timerRef = useRef<NodeJS.Timeout | null>(null);\n  const turnRef = useRef(0);'
  );

  code = code.replace(
    'const submitQuery = useCallback(async (text: string) => {',
    `const submitQuery = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    turnRef.current += 1;
    const currentTurn = turnRef.current;
    
    interrupt();
    
    addMessage({
      role: "user",
      text,
      source: "typed"
    });
    setCallState("thinking");
    
    try {
      const response = await talkAIService.generateAdvocacyResponse(context, messages);
      
      if (turnRef.current !== currentTurn) return; // Stale request, ignore

      addMessage({
        role: "assistant",
        text: response.text,
        source: "voice",
        relatedDocumentIds: response.relatedDocumentIds
      });
      
      if (response.shouldSpeak) {
        setCallState("speaking");
        await browserSpeechService.speak(response.speechText || response.text, language === "hi" ? "hi-IN" : "en-IN");
        if (turnRef.current === currentTurn) {
          setCallState("active");
        }
      } else {
        if (turnRef.current === currentTurn) {
          setCallState("active");
        }
      }
    } catch (error) {
      if (turnRef.current !== currentTurn) return;
      console.error(error);
      addMessage({
        role: "system",
        text: "Aevora couldn't generate a response right now.",
        source: "system"
      });
      setCallState("active");
    }`
  );
  
  // Clean up old submitQuery implementation inside the block
  // We need to be careful with replace
  fs.writeFileSync('src/hooks/useVoiceConversation.ts', code);
}
