import re

file_path = 'l:/CVArchitect/utils/blogData.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Split the content into blog post objects
# We look for the start of the array and then split by the start of each object
start_marker = 'export const blogPosts: BlogPost[] = ['
start_pos = content.find(start_marker)
if start_pos == -1:
    print("Could not find blogPosts array")
    exit()

array_content = content[start_pos + len(start_marker):]

# A rough way to split objects: split by 'slug: '
# Since each post has a slug, the text between two 'slug:' occurrences is (mostly) one post
sections = array_content.split('slug:')
found = []

for section in sections[1:]:
    # Extract slug
    slug_match = re.search(r"['\"]([^'\"]+)['\"]", section)
    if slug_match:
        slug = slug_match.group(1)
        # Check if templatePreview is in the section
        if "'templatePreview'" in section or '"templatePreview"' in section:
            found.append(slug)

print(f"Total posts checked: {len(sections)-1}")
print(f"Posts with 'Use this template' (templatePreview):")
for s in found:
    print(f"  - {s}")
