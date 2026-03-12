import re
content = open('l:/CVArchitect/utils/blogData.ts', 'r', encoding='utf-8').read()
# Start after the interface definitions
data_start = content.find('export const blogPosts')
data_content = content[data_start:]
sections = data_content.split('slug:')
found = []
for section in sections[1:]:
    slug_match = re.search(r"['\"]([^'\"]+)['\"]", section)
    if slug_match:
        slug = slug_match.group(1)
        if "'templatePreview'" in section:
            found.append(slug)

print("FOUND_START")
for f in found:
    print(f)
print("FOUND_END")
