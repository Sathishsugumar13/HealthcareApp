
const fs = require('fs');

let homeContent = fs.readFileSync('src/components/HomeComponent/HomeComponent.tsx', 'utf-8');

const componentsToInline = [
    { name: 'AppointmentCard', path: 'src/components/Common/AppointmentCard/AppointmentCard.tsx', importPath: '../Common/AppointmentCard/AppointmentCard' },
    { name: 'ArticleCard', path: 'src/components/Common/ArticleCard/ArticleCard.tsx', importPath: '../Common/ArticleCard/ArticleCard' },
    { name: 'HospitalCard', path: 'src/components/Common/HospitalCard/HospitalCard.tsx', importPath: '../Common/HospitalCard/HospitalCard' },
    { name: 'PharmacyCard', path: 'src/components/Common/PharmacyCard/PharmacyCard.tsx', importPath: '../Common/PharmacyCard/PharmacyCard' },
    { name: 'SectionHeader', path: 'src/components/Common/SectionHeader/SectionHeader.tsx', importPath: '../Common/SectionHeader/SectionHeader' }
];

let appendedCode = '';

for (const comp of componentsToInline) {
    let compContent = fs.readFileSync(comp.path, 'utf-8');
    
    
    compContent = compContent.replace(/import .*?;\n/g, '');
    compContent = compContent.replace(/import .*?\n/g, '');
    
    // Replace 'export default function' with 'function'
    compContent = compContent.replace('export default function ' + comp.name, 'function ' + comp.name);
    
    
    const styleName = comp.name.charAt(0).toLowerCase() + comp.name.slice(1) + 'Styles';
    compContent = compContent.replace(/const styles = StyleSheet\.create/g, 'const ' + styleName + ' = StyleSheet.create');
    
    
    compContent = compContent.replace(/styles\./g, styleName + '.');
    
    
    
    
    
    compContent = compContent.replace(/\.\.\/\.\.\/\.\.\/theme/g, '../../theme');
    compContent = compContent.replace(/\.\.\/\.\.\/\.\.\/assets/g, '../../assets');
    
    appendedCode += '\n' + compContent + '\n';
    
    
    const importRegex = new RegExp('import ' + comp.name + ' from \\\'' + comp.importPath + '\\\';\\\n');
    homeContent = homeContent.replace(importRegex, '');
}

// Append the new code to HomeComponent
homeContent += appendedCode;

fs.writeFileSync('src/components/HomeComponent/HomeComponent.tsx', homeContent);
console.log('Merged successfully');

