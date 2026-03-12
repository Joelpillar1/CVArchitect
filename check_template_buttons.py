import re

file_path = 'l:/CVArchitect/utils/blogData.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of the blogPosts array
start_marker = 'export const blogPosts: BlogPost[] = ['
start_pos = content.find(start_marker)
if start_pos == -1:
    print("Could not find blogPosts array")
    exit()

array_content = content[start_pos:]

# Regex to find each blog post object roughly
# We split by 'slug:' which every post must have
sections = array_content.split('slug:')

results = []
for section in sections[1:]:
    # Get the slug
    slug_match = re.search(r"['\"]([^'\"]+)['\"]", section)
    if slug_match:
        slug = slug_match.group(1)
        # Check if it has templatePreview as a section type
        if "'templatePreview'" in section or '"templatePreview"' in section:
            results.append(slug)

print(f"Total blog posts found: {len(sections)-1}")
print("Blog posts containing 'Use this template' (templatePreview):")
for r in sorted(list(set(results))):
    print(f"  - {r}")
