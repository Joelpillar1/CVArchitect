import re

with open('l:/CVArchitect/utils/blogData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all blocks that look like blog post objects
# We split by 'slug:' and then check each segment
segments = content.split('slug:')
found_slugs = []

for i in range(1, len(segments)):
    segment = segments[i]
    # Extract the slug (it's the first thing after 'slug:')
    slug_match = re.search(r"['\"]([^'\"]+)['\"]", segment)
    if slug_match:
        slug = slug_match.group(1)
        # Check if templatePreview is in the content array of this post
        # We look for "type: 'templatePreview'" or similar
        if re.search(r"type:\s*['\"]templatePreview['\"]", segment):
            found_slugs.append(slug)

print("Posts with 'Use this template' button:")
for s in found_slugs:
    print(f"- {s}")
