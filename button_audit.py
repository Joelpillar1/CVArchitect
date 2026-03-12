import re

with open('l:/CVArchitect/utils/blogData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Only look at the blogPosts array
start = content.find('export const blogPosts: BlogPost[] = [')
data = content[start:]

# Split by objects starting with { slug:
# We look for "{ slug: '" or "{ slug: \""
posts = re.split(r'\{\s*slug:', data)

print("AUDIT OF BLOG POSTS FOR 'Use This Template' BUTTON:")
print("=" * 60)

for post in posts[1:]:
    # Extract slug
    slug_match = re.search(r"['\"]([^'\"]+)['\"]", post)
    if not slug_match: continue
    slug = slug_match.group(1)
    
    # Check for templatePreview
    # We want to find cases where it's in the 'content' array as { type: 'templatePreview', ... }
    has_button = bool(re.search(r"type:\s*['\"]templatePreview['\"]", post))
    
    status = "[X] HAS BUTTON" if has_button else "[ ] NO BUTTON"
    print(f"{status:<15} | {slug}")
