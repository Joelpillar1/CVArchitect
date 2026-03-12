import codecs
import re

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    text = f.read()

# Standard CTA content
cta_content = "Ready to build your high-converting resume? Choose from our ATS-optimized templates and get started in seconds."

# We want to find every 'content: [' block and:
# 1. Remove all templatePreview objects from it.
# 2. Add one at the end.

# Regex to find each post
# A post starts with { and ends with }, and has a slug
posts = re.split(r'\},?\s*\{', text)
# This split is too unreliable.

# I'll use the unique slugs I found earlier.
slugs = [
    'student-resumes-with-no-experience',
    'how-to-beat-ats-resume-2026',
    'best-resume-format-2026',
    'ai-resume-builder-vs-traditional',
    'resume-keywords-that-get-you-hired',
    'cover-letter-guide-2026',
    'resume-mistakes-to-avoid',
    'best-resume-templates-2026',
    'student-resume-no-experience-guide',
    'how-to-write-resume-step-by-step',
    'free-resume-builder-comparison-2026',
    'resume-examples-by-industry-2026'
]

def fix_post(slug, current_text):
    s_marker = f"slug: '{slug}'"
    pos = current_text.find(s_marker)
    if pos == -1: return current_text
    
    # Find content array
    c_start = current_text.find("content: [", pos)
    if c_start == -1: return current_text
    
    # Find end of content array
    depth = 0
    c_end = -1
    for i in range(c_start + 9, len(current_text)):
        if current_text[i] == '[': depth += 1
        elif current_text[i] == ']':
            if depth == 0:
                c_end = i
                break
            else:
                depth -= 1
    
    if c_end == -1: return current_text
    
    content_block = current_text[c_start:c_end+1]
    
    # 1. Remove existing templatePreview
    # Match { ... type: 'templatePreview' ... }
    # Using a more robust regex for the object
    tp_pattern = r"\s*\{\s*type:\s*'templatePreview'.*?\}(?=\s*(?:,|\s*\]))"
    clean_content = re.sub(tp_pattern, "", content_block, flags=re.DOTALL)
    
    # Clean up double commas
    clean_content = clean_content.replace(",,", ",").replace(", ,", ",")
    # Remove comma before ]
    clean_content = re.sub(r",\s*\]", "\n        ]", clean_content)
    
    # 2. Add final CTA
    template_id = 'student' if 'student' in slug else 'modern'
    show_preview = "showPreview: true," if slug in ['best-resume-templates-2026', 'best-resume-format-2026'] else ""
    
    final_cta = f"""{{
                type: 'templatePreview',
                templateId: '{template_id}',
                {show_preview}
                content: '{cta_content}'
            }}"""
            
    last_bracket = clean_content.rfind("]")
    modified_content = clean_content[:last_bracket].rstrip().rstrip(',') + ",\n            " + final_cta + "\n        ]"
    
    return current_text[:c_start] + modified_content + current_text[c_end+1:]

for s in slugs:
    text = fix_post(s, text)

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(text)

print("Simplified CTA cleanup done")
