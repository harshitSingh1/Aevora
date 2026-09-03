const fs = require('fs');

let content = fs.readFileSync('src/hooks/useVoiceConversation.ts', 'utf8');

// 1. Remove speechSynthesis from stopPlayback
content = content.replace(/if\s*\(window\.speechSynthesis\)\s*\{\s*window\.speechSynthesis\.cancel\(\);\s*\}/g, '');

// 2. Rewrite startCall STT Setup block
const startCallRegex = /\/\/ STT Setup[\s\S]*?(?=sttCtxRef\.current = new \()/;
content = content.replace(startCallRegex, `// STT Setup
        let sttToken = null;
        try {
            const sttRes = await fetch("/api/elevenlabs/token-stt", { method: "POST" });
            if (sttRes.status === 401) {
                sttToken = "missing_key";
            } else {
                const data = await sttRes.json();
                if (data.token) sttToken = data.token;
            }
        } catch(e) {}
        
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

        `);

// 3. Rewrite submitQuery TTS Setup block
const submitQueryTTSRegex = /let ttsToken = "demo_tts_token";\s*try \{[\s\S]*?(?=await playCtxRef\.current\.init\(\);)/;
content = content.replace(submitQueryTTSRegex, `let ttsToken = null;
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

        `);

// 4. Rewrite initial TTS greeting in startCall
const initialTTSRegex = /let ttsToken = "demo_tts_token";\s*fetch\("\/api\/elevenlabs\/token-tts"[\s\S]*?(?=await playCtxRef\.current\.init\(\);)/;
content = content.replace(initialTTSRegex, `let ttsToken = null;
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
                    `);

fs.writeFileSync('src/hooks/useVoiceConversation.ts', content);
