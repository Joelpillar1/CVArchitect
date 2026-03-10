import re

file_path = r'l:\CVArchitect\Bullets\Technology_Bullets.md'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Identify all sections
# We'll split the file by # X. headers to handle sections independently
sections = re.split(r'(?=# \d+\. )', content)
header = sections[0]
body_sections = sections[1:]

processed_sections = []
total_bullets = 0

for section in body_sections:
    # Find the prefix for this section
    prefix_match = re.search(r'\*\*Prefix:\*\* `([A-Z0-9]+)`', section)
    if not prefix_match:
        processed_sections.append(section)
        continue
    
    prefix = prefix_match.group(1)
    
    # Extract all bullets in this section
    # A bullet starts with ### PREFIX-XXXX and ends before the next ### or # or ---
    bullet_pattern = f'(### {prefix}-([0-9]+).*?)(?=### {prefix}-|# |---|\Z)'
    bullets = re.findall(bullet_pattern, section, re.DOTALL)
    
    if not bullets:
        processed_sections.append(section)
        continue
    
    # Renumber them sequentially
    new_bullets = []
    for i, (bullet_text, old_num) in enumerate(bullets, 1):
        # Replace the ID line
        new_id = f"### {prefix}-{i:04d}"
        # We replace the first occurrence of the old ID
        updated_text = re.sub(f'^### {prefix}-[0-9]+', new_id, bullet_text.strip(), count=1)
        new_bullets.append(updated_text + "\n\n---\n\n")
        total_bullets += 1
    
    # Reconstruct the section
    # Keep the sector header and info
    info_end = re.search(r'---', section)
    if info_end:
        section_head = section[:info_end.end()] + "\n\n"
    else:
        # Fallback if separator is missing
        section_head = re.split(r'### ', section)[0]
    
    processed_sections.append(section_head + "".join(new_bullets))

# Reconstruction
new_content = header + "".join(processed_sections)

# 2. Update Footer
# Remove any existing footer line
new_content = re.sub(r'\*Total bullets in this file:.*?\*', '', new_content).strip()
# Ensure there's a separator before footer
if not new_content.endswith('---'):
    new_content += "\n\n---\n"

new_content += f"\n*Total bullets in this file: {total_bullets} bullets across 9 Technology industries*\n"

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Renumbered bullets. Total count: {total_bullets}")
# Print per-prefix counts for verification
for prefix in ["TECH", "DATA", "PROD", "WEB3", "CYBER", "CLOUD", "AIML", "GAME", "TELCO"]:
    count = len(re.findall(f"### {prefix}-", new_content))
    print(f"- {prefix}: {count}")
