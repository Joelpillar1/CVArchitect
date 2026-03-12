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

# 1. Add Chronological Sample after Format 1 paragraph (around line 500)
# Search for: ATS was built for.'
# 2. Add Functional Sample after Format 2 paragraph (around line 560)
# Search for: risky choice for online applications.'
# 3. Add Hybrid Sample after Format 3 paragraph (around line 615)
# Search for: parser front and center for the parser.'

replacements = [
    {
        "search": "This is the format ATS was built for.'\n            },",
        "replace": """This is the format ATS was built for.'
            },
            {
                type: 'image',
                src: '/images/Resume Tutorial/Reume Sample.png',
                alt: 'Chronological Resume Format Sample',
                content: 'The most popular resume format which focuses on career progression and timeline.'
            },
            {
                type: 'templatePreview',
                templateId: 'modern',
                showPreview: true,
                content: 'Use our Modern Chronological template for a layout that recruiters and ATS systems love.'
            },"""
    },
    {
        "search": "risky choice for online applications.'\n            },",
        "replace": """risky choice for online applications.'
            },
            {
                type: 'image',
                src: '/images/Resume Tutorial/Experience.png',
                alt: 'Functional Resume Format Sample',
                content: 'Functional layouts often obscure timelines, which can make recruiters suspicious.',
                crossedOut: true
            },"""
    },
    {
        "search": "front and center for the parser.'\n            },",
        "replace": """front and center for the parser.'
            },
            {
                type: 'image',
                src: '/images/Resume Tutorial/Resume Sample 1.png',
                alt: 'Hybrid Resume Format Sample',
                content: 'A hybrid format balances high-impact skills with a standard chronological work history.'
            },
            {
                type: 'templatePreview',
                templateId: 'professional',
                showPreview: true,
                content: 'Try the Professional Hybrid template to highlight your skills without hiding your experience.'
            },"""
    }
]

modified_content = post_content
for r in replacements:
    if r["search"] in modified_content:
        modified_content = modified_content.replace(r["search"], r["replace"])
        print(f"Replaced: {r['search'][:30]}...")
    else:
        print(f"FAILED to find: {r['search'][:30]}...")

new_text = text[:content_start] + modified_content + text[array_end+1:]

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(new_text)

print("Done")
