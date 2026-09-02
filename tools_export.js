const fs = require('fs');

function addTalkExport() {
  const path = 'src/components/talk/TalkExperience.tsx';
  let content = fs.readFileSync(path, 'utf8');
  
  if (!content.includes('Download } from "lucide-react"')) {
     content = content.replace('PlayCircle, Loader2 } from "lucide-react"', 'PlayCircle, Loader2, Download } from "lucide-react"');
  }

  const exportLogic = `
  const handleExportTranscript = () => {
    if (messages.length === 0) return;
    const text = messages.map(m => \`[\${new Date(m.timestamp).toLocaleTimeString()}] \${m.role.toUpperCase()}: \${m.text}\`).join('\\n\\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`aevora-transcript-\${new Date().toISOString().split('T')[0]}.txt\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
`;
  
  if (!content.includes('handleExportTranscript')) {
    content = content.replace('const handleSendText = () => {', exportLogic + '\n  const handleSendText = () => {');
  }

  if (content.includes('<h3 className="text-sm font-semibold">Transcript</h3>') && !content.includes('onClick={handleExportTranscript}')) {
    content = content.replace(
      '<div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">\\n              <h3 className="text-sm font-semibold">Transcript</h3>\\n            </div>',
      '<div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">\\n              <h3 className="text-sm font-semibold">Transcript</h3>\\n              {messages.length > 0 && (\\n                <Button variant="ghost" size="sm" onClick={handleExportTranscript} className="h-8 gap-1 text-xs">\\n                  <Download className="w-3.5 h-3.5" /> Export\\n                </Button>\\n              )}\\n            </div>'
    );
  }

  fs.writeFileSync(path, content);
}

addTalkExport();
console.log('Talk export added.');
