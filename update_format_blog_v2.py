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

# Define patterns to search within post_content
patterns = [
    {
        "pattern": r"(content: 'This is the format ATS was built for\.')\s*\}",
        "insertion": """
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
            }"""
    },
    {
        "pattern": r"(content: 'Most ATS platforms parse functional resumes poorly\..*?risky choice for online applications\.')\s*\}",
        "insertion": """
            },
            {
                type: 'image',
                src: '/images/Resume Tutorial/Experience.png',
                alt: 'Functional Resume Format Sample',
                content: 'Functional layouts often obscure timelines, which can make recruiters suspicious.',
                crossedOut: true
            }"""
    },
    {
        "pattern": r"(content: '.*?front and center for the parser\.')\s*\}",
        "insertion": """
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
            }"""
    }
]

modified_content = post_content
for p in patterns:
    match = re.search(p["pattern"], modified_content)
    if match:
        # Replace the entire match including the closing brace
        # We append the insertion after the brace
        modified_content = modified_content[:match.end()-1] + "}" + p["insertion"] + modified_content[match.end():]
        print(f"Matched pattern: {p['pattern'][:40]}...")
    else:
        print(f"FAILED to match: {p['pattern'][:40]}...")

new_text = text[:content_start] + modified_content + text[array_end+1:]

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(new_text)

print("Done")
