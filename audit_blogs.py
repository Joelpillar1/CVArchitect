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
# This is a bit rough but works for this specific DS
post_blocks = content[array_start:].split('slug:')

print(f"{'SLUG':<40} | {'HAS BUTTON?':<12}")
print("-" * 55)

found_any = False
for block in post_blocks[1:]:
    # Extract slug
    slug_match = re.search(r"['\"]([^'\"]+)['\"]", block)
    if slug_match:
        slug = slug_match.group(1)
        # Check if templatePreview type section exists in this block
        has_button = "'templatePreview'" in block or '"templatePreview"' in block
        print(f"{slug:<40} | {str(has_button):<12}")
        if has_button:
            found_any = True

if not found_any:
    print("\nNo posts found with 'templatePreview'.")
