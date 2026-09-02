const fs = require('fs');
let code = fs.readFileSync('src/components/talk/TalkExperience.tsx', 'utf8');

code = code.replace(
  'const { startCall, endCall, interrupt, submitQuery, timer, isMicActive, toggleMic } = voiceParams',
  'const { startCall, endCall, interrupt, submitQuery, timer, isMicActive, toggleMic, audioState } = voiceParams'
);

// Add the voice unavailable warning near the CallState label
code = code.replace(
  '{callState === "active" && <p className="text-lg text-muted-foreground">Ready</p>}',
  '{callState === "active" && <p className="text-lg text-muted-foreground">Ready</p>}\n                  {audioState === "error" && <p className="text-sm text-destructive mt-1">Voice unavailable</p>}'
);

fs.writeFileSync('src/components/talk/TalkExperience.tsx', code);
