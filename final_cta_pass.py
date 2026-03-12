import codecs
import re

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    text = f.read()

start_marker = "export const blogPosts: BlogPost[] = ["
end_marker = "];"
start_idx = text.find(start_marker)
end_idx = text.rfind(end_marker)

posts_text = text[start_idx + len(start_marker) : end_idx]
slug_pattern = r"slug:\s*'([^']+)'"
matches = list(re.finditer(slug_pattern, posts_text))

extracted_posts = []

for i, match in enumerate(matches):
    slug = match.group(1)
    post_start = posts_text.rfind("{", 0, match.start())
    
    post_body = ""
    bracket_depth = 0
    post_end = -1
    for j in range(post_start, len(posts_text)):
        if posts_text[j] == '{':
            bracket_depth += 1
        elif posts_text[j] == '}':
            bracket_depth -= 1
            if bracket_depth == 0:
                potential_comma = posts_text.find(",", j)
                if potential_comma != -1 and potential_comma - j < 5:
                    post_end = potential_comma + 1
                else:
                    post_end = j + 1
                post_body = posts_text[post_start:post_end]
                break
    
    if not post_body: continue

    # Process content
    c_start = post_body.find("content: [")
    if c_start != -1:
        c_bracket_depth = 0
        c_end = -1
        for k in range(c_start + 9, len(post_body)):
            if post_body[k] == '[':
                c_bracket_depth += 1
            elif post_body[k] == ']':
                if c_bracket_depth == 0:
                    c_end = k
                    break
                else:
                    c_bracket_depth -= 1
        
        if c_end != -1:
            content_array = post_body[c_start:c_end+1]
            
            # Extract templateId if it exists in the OLD content
            tid_match = re.search(r"templateId:\s*'([^']+)'", content_array)
            template_id = tid_match.group(1) if tid_match else ('student' if 'student' in slug else 'modern')
            
            # Remove all existing templatePreview
            tp_pattern = r"\s*\{\s*type:\s*'templatePreview'.*?\},?\s*"
            clean_array = re.sub(tp_pattern, "\n            ", content_array, flags=re.DOTALL)
            clean_array = clean_array.replace("},,", "},").replace("}, ,", "},")
            
            # Final CTA
            show_preview = "true" if slug in ['best-resume-templates-2026', 'best-resume-format-2026'] else "false"
            
            final_cta = f"""{{
                type: 'templatePreview',
                templateId: '{template_id}',
                {"showPreview: true," if show_preview == "true" else ""}
                content: 'Ready to build your high-converting resume? Choose from our ATS-optimized templates and get started in seconds.'
            }}"""
            
            last_b = clean_array.rfind("]")
            final_array = clean_array[:last_b].rstrip().rstrip(',') + ",\n            " + final_cta + "\n        ]"
            post_body = post_body[:c_start] + final_array + post_body[c_end+1:]
            
    extracted_posts.append(post_body.strip().rstrip(','))

new_posts_block = ",\n    ".join(extracted_posts)
new_text = text[:start_idx + len(start_marker)] + "\n    " + new_posts_block + "\n];" + text[end_idx + len(end_marker):]

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(new_text)

print("Final All-Post CTA cleanup done")
