const fs = require('fs');

function fixQuotes(path, search, replace) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(search, replace);
  fs.writeFileSync(path, content);
}

fixQuotes('src/components/talk/TalkExperience.tsx', '"{q}"', '&quot;{q}&quot;');
fixQuotes('src/app/(dashboard)/advocacy/page.tsx', '"{question?.text}"', '&quot;{question?.text}&quot;');

console.log('Fixed quotes.');
