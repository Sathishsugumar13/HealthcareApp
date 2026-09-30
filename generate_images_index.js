const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'src', 'assets', 'images');
const categories = ['articles', 'common', 'doctors', 'hospitals', 'onboarding'];

let indexContent = 'export const images = {\n';

for (const cat of categories) {
  const catPath = path.join(imagesDir, cat);
  if (fs.existsSync(catPath) && fs.statSync(catPath).isDirectory()) {
    indexContent += `  ${cat}: {\n`;
    const files = fs.readdirSync(catPath);
    for (const file of files) {
      if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) {
        let propName = file.replace(/\.(jpg|png|jpeg)$/, '');
        propName = propName.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
        indexContent += `    ${propName}: require('./${cat}/${file}'),\n`;
      }
    }
    indexContent += `  },\n`;
  }
}

indexContent += '};\n';

fs.writeFileSync(path.join(imagesDir, 'index.ts'), indexContent, 'utf8');
console.log('Generated index.ts');
