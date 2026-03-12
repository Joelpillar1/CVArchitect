import re

file_path = 'l:/CVArchitect/utils/blogData.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of the data array
start_marker = 'export const blogPosts: BlogPost[] = ['
start_pos = content.find(start_marker)
if start_pos == -1:
    print("Could not find blogPosts array")
    exit()

data = content[start_pos:]

# Split by objects starting with { slug:
# We'll use a regex to split so we get the text between slugs
posts = re.split(r'\{\s*slug:', data)

found = []

for post in posts[1:]:
    # Extract the slug
    slug_match = re.search(r"['\"]([^'\"]+)['\"]", post)
    if not slug_match:
        continue
    
    slug = slug_match.group(1)
    # Count occurrences of templatePreview in this post's content
    # We look for it as a type value
    matches = re.findall(r"type:\s*['\"]templatePreview['\"]", post)
    if matches:
        found.append((slug, len(matches)))

print("Posts containing 'Use this template' (templatePreview):")
if not found:
    print("None found in the actual data array.")
else:
    for slug, count in found:
        print(f"- {slug} ({count} occurrence(s))")
