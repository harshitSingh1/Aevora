const fs = require('fs');

function fixHeroQuotes() {
  const path = 'src/components/landing/HeroSection.tsx';
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace("you're", "you&apos;re");
  fs.writeFileSync(path, content);
}
fixHeroQuotes();
console.log('Fixed hero quotes.');
