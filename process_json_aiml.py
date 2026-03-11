import sys
import re
import json

file_path = r'l:\CVArchitect\Bullets\Technology\AI_Machine_Learning.md'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Parse JSON at the bottom
json_start = -1
match = re.search(r'\[\s*\{', text)
if match:
    json_start = match.start()

json_bullets = []
text_no_json = text

if json_start != -1:
    json_str = text[json_start:]
    json_str = json_str.strip()
    if json_str.endswith('},'):
        json_str = json_str[:-1] + ']'
    elif not json_str.endswith(']'):
        json_str += '\n]'
        
    try:
        json_bullets = json.loads(json_str)
        text_no_json = text[:json_start]
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        if json_str.endswith('}'):
             json_str += ']'
             try:
                 json_bullets = json.loads(json_str)
                 text_no_json = text[:json_start]
             except Exception as e2:
                 print(f"Failed again: {e2}")

# 2. Extract existing bullets
header_match = re.search(r'^(.*?)\n---\n', text_no_json, re.DOTALL)
header = header_match.group(1).strip() + '\n\n---\n\n' if header_match else "# AI / Machine Learning\n\n**Industry ID:** `ai-ml` | **Prefix:** `AIML` | **Target:** 400 bullets\n\n---\n\n"

bullet_matches = re.finditer(r'### AIML-\d+\s*\n(.*?)(?=\n### AIML-\d+|\Z)', text_no_json, re.DOTALL)
unique_bullets = []
seen = set()

for match in bullet_matches:
    content = match.group(1).strip()
    content = re.sub(r'\n# .*?(\n|$)', '\n', content)
    content = re.sub(r'\n## .*?(\n|$)', '\n', content)
    content = content.strip()
    
    if content and content not in seen:
        seen.add(content)
        unique_bullets.append(content)

# 3. Convert JSON bullets to Markdown and add to list
added_count = 0
for jb in json_bullets:
    role = jb.get('role', 'machine-learning-engineer')
    theme = jb.get('theme', 'theme')
    seniority = jb.get('seniority', 'mid')
    verb_ctx = jb.get('verb_context', 'systems')
    kw = ", ".join(jb.get('keywords', []))
    scope = jb.get('scope', '')
    result = jb.get('result', '')
    variations = jb.get('variations', [])
    vars_dict = jb.get('variables', {})
    
    md = f"**Role:** {role} | **Theme:** {theme} | **Seniority:** {seniority} | **Verb Context:** {verb_ctx}\n"
    md += f"**Keywords:** {kw}\n\n"
    md += f"**Scope:** {scope}\n"
    md += f"**Result:** {result}\n\n"
    md += f"**Variations:**\n"
    labels = ["A (Standard)", "B (Result-first)", "C (Impact-led)", "D (Concise)"]
    for i, var_text in enumerate(variations):
        label = labels[i] if i < len(labels) else f"Var {i+1}"
        md += f"- **{label}:** {var_text}\n"
    
    md += f"\n**Variables:**\n"
    for v_name, v_data in vars_dict.items():
        v_min = v_data.get('min', 0)
        v_max = v_data.get('max', 0)
        v_step = v_data.get('step', 1)
        v_type = v_data.get('type', 'integer')
        md += f"  - `{{{v_name}}}`: {v_min} to {v_max}, step {v_step} ({v_type})\n"
        
    md = md.strip()
    if md not in seen:
        seen.add(md)
        unique_bullets.append(md)
        added_count += 1

# 4. Rewrite file
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(header)
    for i, blk in enumerate(unique_bullets, 1):
        f.write(f"### AIML-{i:04d}\n")
        f.write(blk)
        f.write('\n\n')

print(f"Added {added_count} JSON bullets.")
print(f"Total bullets after processing: {len(unique_bullets)}")
