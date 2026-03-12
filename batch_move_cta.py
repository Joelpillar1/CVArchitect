import codecs
import re

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    text = f.read()

# Define the slugs we want to check/modify
slugs = [
    'how-to-beat-ats-resume-2026',
    'best-resume-format-2026',
    'student-resume-no-experience-guide',
    'how-to-write-resume-step-by-step',
    'best-resume-templates-2026'
]

def get_post_content_indices(slug, full_text):
    slug_str = f"slug: '{slug}'"
    post_start = full_text.find(slug_str)
    if post_start == -1: return None, None
    
    content_start = full_text.find("content: [", post_start)
    if content_start == -1: return None, None
    
    bracket_depth = 0
    array_end = -1
    for i in range(content_start + 9, len(full_text)):
        if full_text[i] == '[':
            bracket_depth += 1
        elif full_text[i] == ']':
            if bracket_depth == 0:
                array_end = i
                break
            else:
                bracket_depth -= 1
    
    return content_start, array_end

for slug in slugs:
    start, end = get_post_content_indices(slug, text)
    if start is None or end is None:
        print(f"Post {slug} not found")
        continue
    
    post_content = text[start:end+1]
    
    # 1. Remove all existing templatePreview objects
    # This pattern matches { ... type: 'templatePreview' ... } including optional dangling commas
    tp_pattern = r"\s*\{\s*type:\s*'templatePreview'.*?\},?\s*"
    post_content_clean = re.sub(tp_pattern, "\n            ", post_content, flags=re.DOTALL)
    
    # Clean up double commas that might have been left behind
    post_content_clean = post_content_clean.replace("},,", "},")
    
    # 2. Determine templateId (default to modern unless it's a student post)
    template_id = 'student' if 'student' in slug else 'modern'
    show_preview = "true" if slug in ['best-resume-templates-2026', 'best-resume-format-2026'] else "false"
    
    # Extra check: user wants "no preview" for student posts unless otherwise specified
    # For now, I'll stick to the rule from previous requests: 
    # - "student-resumes-with-no-experience" -> no preview (button only)
    # - "best-resume-templates-2026" -> show preview
    
    # Define the final CTA
    final_cta = f"""
            {{
                type: 'templatePreview',
                templateId: '{template_id}',
                {"showPreview: true," if show_preview == "true" else ""}
                content: 'Ready to build your high-converting resume? Choose from our ATS-optimized templates and get started in seconds.'
            }}
        ]"""
    
    # Find the last closing bracket of the content array
    last_bracket = post_content_clean.rfind("]")
    if last_bracket != -1:
        # Strip trailing commas/spaces before adding the new one
        head = post_content_clean[:last_bracket].rstrip().rstrip(',')
        modified_post_content = head + ",\n" + final_cta
        
        # Replace in full text
        text = text[:start] + modified_post_content + text[end+1:]
        print(f"Updated {slug}")

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(text)

print("Batch update done")
