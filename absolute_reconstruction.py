import codecs
import re

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    text = f.read()

# 1. Identify the blogPosts array content
start_marker = "export const blogPosts: BlogPost[] = ["
end_marker = "];"
start_idx = text.find(start_marker)
end_idx = text.rfind(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found")
    exit()

posts_text = text[start_idx + len(start_marker) : end_idx]

# 2. Extract posts using a non-greedy approach looking for slug: '...'
# Each post usually starts with { and ends with }, (mostly)
# I'll find all slug indices
slug_pattern = r"slug:\s*'([^']+)'"
matches = list(re.finditer(slug_pattern, posts_text))

extracted_posts = []
seen_slugs = set()

for i, match in enumerate(matches):
    slug = match.group(1)
    if slug in seen_slugs:
        continue
    seen_slugs.add(slug)
    
    # Find the start of the object { before this slug
    post_start = posts_text.rfind("{", 0, match.start())
    
    # Find the end of this object
    if i < len(matches) - 1:
        # Find the start of the NEXT post (the { before the next slug)
        next_slug_pos = matches[i+1].start()
        post_end = posts_text.rfind("{", post_start, next_slug_pos)
        # Actually, it's safer to find the } that balances the first {
    
    # Alternative: Use bracket counting
    post_body = ""
    bracket_depth = 0
    for j in range(post_start, len(posts_text)):
        if posts_text[j] == '{':
            bracket_depth += 1
        elif posts_text[j] == '}':
            bracket_depth -= 1
            if bracket_depth == 0:
                # Found the end of the post object
                # Check for trailing comma
                potential_comma = posts_text.find(",", j)
                if potential_comma != -1 and potential_comma - j < 5:
                    post_end = potential_comma + 1
                else:
                    post_end = j + 1
                post_body = posts_text[post_start:post_end]
                break
    
    # Clean up CTAs in post_body and add one at the end
    # Find content array
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
            
            # Remove existing templatePreview
            tp_pattern = r"\s*\{\s*type:\s*'templatePreview'.*?\},?\s*"
            clean_array = re.sub(tp_pattern, "\n            ", content_array, flags=re.DOTALL)
            clean_array = clean_array.replace("},,", "},").replace("}, ,", "},")
            
            # Add final CTA
            template_id = 'student' if 'student' in slug else 'modern'
            show_preview = "true" if slug in ['best-resume-templates-2026', 'best-resume-format-2026'] else "false"
            
            final_cta = f"""{{
                type: 'templatePreview',
                templateId: '{template_id}',
                {"showPreview: true," if show_preview == "true" else ""}
                content: 'Ready to build your high-converting resume? Choose from our ATS-optimized templates and get started in seconds.'
            }}"""
            
            # Insert before last ]
            last_b = clean_array.rfind("]")
            final_array = clean_array[:last_b].rstrip().rstrip(',') + ",\n            " + final_cta + "\n        ]"
            
            post_body = post_body[:c_start] + final_array + post_body[c_end+1:]
            
    extracted_posts.append(post_body.strip().rstrip(','))

# 4. Reconstruct the file
new_posts_block = ",\n    ".join(extracted_posts)
new_text = text[:start_idx + len(start_marker)] + "\n    " + new_posts_block + "\n];" + text[end_idx + len(end_marker):]

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(new_text)

print("Absolute Reconstruction and Deduplication successful")
