const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const colorsFile = path.join(srcDir, 'theme', 'colors.ts');

let colorsContent = fs.readFileSync(colorsFile, 'utf8');

// Parse existing colors
const existingColors = {};
const colorMatchRegex = /([a-zA-Z0-9_]+):\s*['"](#[a-fA-F0-9]+|transparent|rgba?.*?)['"]/g;
let m;
while ((m = colorMatchRegex.exec(colorsContent)) !== null) {
  existingColors[m[2].toLowerCase()] = m[1];
}

let newColorsToAdd = {};

function getColorName(colorValue) {
  const lowerVal = colorValue.toLowerCase();
  if (existingColors[lowerVal]) return existingColors[lowerVal];
  
  // If not exists, generate a name
  let newName = 'color' + colorValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  newColorsToAdd[lowerVal] = { name: newName, original: colorValue };
  existingColors[lowerVal] = newName;
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
    let original = content;

    const colorPropRegex = /(color|backgroundColor|borderColor|borderTopColor|borderBottomColor|shadowColor|tintColor|selectionColor):\s*['"](#[a-fA-F0-9]+)['"]/g;
    
    let hasChanges = false;
    content = content.replace(colorPropRegex, (match, prop, colorVal) => {
      hasChanges = true;
      const colorName = getColorName(colorVal);
      return `${prop}: Colors.${colorName}`;
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
      console.log(`Updated colors in ${path.relative(__dirname, filePath)}`);
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

// Now update colors.ts
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

console.log('Done refactoring colors.');
