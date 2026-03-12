import re

with open('l:/CVArchitect/utils/blogData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

segments = content.split('slug:')
results = []

for i in range(1, len(segments)):
    segment = segments[i]
    slug_match = re.search(r"['\"]([^'\"]+)['\"]", segment)
    if slug_match:
        slug = slug_match.group(1)
        has_button = bool(re.search(r"type:\s*['\"]templatePreview['\"]", segment))
        results.append((slug, has_button))

print(f"{'SLUG':<45} | {'BUTTON?'}")
print("-" * 55)
for slug, has_button in results:
    print(f"{slug:<45} | {has_button}")
