import React from 'react';

export function VoiceDiagnostics({ telemetry }: { telemetry: any }) {
  if (!telemetry) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg font-mono text-xs z-50 pointer-events-none w-80">
      <h3 className="font-bold border-b border-white/20 pb-2 mb-2 text-green-400">VOICE PIPELINE</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>State:</span>
          <span>{telemetry.callState}</span>
        </div>
        <div className="flex justify-between">
          <span>Microphone:</span>
          <span className={telemetry.isMicActive ? "text-green-400" : "text-red-400"}>
            {telemetry.isMicActive ? "✓" : "✕"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Audio Frames Sent:</span>
          <span>{telemetry.framesSent || 0}</span>
        </div>
        
        {telemetry.stt && (
          <>
            <div className="flex justify-between mt-2 pt-2 border-t border-white/20">
              <span className="text-blue-300">STT WebSocket:</span>
              <span className={telemetry.stt.status === "Connected" ? "text-green-400" : "text-yellow-400"}>
                {telemetry.stt.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span>STT Token:</span>
              <span>{telemetry.sttToken === "missing_key" ? "✕" : (telemetry.sttToken ? "✓" : "-")}</span>
            </div>
          </>
        )}

        {telemetry.ai && (
          <>
            <div className="flex justify-between mt-2 pt-2 border-t border-white/20">
              <span className="text-purple-300">Featherless LLM:</span>
              <span className={telemetry.ai.status === "Success" ? "text-green-400" : "text-red-400"}>
                {telemetry.ai.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span>LLM Latency:</span>
              <span>{telemetry.ai.latency}ms</span>
            </div>
          </>
        )}

        {telemetry.tts && (
          <>
            <div className="flex justify-between mt-2 pt-2 border-t border-white/20">
              <span className="text-orange-300">ElevenLabs TTS:</span>
              <span className={telemetry.tts.status === "Success" ? "text-green-400" : "text-red-400"}>
                {telemetry.tts.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span>TTS Token:</span>
              <span>{telemetry.ttsToken === "missing_key" ? "✕" : (telemetry.ttsToken ? "✓" : "-")}</span>
            </div>
            <div className="flex justify-between">
              <span>TTS Latency:</span>
              <span>{telemetry.tts.latency}ms</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
