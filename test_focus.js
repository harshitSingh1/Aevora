const fs = require('fs');
let code = fs.readFileSync('src/app/(dashboard)/talk/page.tsx', 'utf8');
console.log(code);
