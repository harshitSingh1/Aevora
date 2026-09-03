import { useState, useCallback, useRef, useEffect } from "react";
import { TalkMessage, CallState, AudioState } from "@/types";
import { talkAIService } from "@/services/ai/aiService";

class PCMPlayer {
    audioCtx: AudioContext | null = null;
    sources: AudioBufferSourceNode[] = [];
    nextTime: number = 0;
    isPlaying: boolean = false;
    onAudioPlayed?: (bytes: number) => void;
    onPlaybackStarted?: () => void;
    onPlaybackEnded?: () => void;

    async init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        if (this.audioCtx.state === 'suspended') {
            await this.audioCtx.resume();
        }
        this.isPlaying = true;
        this.nextTime = this.audioCtx.currentTime;
        this.onPlaybackStarted?.();
    }

    playChunk(base64: string) {
        if (!this.audioCtx || !this.isPlaying) return;
        const binary = atob(base64);
        this.onAudioPlayed?.(binary.length);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const int16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768.0;

        const buffer = this.audioCtx.createBuffer(1, float32.length, 24000);
        buffer.getChannelData(0).set(float32);

        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioCtx.destination);
        
        if (this.nextTime < this.audioCtx.currentTime) {
            this.nextTime = this.audioCtx.currentTime;
        }
        source.start(this.nextTime);
        this.nextTime += buffer.duration;
        this.sources.push(source);
        
        source.onended = () => {
            this.sources = this.sources.filter(s => s !== source);
        };
    }

    stop() {
        this.isPlaying = false;
        this.sources.forEach(s => {
            try { s.stop(); } catch(e) {}
        });
        this.sources = [];
        this.nextTime = 0;
        this.onPlaybackEnded?.();
    }
    
    isFinished() {
        if (!this.isPlaying) return true;
        if (this.nextTime === 0) return true; // If we never played anything, we're technically finished playing.
        return this.sources.length === 0 && this.audioCtx && this.audioCtx.currentTime >= this.nextTime;
    }
}

export function useVoiceConversation(
  sessionParams: {
    context: any;
    messages: TalkMessage[];
    addMessage: (msg: any) => void;
    callState: CallState;
    setCallState: (s: CallState) => void;
    language: string;
  }
) {
  const { context, messages, addMessage, callState, setCallState, language } = sessionParams;
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [aiTelemetry, setAiTelemetry] = useState<any>(null);
  const [voiceTelemetry, setVoiceTelemetry] = useState<any>(null);
  const [sttTelemetry, setSttTelemetry] = useState<any>(null);
  
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const turnRef = useRef(0);
  const [framesSent, setFramesSent] = useState(0);
  const [isMicActive, setIsMicActive] = useState(false);
  
  // Debug metrics
  const [debugMetrics, setDebugMetrics] = useState({
    micStreamCreated: false,
    micTrackLive: false,
    audioContextState: "none",
    audioProcessorCreated: false,
    processorCallbackCount: 0,
    nonEmptyBufferCount: 0,
    sttTokenReceived: false,
    sttTokenStatus: "-",
    ttsAudioBytes: 0,
    ttsPlaybackStarted: false,
    ttsPlaybackEnded: false,
  });

  const streamRef = useRef<MediaStream | null>(null);
  const sttCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sttWsRef = useRef<WebSocket | null>(null);
  const ttsWsRef = useRef<WebSocket | null>(null);
  const playCtxRef = useRef<PCMPlayer>(new PCMPlayer());
  const checkIntervalRef = useRef<any>(null);

  useEffect(() => {
    playCtxRef.current.onPlaybackStarted = () => {
        setDebugMetrics(prev => ({ ...prev, ttsPlaybackStarted: true }));
    };
    playCtxRef.current.onPlaybackEnded = () => {
        setDebugMetrics(prev => ({ ...prev, ttsPlaybackEnded: true }));
    };
    playCtxRef.current.onAudioPlayed = (bytes) => {
        setDebugMetrics(prev => ({ ...prev, ttsAudioBytes: prev.ttsAudioBytes + bytes }));
    };
  }, []);

  const stateRef = useRef(callState);
  useEffect(() => { stateRef.current = callState; }, [callState]);
  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  const contextRef = useRef(context);
  useEffect(() => { contextRef.current = context; }, [context]);

  const framesSentRef = useRef(0);
  const nonEmptyBufferCountRef = useRef(0);
  const processorCallbackCountRef = useRef(0);

  // Timer logic
  useEffect(() => {
    if (callState === "active" || callState === "listening" || callState === "thinking" || callState === "speaking") {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setTimer(t => t + 1);
          setFramesSent(framesSentRef.current);
          setDebugMetrics(prev => ({
             ...prev,
             processorCallbackCount: processorCallbackCountRef.current,
             nonEmptyBufferCount: nonEmptyBufferCountRef.current
          }));
        }, 1000);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (callState === "idle" || callState === "ended") {
        setTimeout(() => setTimer(0), 0);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  const stopPlayback = useCallback(() => {
    playCtxRef.current.stop();
    if (ttsWsRef.current) {
        ttsWsRef.current.close();
        ttsWsRef.current = null;
    }
    if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
    }
  }, []);

  const endCall = useCallback(() => {
    setCallState("ended");
    setIsMicActive(false);
    setAudioState("ended");
    stopPlayback();
    if (sttWsRef.current) {
        sttWsRef.current.close();
        sttWsRef.current = null;
    }
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }
    if (sttCtxRef.current) {
        sttCtxRef.current.close().catch(console.error);
        sttCtxRef.current = null;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }
  }, [setCallState, stopPlayback]);

  const interrupt = useCallback(() => {
    if (stateRef.current === "speaking") {
      stopPlayback();
      setCallState("listening"); // We can go right back to listening!
    }
  }, [setCallState, stopPlayback]);

  const submitQuery = useCallback(async (text: string) => {
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
      const currentMessages = [...messagesRef.current, { id: Date.now().toString(), role: "user" as const, text, timestamp: new Date().toISOString(), source: "typed" as const }];
      const response = await talkAIService.generateAdvocacyResponse(contextRef.current, currentMessages);
            
      if (turnRef.current !== currentTurn) return; // Stale request
      addMessage({
        role: "assistant",
        text: response.text,
        source: "voice",
        relatedDocumentIds: response.relatedDocumentIds
      });
            
      setAiTelemetry(response.telemetry || null);

      if (response.shouldSpeak) {
        setCallState("speaking");
        const speechText = response.speechText || response.text;
        
        let ttsToken: string | null = null;
        try {
            const ttsRes = await fetch("/api/elevenlabs/token-tts", { method: "POST" });
            if (ttsRes.status === 401) {
                ttsToken = "missing_key";
            } else {
                const data = await ttsRes.json();
                if (data.token) ttsToken = data.token;
            }
        } catch(e) {}

        if (ttsToken === "demo_tts_token") {
            setVoiceTelemetry({ provider: "Demo Fallback", model: "mock", voice: "default", latency: 50, status: "Success" });
            setTimeout(() => {
                if (stateRef.current === 'speaking') setCallState('listening');
            }, Math.min(3000, speechText.length * 50));
            return;
        }

        if (!ttsToken || ttsToken === "missing_key") {
             setVoiceTelemetry({ provider: "ElevenLabs", model: "eleven_multilingual_v2", voice: "Aevora", latency: 0, status: "Failed (Missing Key)" });
             setAudioState("error");
             setTimeout(() => {
                 if (stateRef.current === 'speaking') setCallState('listening');
             }, 1000);
             return;
        }

        await playCtxRef.current.init();
        
        const ttsWs = new WebSocket(`wss://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream-input?model_id=eleven_multilingual_v2&output_format=pcm_24000&single_use_token=${ttsToken}`);
        ttsWsRef.current = ttsWs;
        
        let ttsStartTime = Date.now();
        let gotFirstAudio = false;

        ttsWs.onopen = () => {
            ttsWs.send(JSON.stringify({ text: " ", voice_settings: { stability: 0.5, similarity_boost: 0.8 } }));
            ttsWs.send(JSON.stringify({ text: speechText }));
            ttsWs.send(JSON.stringify({ text: "" }));
        };

        ttsWs.onmessage = (e) => {
            const msg = JSON.parse(e.data.toString());
            if (msg.error) {
                console.error("TTS WS Error:", msg.error);
                setVoiceTelemetry({ provider: "ElevenLabs", model: "eleven_multilingual_v2", voice: "Aevora", latency: 0, status: "Failed" });
                setCallState('listening');
                return;
            }
            if (msg.audio) {
                if (!gotFirstAudio) {
                    setVoiceTelemetry({ provider: "ElevenLabs", model: "eleven_multilingual_v2", voice: "Aevora", latency: Date.now() - ttsStartTime, status: "Success" });
                    gotFirstAudio = true;
                }
                playCtxRef.current.playChunk(msg.audio);
            }
            if (msg.isFinal || msg.is_final) {
                ttsWs.close();
            }
        };

        checkIntervalRef.current = setInterval(() => {
            if (playCtxRef.current.isPlaying && ttsWs.readyState === WebSocket.CLOSED) {
                if (playCtxRef.current.isFinished()) {
                    stopPlayback();
                    if (stateRef.current === 'speaking') {
                        setCallState('listening');
                    }
                }
            }
        }, 100);
      } else {
        if (turnRef.current === currentTurn) {
          setCallState("listening");
        }
      }
    } catch (error) {
      if (turnRef.current !== currentTurn) return;
      console.warn("Conversation API warning:", error);
      addMessage({
        role: "system",
        text: "Aevora couldn't generate a response right now.",
        source: "system"
      });
      setCallState("listening");
    }
  }, [addMessage, setCallState, interrupt, stopPlayback]);

  const startCall = useCallback(async () => {
    framesSentRef.current = 0;
    nonEmptyBufferCountRef.current = 0;
    processorCallbackCountRef.current = 0;
    setFramesSent(0);

    setCallState("connecting");
    
    // SYNCHRONOUS AUDIO CONTEXT INITIALIZATION FOR MOBILE SAFARI
    // Must happen before any `await` (like getUserMedia or fetch)
    const sttCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    sttCtxRef.current = sttCtx;
    
    // Also initialize the TTS player AudioContext synchronously
    if (!playCtxRef.current.audioCtx) {
        playCtxRef.current.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    
    // Attempt resume immediately
    if (sttCtx.state === 'suspended') sttCtx.resume().catch(() => {});
    if (playCtxRef.current.audioCtx.state === 'suspended') playCtxRef.current.audioCtx.resume().catch(() => {});

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
        streamRef.current = stream;
        setIsMicActive(true);
        
        const audioTrack = stream.getAudioTracks()[0];
        setDebugMetrics(prev => ({ 
            ...prev, 
            micStreamCreated: true, 
            micTrackLive: audioTrack?.readyState === "live" 
        }));

        // STT Setup
        let sttToken: string | null = null;
        try {
            const sttRes = await fetch("/api/elevenlabs/token-stt", { method: "POST" });
            if (sttRes.status === 401) {
                sttToken = "missing_key";
                setDebugMetrics(prev => ({ ...prev, sttTokenStatus: "missing_key" }));
            } else {
                const data = await sttRes.json();
                if (data.token) {
                    sttToken = data.token;
                    setDebugMetrics(prev => ({ ...prev, sttTokenReceived: true, sttTokenStatus: "Received" }));
                }
            }
        } catch(e) {
            setDebugMetrics(prev => ({ ...prev, sttTokenStatus: "Fetch Error" }));
        }
        
        if (sttToken === "demo_stt_token") {
            setSttTelemetry({ provider: "Demo Fallback", model: "mock", status: "Connected", latency: 0 });
            setCallState("active");
            
            const greeting = "Hi. What would you like to understand?";
            addMessage({ role: "assistant", text: greeting, source: "voice" });
            setCallState("speaking");
            
            setTimeout(() => {
                if (stateRef.current === 'speaking') setCallState('listening');
            }, 3000);
            return;
        }

        if (!sttToken || sttToken === "missing_key") {
             setSttTelemetry({ provider: "ElevenLabs", model: "scribe_v2_realtime", status: "Failed (Missing Key)", latency: 0 });
             console.error("Missing ElevenLabs API Key");
             setAudioState("error");
             setCallState("error" as any);
             return;
        }

        if (sttCtxRef.current?.state === 'suspended') {
            await sttCtxRef.current.resume();
        }
        
        setDebugMetrics(prev => ({ 
            ...prev, 
            audioContextState: sttCtxRef.current?.state || "unknown",
        }));
        
        if (!sttCtxRef.current) throw new Error("AudioContext missing");
        
        const source = sttCtxRef.current.createMediaStreamSource(stream);
        const processor = sttCtxRef.current.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;
        
        setDebugMetrics(prev => ({ 
            ...prev, 
            audioProcessorCreated: !!processor 
        }));
        
        const ws = new WebSocket(`wss://api.elevenlabs.io/v1/speech-to-text/realtime?token=${sttToken}`);
        sttWsRef.current = ws;
        
        let sttStart = Date.now();
        let commitDebounce: any;
        
        ws.onopen = () => {
            setSttTelemetry({ provider: "ElevenLabs", model: "scribe_v2_realtime", status: "Connected", latency: Date.now() - sttStart });
            source.connect(processor);
            processor.connect(sttCtxRef.current!.destination);
            setCallState("active");
            
            // Initial AI greeting
            const greeting = "Hi. What would you like to understand?";
            addMessage({ role: "assistant", text: greeting, source: "voice" });
            
            // Speak it
            setCallState("speaking");
            
            let ttsToken: string | null = null;
            fetch("/api/elevenlabs/token-tts", { method: "POST" })
                .then(async r => {
                    if (r.status === 401) {
                        ttsToken = "missing_key";
                    } else {
                        const data = await r.json();
                        if (data.token) ttsToken = data.token;
                    }
                    if (ttsToken === "demo_tts_token") {
                        setTimeout(() => { if (stateRef.current === 'speaking') setCallState('listening'); }, 2000);
                        return;
                    }
                    if (!ttsToken || ttsToken === "missing_key") {
                        setAudioState("error");
                        setTimeout(() => { if (stateRef.current === 'speaking') setCallState('listening'); }, 1000);
                        return;
                    }
                    await playCtxRef.current.init();
                    const ttsWs = new WebSocket(`wss://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream-input?model_id=eleven_multilingual_v2&output_format=pcm_24000&single_use_token=${ttsToken}`);
                    ttsWsRef.current = ttsWs;
                    ttsWs.onopen = () => {
                        ttsWs.send(JSON.stringify({ text: " ", voice_settings: { stability: 0.5, similarity_boost: 0.8 } }));
                        ttsWs.send(JSON.stringify({ text: greeting }));
                        ttsWs.send(JSON.stringify({ text: "" }));
                    };
                    ttsWs.onmessage = (e) => {
                        const msg = JSON.parse(e.data.toString());
                        if (msg.audio) playCtxRef.current.playChunk(msg.audio);
                        if (msg.isFinal || msg.is_final) ttsWs.close();
                    };
                    checkIntervalRef.current = setInterval(() => {
                        if (playCtxRef.current.isPlaying && ttsWs.readyState === WebSocket.CLOSED) {
                            if (playCtxRef.current.isFinished()) {
                                stopPlayback();
                                if (stateRef.current === 'speaking') setCallState('listening');
                            }
                        }
                    }, 100);
                });
        };
        
        processor.onaudioprocess = (e) => {
            processorCallbackCountRef.current += 1;
            if (ws.readyState !== WebSocket.OPEN) return;
            if (stateRef.current === 'speaking') return; // Do not send audio while speaking
            
            const float32 = e.inputBuffer.getChannelData(0);
            let hasAudio = false;
            const int16 = new Int16Array(float32.length);
            for (let i = 0; i < float32.length; i++) {
                if (float32[i] !== 0) hasAudio = true;
                let s = Math.max(-1, Math.min(1, float32[i]));
                int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            if (hasAudio) nonEmptyBufferCountRef.current += 1;

            let binary = '';
            const bytes = new Uint8Array(int16.buffer);
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            ws.send(JSON.stringify({
                message_type: "input_audio_chunk",
                audio_base_64: btoa(binary)
            }));
            framesSentRef.current += 1;
        };
        
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data.toString());
            const msgType = data.type || data.message_type;
            
            // Deterministic check: do not process transcripts while Aevora is speaking
            if (stateRef.current === 'speaking') {
                return;
            }

            if (msgType === 'partial_transcript' && data.text) {
                if (commitDebounce) clearTimeout(commitDebounce);
                const text = data.text.trim();
                if (text.length > 0) {
                    let isListening = stateRef.current === 'listening' || stateRef.current === 'active';
                    if (isListening) {
                        commitDebounce = setTimeout(() => {
                            if (ws.readyState === WebSocket.OPEN && stateRef.current !== 'speaking') {
                                submitQuery(text);
                            }
                        }, 1500);
                    }
                }
            } else if (msgType === 'committed_transcript' && data.text) {
                if (commitDebounce) clearTimeout(commitDebounce);
                const text = data.text.trim();
                if (text.length > 0) {
                    if (stateRef.current === 'listening' || stateRef.current === 'active') {
                        submitQuery(text);
                    }
                }
            }
        };
        
        ws.onerror = (e) => {
            console.error("STT WS Error", e);
            setSttTelemetry({ provider: "ElevenLabs", model: "scribe_v2_realtime", status: "Failed", latency: 0 });
            setAudioState("error");
        };

        ws.onclose = () => {
            if (processorRef.current) processorRef.current.disconnect();
        };

    } catch (err) {
        console.error("Failed to start call", err);
        setCallState("error" as any);
    }
  }, [setCallState, submitQuery, interrupt, addMessage, stopPlayback]);

  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  const toggleMic = useCallback(() => {
    if (callState === "speaking") {
      interrupt();
    }
    if (isMicActive) {
      setIsMicActive(false);
      // Mute logic: disconnect processor
      if (processorRef.current) processorRef.current.disconnect();
    } else {
      setIsMicActive(true);
      if (processorRef.current && sttCtxRef.current) processorRef.current.connect(sttCtxRef.current.destination);
    }
  }, [isMicActive, callState, interrupt]);

  return {
    startCall,
    endCall,
    interrupt,
    submitQuery,
    timer,
    isMicActive,
    toggleMic,
    audioState,
    framesSent,
    debugMetrics,
    aiTelemetry,
    voiceTelemetry,
    sttTelemetry
  };
}
