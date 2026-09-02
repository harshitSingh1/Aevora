const fs = require('fs');
let code = fs.readFileSync('src/components/talk/TalkExperience.tsx', 'utf8');

if (!code.includes('aiTelemetry')) {
  code = code.replace(
    'audioState } = voiceParams',
    'audioState, aiTelemetry, voiceTelemetry } = voiceParams'
  );
  
  const telemetryUI = `
      {process.env.NODE_ENV !== "production" && (aiTelemetry || voiceTelemetry) && (
        <div className="absolute top-4 left-4 z-50 bg-black/80 text-[10px] font-mono text-green-400 p-3 rounded-lg border border-green-500/30 max-w-xs shadow-2xl backdrop-blur">
          <div className="font-bold mb-2 text-white border-b border-white/20 pb-1">AI Pipeline Diagnostics</div>
          
          <div className="text-white/70 mb-1">=== LLM ===</div>
          <div>Provider: {aiTelemetry?.provider || "Unknown"}</div>
          <div>Model: {aiTelemetry?.model || "Unknown"}</div>
          <div>Status: {aiTelemetry?.status || "Unknown"}</div>
          <div>Latency: {aiTelemetry?.latency || 0}ms</div>
          <div>Mode: {aiTelemetry?.mode || "Unknown"}</div>
          
          <div className="text-white/70 mt-2 mb-1">=== TTS ===</div>
          <div>Provider: {voiceTelemetry?.provider || "Unknown"}</div>
          <div>Model: {voiceTelemetry?.model || "Unknown"}</div>
          <div>Voice: {voiceTelemetry?.voice || "Unknown"}</div>
          <div>Status: {voiceTelemetry?.status || "Unknown"}</div>
          <div>Latency: {voiceTelemetry?.latency || 0}ms</div>
        </div>
      )}
  `;
  
  code = code.replace(
    '<div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] w-full gap-4 max-w-6xl mx-auto">',
    '<div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] w-full gap-4 max-w-6xl mx-auto relative">\n' + telemetryUI
  );

  fs.writeFileSync('src/components/talk/TalkExperience.tsx', code);
}
