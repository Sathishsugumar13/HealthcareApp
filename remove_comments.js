const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

const dir = '.';
const excludeDirs = ['node_modules', '.expo', '.git', 'dist', 'assets'];

function traverseDir(currentPath) {
  const files = fs.readdirSync(currentPath);
  for (const file of files) {
    const fullPath = path.join(currentPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!excludeDirs.includes(file)) {
        traverseDir(fullPath);
      }
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let originalContent = content;
        
        try {
          
          content = strip(content);
          
          
          content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
          
          if (content !== originalContent) {
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Stripped comments from ${fullPath}`);
          }
        } catch (e) {
          console.error(`Error processing ${fullPath}:`, e);
        }
      }
    }
  }
}

traverseDir(dir);
console.log('Done!');
