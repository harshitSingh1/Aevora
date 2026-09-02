const fs = require('fs');
let code = fs.readFileSync('src/hooks/useVoiceConversation.ts', 'utf8');

if (!code.includes('browserSpeechService.stop();\n    };\n  }, []);')) {
  code = code.replace(
    '  // Demo mic toggle',
    '  useEffect(() => {\n    return () => {\n      browserSpeechService.stop();\n    };\n  }, []);\n\n  // Demo mic toggle'
  );
  fs.writeFileSync('src/hooks/useVoiceConversation.ts', code);
}
