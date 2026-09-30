const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const colorsFile = path.join(srcDir, 'theme', 'colors.ts');
let colorsContent = fs.readFileSync(colorsFile, 'utf8');

const existingColors = {};
const colorMatchRegex = /([a-zA-Z0-9_]+):\s*['"](#[a-fA-F0-9]+|transparent|rgba?.*?)['"]/ig;
let m;
while ((m = colorMatchRegex.exec(colorsContent)) !== null) {
  existingColors[m[2].toLowerCase().replace(/\s/g, '')] = m[1];
}

let newColorsToAdd = {};

function getColorName(colorValue) {
  const normalized = colorValue.toLowerCase().replace(/\s/g, '');
  if (existingColors[normalized]) return existingColors[normalized];
  
  let newName;
  if (normalized.startsWith('rgba')) {
    newName = 'color' + normalized.replace(/[^a-z0-9]/gi, '').toUpperCase();
    if (normalized === 'rgba(0,0,0,0.4)') newName = 'overlay40';
    if (normalized === 'rgba(0,0,0,0.5)') newName = 'overlay50';
    if (normalized === 'rgba(0,0,0,0.6)') newName = 'overlay60';
    if (normalized === 'rgba(255,255,255,0.2)') newName = 'lightOverlay20';
  } else {
    newName = 'color' + colorValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  }
  
  newColorsToAdd[normalized] = { name: newName, original: colorValue };
  existingColors[normalized] = newName;
  return newName;
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
    let hasChanges = false;

    // Match any hex strings like '#333' or '#FFFFFF'
    const hexRegex = /['"](#[a-fA-F0-9]{3,8})['"]/g;
    content = content.replace(hexRegex, (match, hexVal) => {
      hasChanges = true;
      const colorName = getColorName(hexVal);
      return `Colors.${colorName}`;
    });

    // Match any rgba strings like 'rgba(0, 0, 0, 0.5)'
    const rgbaRegex = /['"](rgba?\([^)]+\))['"]/g;
    content = content.replace(rgbaRegex, (match, rgbaVal) => {
      hasChanges = true;
      const colorName = getColorName(rgbaVal);
      return `Colors.${colorName}`;
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
      console.log(`Updated all colors in ${path.relative(__dirname, filePath)}`);
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

if (Object.keys(newColorsToAdd).length > 0) {
  const insertIndex = colorsContent.lastIndexOf('}');
  let appendStr = "";
  for (const key in newColorsToAdd) {
    appendStr += `  ${newColorsToAdd[key].name}: '${newColorsToAdd[key].original}',\n`;
  }
  colorsContent = colorsContent.slice(0, insertIndex) + appendStr + colorsContent.slice(insertIndex);
  fs.writeFileSync(colorsFile, colorsContent, 'utf8');
  console.log(`Added ${Object.keys(newColorsToAdd).length} new colors to global colors.ts`);
}

console.log('Done refactoring all remaining colors.');
