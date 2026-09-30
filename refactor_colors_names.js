const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const colorsFile = path.join(srcDir, 'theme', 'colors.ts');

let colorsContent = fs.readFileSync(colorsFile, 'utf8');

const colorMap = {
  'white': 'white',
  'black': 'black',
  'gray': 'gray',
  'red': 'red',
  'transparent': 'transparent'
};

if (!colorsContent.includes("transparent:")) {
  const insertIndex = colorsContent.lastIndexOf('}');
  colorsContent = colorsContent.slice(0, insertIndex) + "  transparent: 'transparent',\n" + colorsContent.slice(insertIndex);
  fs.writeFileSync(colorsFile, colorsContent, 'utf8');
}

function getImportPath(filePath) {
  const relPath = path.relative(path.dirname(filePath), path.join(srcDir, 'theme', 'colors'));
  let posixPath = relPath.split(path.sep).join('/');
  if (!posixPath.startsWith('.')) {
    posixPath = './' + posixPath;
  }
  return posixPath;
}

function processFile(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    if (filePath === colorsFile) return;

    let content = fs.readFileSync(filePath, 'utf8');

    const colorPropRegex = /(color|backgroundColor|borderColor|borderTopColor|borderBottomColor|shadowColor|tintColor|selectionColor):\s*['"](white|black|gray|red|transparent)['"]/ig;
    
    let hasChanges = false;
    content = content.replace(colorPropRegex, (match, prop, colorVal) => {
      hasChanges = true;
      const lower = colorVal.toLowerCase();
      return `${prop}: Colors.${colorMap[lower]}`;
    });

    if (hasChanges) {
      if (!content.includes("import { Colors }")) {
        const importStatement = `import { Colors } from '${getImportPath(filePath)}';\n`;
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
          const endOfLine = content.indexOf('\n', lastImportIndex);
          content = content.slice(0, endOfLine + 1) + importStatement + content.slice(endOfLine + 1);
        } else {
          content = importStatement + content;
        }
      }
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated names in ${path.relative(__dirname, filePath)}`);
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
console.log('Done name refactoring.');
