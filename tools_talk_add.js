const fs = require('fs');

function addAdvocacyButton() {
  const path = 'src/components/talk/TalkExperience.tsx';
  let content = fs.readFileSync(path, 'utf8');

  // Add the mock data import if it's missing
  if (!content.includes('mockAdvocacyActions')) {
    content = content.replace(
      'import { mockFindings } from "@/lib/mock-data"',
      'import { mockFindings } from "@/lib/mock-data"\nimport { mockAdvocacyActions } from "@/lib/mock-data/advocacy"'
    );
  }

  // Add logic to save action
  const logic = `
  const handleAddToAdvocacy = () => {
    if (!currentCase) return;
    const actions = mockAdvocacyActions[currentCase.id] || [];
    actions.push({
      id: "act-talk-" + Date.now(),
      title: "Follow up on Talk discussion",
      target: "billing",
      status: "open",
      question: "Why was this charge added?",
      createdAt: new Date().toISOString()
    });
    mockAdvocacyActions[currentCase.id] = actions;
    alert('Added to Advocacy Plan!');
  };
`;

  if (!content.includes('handleAddToAdvocacy')) {
    content = content.replace('const handleSendText = () => {', logic + '\n  const handleSendText = () => {');
  }

  // Add button in ended state
  if (!content.includes('Add to Advocacy Plan')) {
    content = content.replace(
      '<Button onClick={() => router.push("/advocacy")}>Back to Advocacy</Button>',
      '<Button onClick={handleAddToAdvocacy}>Add to Advocacy Plan</Button>\n                  <Button onClick={() => router.push("/advocacy")}>Back to Advocacy</Button>'
    );
  }

  fs.writeFileSync(path, content);
}

addAdvocacyButton();
console.log('Added advocacy button.');
