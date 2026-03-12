import codecs
import re

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    text = f.read()

cta_content = "Ready to build your high-converting resume? Choose from our ATS-optimized templates and get started in seconds."

# Fixed Slugs list based on what I see in the file
slugs = [
    'student-resumes-with-no-experience',
    'how-to-beat-ats-resume-2026',
    'best-resume-format-2026',
    'ai-resume-builder-vs-traditional',
    'best-resume-templates-2026',
    'student-resume-no-experience-guide',
    'how-to-write-resume-step-by-step'
]

def fix_post(slug, current_text):
    print(f"Processing {slug}...")
    s_marker = f"slug: '{slug}'"
    pos = current_text.find(s_marker)
    if pos == -1: 
        print(f"  Slug {slug} not found")
        return current_text
    
    c_start = current_text.find("content: [", pos)
    if c_start == -1:
        print(f"  Content not found for {slug}")
        return current_text
    
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
    
    if c_end == -1:
        print(f"  End of content not found for {slug}")
        return current_text
    
    content_block = current_text[c_start:c_end+1]
    
    # 1. Remove all existing templatePreview
    orig_len = len(content_block)
    tp_pattern = r"\s*\{\s*type:\s*'templatePreview'.*?\}(?=\s*(?:,|\s*\]))"
    clean_content = re.sub(tp_pattern, "", content_block, flags=re.DOTALL)
    print(f"  Removed templatePreviews. Diff: {orig_len - len(clean_content)}")
    
    clean_content = clean_content.replace(",,", ",").replace(", ,", ",")
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
    if last_bracket != -1:
        head = clean_content[:last_bracket].rstrip().rstrip(',')
        modified_content = head + ",\n            " + final_cta + "\n        ]"
        print(f"  Inserted final CTA for {slug}")
        return current_text[:c_start] + modified_content + current_text[c_end+1:]
    
    return current_text

for s in slugs:
    text = fix_post(s, text)

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(text)

print("Simplified CTA cleanup with debug done")
