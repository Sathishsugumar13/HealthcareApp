
import re

with open('src/components/HomeComponent/HomeComponent.tsx', 'r') as f:
    text = f.read()

# Merge all styles
style_blocks = re.findall(r'const styles\d* = StyleSheet\.create\(\{([\s\S]*?)\}\);', text)
merged_styles = '\n'.join(style_blocks)

# Remove all original style blocks
text = re.sub(r'const styles\d* = StyleSheet\.create\(\{[\s\S]*?\}\);', '', text)

# There might be some stylesx. left over from powershell replacement inside the blocks
merged_styles = re.sub(r'styles\d*\.', 'styles.', merged_styles)
text = re.sub(r'styles\d*\.', 'styles.', text)

# Add single merged style block at the end
text += '\nconst styles = StyleSheet.create({\n' + merged_styles + '\n});\n'

with open('src/components/HomeComponent/HomeComponent.tsx', 'w') as f:
    f.write(text)

