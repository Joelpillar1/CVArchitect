import re
content = open('l:/CVArchitect/utils/blogData.ts', 'r', encoding='utf-8').read()
sections = content.split('slug:')
for section in sections[1:]:
    slug = section.splitlines()[0].strip().strip("',")
    if "'templatePreview'" in section:
        print(f"HAS_BUTTON: {slug}")
