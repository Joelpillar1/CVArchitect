import re

file_path = 'l:/CVArchitect/utils/blogData.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for blog post start and end
# Posts are in the blogPosts array
start_marker = 'export const blogPosts: BlogPost[] = ['
start_pos = content.find(start_marker)
array_content = content[start_pos:]

# Split by slug as it's the unique identifier for each post
parts = array_content.split('slug:')
posts_with_button = []

for i in range(1, len(parts)):
    # Extract slug
    slug_match = re.search(r"['\"]([^'\"]+)['\"]", parts[i])
    if slug_match:
        slug = slug_match.group(1)
        # Check if templatePreview (the button section) is in this post's content
        # Note: parts[i] contains everything from 'slug:' until the next 'slug:'
        if "'templatePreview'" in parts[i] or '"templatePreview"' in parts[i]:
            posts_with_button.append(slug)

print("Blog posts that have the 'Use This Template' button:")
for slug in posts_with_button:
    print(f"- {slug}")
