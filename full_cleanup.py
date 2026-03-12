import codecs
import re

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    text = f.read()

# 1. Deduplicate by slug
slug_pattern = r"slug:\s*'([^']+)'"
slugs = re.findall(slug_pattern, text)

unique_slugs = []
seen = set()
for s in slugs:
    if s not in seen:
        unique_slugs.append(s)
        seen.add(s)
    else:
        print(f"Duplicate slug found: {s}")

# 2. Re-extract posts
# This is tricky without a real parser, but I can look for slug: '...' and then follow the structure.
# Or I can just manually remove the duplicate 'best-resume-templates-2026'.

# Find all occurrences of "slug: 'best-resume-templates-2026'"
target_slug = "slug: 'best-resume-templates-2026'"
indices = [m.start() for m in re.finditer(target_slug, text)]

if len(indices) > 1:
    print(f"Found {len(indices)} occurrences of {target_slug}")
    # We want to remove the second one.
    # A post starts with { and ends with }, (mostly)
    # Let's find the { before indices[1]
    second_start = text.rfind("{", 0, indices[1])
    
    # Let's find the end of this post.
    # It ends before the next slug: '...' starts.
    if len(indices) > 2: # unlikely for this specific case but good practice
        next_post_start = text.rfind("{", 0, indices[2])
    else:
        # Search for the next slug after indices[1]
        next_slug_search = re.search(r"slug:\s*'([^']+)'", text[indices[1]+len(target_slug):])
        if next_slug_search:
            next_slug_pos = indices[1] + len(target_slug) + next_slug_search.start()
            second_end = text.rfind("{", 0, next_slug_pos)
        else:
            # Last post?
            second_end = text.rfind("];", indices[1])
            
    # Clean up text by removing from second_start to second_end
    text = text[:second_start] + text[second_end:]
    print("Duplicate removed")

# 3. Batch move CTAs to the end for all posts
# I'll use the unique slugs list
posts_to_fix = [
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

for slug in posts_to_fix:
    start, end = get_post_content_indices(slug, text)
    if start is None or end is None: continue
    
    post_content = text[start:end+1]
    
    # Extract templateId if any exist
    tid_match = re.search(r"templateId:\s*'([^']+)'", post_content)
    template_id = tid_match.group(1) if tid_match else ('student' if 'student' in slug else 'modern')
    
    # Remove all existing templatePreview objects
    tp_pattern = r"\s*\{\s*type:\s*'templatePreview'.*?\},?\s*"
    post_content_clean = re.sub(tp_pattern, "\n            ", post_content, flags=re.DOTALL)
    
    # Add the single final one
    show_preview = "true" if slug in ['best-resume-templates-2026', 'best-resume-format-2026'] else "false"
    
    final_cta = f"""
            {{
                type: 'templatePreview',
                templateId: '{template_id}',
                {"showPreview: true," if show_preview == "true" else ""}
                content: 'Ready to build your high-converting resume? Choose from our ATS-optimized templates and get started in seconds.'
            }}
        ]"""
    
    last_bracket = post_content_clean.rfind("]")
    if last_bracket != -1:
        head = post_content_clean[:last_bracket].rstrip().rstrip(',')
        modified_post_content = head + ",\n" + final_cta
        text = text[:start] + modified_post_content + text[end+1:]
        print(f"Post-processed {slug}")

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(text)

print("Full cleanup done")
