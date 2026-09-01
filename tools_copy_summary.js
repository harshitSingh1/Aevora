const fs = require('fs');

function addCopySummary() {
  const path = 'src/app/(dashboard)/advocacy/page.tsx';
  let content = fs.readFileSync(path, 'utf8');

  const copyLogic = `
  const handleCopySummary = async () => {
    if (!selectedFinding) return;
    const text = [
      \`Finding: \${selectedFinding.title}\`,
      \`Amount: ₹\${selectedFinding.amount?.toLocaleString('en-IN')}\`,
      \`Question: \${question?.text || ''}\`
    ].join('\\n');
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };
`;
  
  if (!content.includes('handleCopySummary')) {
    content = content.replace('const handleExportEvidence = () => {', copyLogic + '\n  const handleExportEvidence = () => {');
  }

  content = content.replace(
    '<Button variant="outline" className="bg-surface">',
    '<Button variant="outline" className="bg-surface" onClick={handleCopySummary}>'
  );

  fs.writeFileSync(path, content);
}

addCopySummary();
console.log('Copy Summary added.');
