import codecs
import re

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    text = f.read()

slug = "'how-to-write-resume-step-by-step'"
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
# We want to find the image objects and append templatePreview after them.

patterns = [
    {
        "src": r"/images/Resume Tutorial/Reume Sample\.png",
        "alt": r"Professional Resume Sample Overview",
        "templateId": "modern",
        "cta": "Start with this high-impact, ATS-optimized layout for your own resume."
    },
    {
        "src": r"/images/Resume Tutorial/Resume Sample 1\.png",
        "alt": r"Alternative Resume Sample",
        "templateId": "professional",
        "cta": "Perfect for experienced professionals looking for a clean, sophisticated header and clear hierarchy."
    },
    {
        "src": r"/images/Resume Tutorial/Reume Sample\.png",
        "alt": r"Complete Resume Outline Visualization",
        "templateId": "modern",
        "cta": "Ready to build yours? Click below to use this exact structure and get hired faster."
    }
]

def add_preview(content, pattern_info):
    # Regex to find the object block
    # We look for source, then alt, then content, then closing brace.
    regex = rf"([\s\S]*?src:\s*['\"]{pattern_info['src']}['\"],[\s\S]*?alt:\s*['\"]{pattern_info['alt']}['\"],[\s\S]*?content:\s*['\"][\s\S]*?['\"]\s*}})"
    
    match = re.search(regex, content)
    if not match:
        print(f"Match FAILED for {pattern_info['alt']}")
        return content
    
    matched_block = match.group(1)
    # Check if already has templatePreview after it
    # We look at the rest of the content after the match.
    remaining = content[match.end():]
    if "templatePreview" in remaining[:100]:
        print(f"Skipping {pattern_info['alt']}, already has preview.")
        return content
        
    insertion = f""",
            {{
                type: 'templatePreview',
                templateId: '{pattern_info['templateId']}',
                content: '{pattern_info['cta']}'
            }}"""
            
    # We insert at the end of the match
    print(f"Inserting preview for {pattern_info['alt']}")
    return content[:match.end()] + insertion + remaining

modified_content = post_content
for p in patterns:
    modified_content = add_preview(modified_content, p)

new_text = text[:content_start] + modified_content + text[array_end+1:]

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(new_text)

print("Done")
