import re

with open('l:/CVArchitect/utils/blogData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

segments = content.split('slug:')
output = []
for i in range(1, len(segments)):
    segment = segments[i]
    slug_match = re.search(r"['\"]([^'\"]+)['\"]", segment)
    if slug_match:
        slug = slug_match.group(1)
        # Only count it as having a button if it's in the actual array data, 
        # not the interface definition at the top (though split('slug:') handles that mostly)
        has_button = "type: 'templatePreview'" in segment or 'type: "templatePreview"' in segment
        output.append(f"{slug} | {has_button}")

with open('l:/CVArchitect/summary.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(output))
