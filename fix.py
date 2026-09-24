
import re

with open('src/components/HomeComponent/HomeComponent.tsx', 'r') as f:
    text = f.read()

# Fix exports
text = text.replace('export default function AppointmentCard', 'function AppointmentCard')
text = text.replace('export default function ArticleCard', 'function ArticleCard')
text = text.replace('export default function HospitalCard', 'function HospitalCard')
text = text.replace('export default function PharmacyCard', 'function PharmacyCard')
text = text.replace('export default function SectionHeader', 'function SectionHeader')

# Merge all styles
style_blocks = re.findall(r'const styles = StyleSheet\.create\(\{([\s\S]*?)\}\);', text)
merged_styles = '\n'.join(style_blocks)

# Remove all original style blocks
text = re.sub(r'const styles = StyleSheet\.create\(\{[\s\S]*?\}\);', '', text)

# Add single merged style block at the end
text += '\nconst styles = StyleSheet.create({\n' + merged_styles + '\n});\n'

with open('src/components/HomeComponent/HomeComponent.tsx', 'w') as f:
    f.write(text)

