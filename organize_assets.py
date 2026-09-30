import os
import shutil
import re
from pathlib import Path

base_dir = Path(r"c:\Users\sathi\OneDrive\Desktop\Healthcare App\HealthcareApp")
images_dir = base_dir / "src" / "assets" / "images"

categories = {
    "articles": ["article_"],
    "doctors": ["doctor_", "dr_"],
    "hospitals": ["hospital_"],
    "onboarding": ["onboarding-"],
    "common": ["healthcare-logo", "home_doctor", "no_data", "splash-new"]
}

# Create folders
for cat in categories.keys():
    (images_dir / cat).mkdir(exist_ok=True)

# Move files and build a mapping
moved_files = {} # filename -> new_path_relative_to_images
for f in images_dir.iterdir():
    if f.is_file():
        name = f.name
        moved_to = None
        for cat, prefixes in categories.items():
            if any(name.startswith(p) for p in prefixes):
                moved_to = cat
                break
        
        if moved_to:
            new_path = images_dir / moved_to / name
            shutil.move(str(f), str(new_path))
            moved_files[name] = f"{moved_to}/{name}"
            print(f"Moved {name} to {moved_to}/")
        else:
            print(f"Skipped {name}")

# Update imports in all files
src_dir = base_dir / "src"

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".ts", ".tsx")):
            file_path = Path(root) / file
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                
            original_content = content
            for old_name, new_rel_path in moved_files.items():
                pattern = r"(assets/images/)" + re.escape(old_name)
                replacement = r"\1" + new_rel_path.replace('\\', '/')
                content = re.sub(pattern, replacement, content)
                
            if content != original_content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated references in {file_path.relative_to(base_dir)}")

print("Done organizing assets!")
