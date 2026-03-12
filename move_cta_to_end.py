import codecs
import re

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    text = f.read()

slug = "'best-resume-format-2026'"
if slug not in text:
    print("Slug not found")
    exit()

post_start = text.find(slug)
content_start = text.find("content: [", post_start)
bracket_depth = 0
array_end = -1
for i in range(content_start + 9, len(text)):
    if text[i] == '[':
        bracket_depth += 1
    elif text[i] == ']':
        if bracket_depth == 0:
            array_end = i
            break
        else:
            bracket_depth -= 1

if array_end == -1:
    print("Array end not found")
    exit()

post_content = text[content_start:array_end+1]

# 1. Remove all templatePreview objects from the middle
# We look for templatePreview objects and remove them
template_preview_pattern = r"\s*\{\s*type:\s*'templatePreview'.*?\s*\},\s*"
cleaned_content = re.sub(template_preview_pattern, "\n            ", post_content, flags=re.DOTALL)

# 2. Add THE templatePreview at the very end (before the closing bracket)
final_cta = """
            {
                type: 'templatePreview',
                templateId: 'modern',
                showPreview: true,
                content: 'Ready to build your high-converting resume? Choose from our ATS-optimized templates and get started in seconds.'
            }
        ]"""

# Find the last ]
last_bracket = cleaned_content.rfind("]")
modified_content = cleaned_content[:last_bracket].rstrip() + "," + final_cta

new_text = text[:content_start] + modified_content + text[array_end+1:]

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(new_text)

print("Done")
