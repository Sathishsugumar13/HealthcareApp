
const fs = require('fs');

let lines = fs.readFileSync('src/components/HomeComponent/HomeComponent.tsx', 'utf-8').split('\n');
let inImportBlock = false;

for (let i = 20; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) {
        inImportBlock = true;
    }
    
    if (inImportBlock) {
        let line = lines[i];
        lines[i] = '';
        if (line.includes(';') || line.includes('\'')) {
            inImportBlock = false;
        }
    }
}

fs.writeFileSync('src/components/HomeComponent/HomeComponent.tsx', lines.join('\n').replace(/\n\n\n+/g, '\n\n'));

