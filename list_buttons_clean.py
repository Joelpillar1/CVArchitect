import re

file_path = 'l:/CVArchitect/utils/blogData.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Locate the blogPosts array
start_match = re.search(r'export const blogPosts: BlogPost\[\] = \[', content)
if not start_match:
    print("Could not find blogPosts array")
    exit()

array_start = start_match.end()
# Split by identifying the start of each object { slug: ... }
post_blocks = content[array_start:].split('slug:')

print("BLOG POSTS WITH 'Use This Template' BUTTON:")
print("=========================================")

for block in post_blocks[1:]:
    slug_match = re.search(r"['\"]([^'\"]+)['\"]", block)
    if slug_match:
        slug = slug_match.group(1)
        # Check if templatePreview type section exists in this block
        if "'templatePreview'" in block or '"templatePreview"' in block:
            print(f"[X] {slug}")
        else:
            # Optionally print ones that don't have it for completeness
            # print(f"[ ] {slug}")
            pass
