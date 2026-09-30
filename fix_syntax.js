const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'src');

function processFile(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    const regex = /([a-zA-Z]+)=Colors\.([a-zA-Z0-9_]+)/g;
    if (regex.test(content)) {
      content = content.replace(regex, '$1={Colors.$2}');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', filePath);
    }
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}
traverse(srcDir);
