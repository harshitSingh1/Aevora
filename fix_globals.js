const fs = require('fs');
let content = fs.readFileSync('src/app/globals.css', 'utf8');
if (!content.includes('--color-popover: var(--popover)')) {
  content = content.replace(
    '--color-background: var(--background);',
    '--color-background: var(--background);\n  --color-popover: var(--popover);\n  --color-popover-foreground: var(--popover-foreground);'
  );
}
fs.writeFileSync('src/app/globals.css', content);
