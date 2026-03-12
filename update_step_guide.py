import codecs

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    text = f.read()

# Post slug
slug = "'how-to-write-resume-step-by-step'"
if slug not in text:
    print("Slug not found")
    exit()

post_start = text.find(slug)
content_start = text.find("content: [", post_start)
# Find the end of this content array
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

# Identifiers for full resume samples
# 1. /images/Resume Tutorial/Reume Sample.png
# 2. /images/Resume Tutorial/Resume Sample 1.png

# We will replace these specific blocks by adding a templatePreview after them.

replacements = [
    {
        "search": """                src: '/images/Resume Tutorial/Reume Sample.png',
                alt: 'Professional Resume Sample Overview',
                content: 'A complete ATS-optimized resume sample showing the ideal structure for 2026.'
            }""",
        "replace": """                src: '/images/Resume Tutorial/Reume Sample.png',
                alt: 'Professional Resume Sample Overview',
                content: 'A complete ATS-optimized resume sample showing the ideal structure for 2026.'
            },
            {
                type: 'templatePreview',
                templateId: 'modern',
                content: 'Start with this high-impact, ATS-optimized layout for your own resume.'
            }"""
    },
    {
        "search": """                src: '/images/Resume Tutorial/Resume Sample 1.png',
                alt: 'Alternative Resume Sample',
                content: 'An alternative professional layout for a candidate with extensive experience.'
            }""",
        "replace": """                src: '/images/Resume Tutorial/Resume Sample 1.png',
                alt: 'Alternative Resume Sample',
                content: 'An alternative professional layout for a candidate with extensive experience.'
            },
            {
                type: 'templatePreview',
                templateId: 'professional',
                content: 'Perfect for experienced professionals looking for a clean, sophisticated header and clear hierarchy.'
            }"""
    },
    {
        "search": """                src: '/images/Resume Tutorial/Reume Sample.png',
                alt: 'Complete Resume Outline Visualization',
                content: 'A visual representation of the standard 2026 resume structure.'
            }""",
        "replace": """                src: '/images/Resume Tutorial/Reume Sample.png',
                alt: 'Complete Resume Outline Visualization',
                content: 'A visual representation of the standard 2026 resume structure.'
            },
            {
                type: 'templatePreview',
                templateId: 'modern',
                content: 'Ready to build yours? Click below to use this exact structure and get hired faster.'
            }"""
    }
]

modified_post_content = post_content
for r in replacements:
    if r["search"] in modified_post_content:
        modified_post_content = modified_post_content.replace(r["search"], r["replace"])
        print(f"Applied replacement for {r['search'][:50]}...")
    else:
        print(f"FAILED to find {r['search'][:50]}...")
        # Try a more loose match
        search_lines = r["search"].split('\n')
        src_line = search_lines[0].strip()
        if src_line in modified_post_content:
             print(f"Found partial match: {src_line}")

new_text = text[:content_start] + modified_post_content + text[array_end+1:]

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(new_text)

print("Done")
