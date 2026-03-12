import re

with open('l:/CVArchitect/utils/blogData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Only look at the blogPosts array
start = content.find('export const blogPosts')
data = content[start:]

# Split by the start of each object
posts = data.split('{')
found = []
current_slug = None

for p in posts:
    # Find slug in this segment
    m = re.search(r"slug:\s*['\"]([^'\"]+)['\"]", p)
    if m:
        current_slug = m.group(1)
    
    # Check if this segment (or the next one before another slug) has the button
    # Actually, segments are split by '{', so we should check if 'type: 'templatePreview'' is in the segment
    if "type: 'templatePreview'" in p or 'type: "templatePreview"' in p:
        if current_slug and current_slug not in found:
            found.append(current_slug)

print("POSTS WITH THE BUTTON:")
for f in found:
    print(f"- {f}")
