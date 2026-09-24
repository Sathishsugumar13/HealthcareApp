
import re

with open('src/components/HomeComponent/HomeComponent.tsx', 'r') as f:
    text = f.read()

# Find the start of the appended code
index = text.find('function AppointmentCard({')

if index != -1:
    # Get the original text before the appended part
    text = text[:index]
    
    # We need to make sure the original styles block is closed.
    # The original file ended with }); for the styles.
    # Let's check if it ends with });
    text = text.strip()
    if not text.endswith('});'):
        if text.endswith('}'):
            text += ');'
        else:
            text += '\n});'
            
    # Add back the imports at the top
    imports_to_add = '''import AppointmentCard from '../Common/AppointmentCard/AppointmentCard';
import ArticleCard from '../Common/ArticleCard/ArticleCard';
import HospitalCard from '../Common/HospitalCard/HospitalCard';
import PharmacyCard from '../Common/PharmacyCard/PharmacyCard';
import SectionHeader from '../Common/SectionHeader/SectionHeader';
'''
    text = text.replace('import { Colors } from ''../../theme/colors'';', 'import { Colors } from ''../../theme/colors'';\n' + imports_to_add)

    with open('src/components/HomeComponent/HomeComponent.tsx', 'w') as f:
        f.write(text)

