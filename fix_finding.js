const fs = require('fs');
let code = fs.readFileSync('src/components/talk/TalkExperience.tsx', 'utf8');

// Move finding declaration up
const findingDecl = `  const finding = React.useMemo(() => {
    if (!currentCase || !context.findingId) return null
    return mockFindings[currentCase.id]?.find(f => f.id === context.findingId)
  }, [currentCase, context.findingId])`;

code = code.replace(findingDecl, '');
code = code.replace(
  '  // Pre-fill suggested questions based on context',
  findingDecl + '\n\n  // Pre-fill suggested questions based on context'
);

fs.writeFileSync('src/components/talk/TalkExperience.tsx', code);
