const fs = require('fs');

// 1. Fix dashes in HeroSection
let heroPath = 'src/components/landing/HeroSection.tsx';
if (fs.existsSync(heroPath)) {
  let content = fs.readFileSync(heroPath, 'utf8');
  content = content.replace(
    'Aevora connects your treatment, hospital estimates, insurance, and bills to show where your healthcare costs come from — and what you should verify before paying.',
    'Aevora connects your treatment, hospital estimates, insurance, and bills to show where your healthcare costs come from, and what you should verify before paying.'
  );
  fs.writeFileSync(heroPath, content);
}

// 2. Fix dashes in HowItWorksSection
let howItWorksPath = 'src/components/landing/HowItWorksSection.tsx';
if (fs.existsSync(howItWorksPath)) {
  let content = fs.readFileSync(howItWorksPath, 'utf8');
  content = content.replace(
    '<span className="text-primary mr-2">{step.num} —</span>',
    '<span className="text-primary mr-2">{step.num}. </span>'
  );
  fs.writeFileSync(howItWorksPath, content);
}

// 3. Fix globals.css to add popover variables
let globalsPath = 'src/app/globals.css';
if (fs.existsSync(globalsPath)) {
  let content = fs.readFileSync(globalsPath, 'utf8');
  
  if (!content.includes('--color-popover')) {
    content = content.replace(
      '--color-surface-muted: var(--surface-muted);',
      '--color-surface-muted: var(--surface-muted);\n  --color-popover: var(--popover);\n  --color-popover-foreground: var(--popover-foreground);'
    );
  }
  
  if (!content.includes('--popover: #FFFFFF;')) {
    content = content.replace(
      '--surface: #FFFFFF;',
      '--surface: #FFFFFF;\n    --popover: #FFFFFF;\n    --popover-foreground: #0B1F33;'
    );
  }
  
  if (!content.includes('--popover: #102A43;')) {
    content = content.replace(
      '--surface: #102A43;',
      '--surface: #102A43;\n    --popover: #102A43;\n    --popover-foreground: #F7F9FC;'
    );
  }
  
  fs.writeFileSync(globalsPath, content);
}

console.log('Fixed dashes and globals.css');
