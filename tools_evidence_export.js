const fs = require('fs');

function addEvidenceExport() {
  const path = 'src/app/(dashboard)/advocacy/page.tsx';
  let content = fs.readFileSync(path, 'utf8');

  const exportLogic = `
  const handleExportEvidence = () => {
    if (!selectedFinding) return;
    const text = [
      'CARELEDGER EVIDENCE PACK',
      '========================',
      \`Case: \${currentCase?.patientName}\`,
      \`Finding: \${selectedFinding.title}\`,
      \`Amount: ₹\${selectedFinding.amount?.toLocaleString('en-IN')}\`,
      \`Status: Needs clarification\`,
      '\\nSOURCE DOCUMENTS:',
      ...selectedFinding.evidence.map(ev => \`- \${ev.label}\`),
      '\\nQUESTION PREPARED:',
      question?.text || '',
      '\\nNOTES:',
      '...' // We could add notes if we had state for it
    ].join('\\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`careledger-evidence-\${selectedFinding.id}.txt\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
`;
  
  if (!content.includes('handleExportEvidence')) {
    content = content.replace('const [showEvidencePack, setShowEvidencePack] = React.useState(false)', 'const [showEvidencePack, setShowEvidencePack] = React.useState(false)\n' + exportLogic);
  }

  content = content.replace(
    '<Button>',
    '<Button onClick={handleExportEvidence}>'
  );

  fs.writeFileSync(path, content);
}

addEvidenceExport();
console.log('Evidence export added.');
