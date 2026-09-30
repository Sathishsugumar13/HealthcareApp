import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all style={{ ... }}
    matches = re.finditer(r'style=\{\{\s*([^}]+)\s*\}\}', content)
    
    replacements = []
    styles_to_add = {}
    
    for match in matches:
        style_content = match.group(1).strip()
        # Skip dynamic styles
        if '?' in style_content or '&&' in style_content or '||' in style_content or '${' in style_content:
            continue
            
        # Name generation
        name = "inline" + "".join([c for c in style_content.title() if c.isalnum()])
        if "Width48" in name: name = "spacerWidth48"
        elif "Height20" in name: name = "spacerHeight20"
        elif "Height30" in name: name = "spacerHeight30"
        elif "Height40" in name: name = "spacerHeight40"
        elif "Height80" in name: name = "spacerHeight80"
        elif "Flex1" in name and len(name) < 15: name = "flex1"
        
        if len(name) > 30:
            name = name[:30]
            
        styles_to_add[name] = style_content
        replacements.append((match.group(0), f'style={{styles.{name}}}'))
        
    if not replacements:
        return
        
    new_content = content
    for old, new in replacements:
        new_content = new_content.replace(old, new, 1)
        
    stylesheet_match = re.search(r'StyleSheet\.create\(\{', new_content)
    if stylesheet_match:
        insert_pos = stylesheet_match.end()
        styles_str = "\n"
        for name, props in styles_to_add.items():
            styles_str += f"  {name}: {{ {props} }},\n"
            
        new_content = new_content[:insert_pos] + styles_str + new_content[insert_pos:]
    else:
        # If StyleSheet is not found, skip
        print(f"Skipping {filepath} (No StyleSheet.create found)")
        return
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Refactored inline styles in {filepath}")

src_dir = os.path.join('src')
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if (file.endswith('.tsx') or file.endswith('.ts')) and not file.endswith('.d.ts'):
            try:
                process_file(os.path.join(root, file))
            except Exception as e:
                print(f"Error processing {file}: {e}")

print("Done")
