import codecs
import re

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    content = f.read()

# Pattern to find the blog post with the specific slug
# and capture its content array
pattern = r"(slug:\s*'student-resumes-with-no-experience',[\s\S]*?content:\s*\[)([\s\S]*?)(\n\s*\])"

def add_template(match):
    prefix = match.group(1)
    body = match.group(2)
    suffix = match.group(3)
    
    # Check if templatePreview already exists
    if "'templatePreview'" in body or '"templatePreview"' in body:
        return match.group(0)
    
    # Add a comma to the last object if needed
    body = body.rstrip()
    if body and not body.endswith(','):
        body += ','
    
    new_entry = """
            {
                type: 'templatePreview',
                templateId: 'student',
                content: 'Ready to build your own? Use this ATS-optimized student template to get started instantly.'
            }"""
    return prefix + body + new_entry + suffix

new_content = re.sub(pattern, add_template, content, count=1)

if new_content != content:
    with codecs.open(file_path, 'w', 'utf-8') as f:
        f.write(new_content)
    print("Successfully updated the post.")
else:
    print("Could not find the target post or it was already updated.")
