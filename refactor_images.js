const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getImportPath(filePath) {
  const relPath = path.relative(path.dirname(filePath), path.join(srcDir, 'assets', 'images'));
  // Ensure posix path for import
  let posixPath = relPath.split(path.sep).join('/');
  if (!posixPath.startsWith('.')) {
    posixPath = './' + posixPath;
  }
  return posixPath;
}

// Regex to find require('.../assets/images/category/filename.ext')
const requireRegex = /require\(['"`](\..*?assets\/images\/(articles|common|doctors|hospitals|onboarding)\/(.+?)\.(jpg|png|jpeg))['"`]\)/g;

function camelCase(str) {
  return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}

function processFile(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    let hasChanges = false;
    content = content.replace(requireRegex, (match, p1, category, filename, ext) => {
      hasChanges = true;
      const propName = camelCase(filename);
      return `images.${category}.${propName}`;
    });

    if (hasChanges) {
      // Need to add import { images } from '...';
      if (!content.includes("import { images }")) {
        const importStatement = `import { images } from '${getImportPath(filePath)}';\n`;
        // Insert after the last import statement, or at the top
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
          const endOfLine = content.indexOf('\n', lastImportIndex);
          content = content.slice(0, endOfLine + 1) + importStatement + content.slice(endOfLine + 1);
        } else {
          content = importStatement + content;
        }
      }
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${path.relative(__dirname, filePath)}`);
    }
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'assets') {
        traverse(fullPath);
      }
    } else {
      processFile(fullPath);
    }
  }
}

traverse(srcDir);
console.log('Done refactoring image usages.');
