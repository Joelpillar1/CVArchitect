import codecs

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    text = f.read()

# Target post
slug = "'student-resumes-with-no-experience'"
if slug not in text:
    print("Slug not found.")
    exit()

# Find the start of the post
post_start = text.find(slug)
# Find the end of its content array
content_start = text.find("content: [", post_start)
array_end = -1
bracket_depth = 0
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
    print("Content end not found.")
    exit()

# Find the last closing brace before the end of the array
last_brace = text.rfind('}', content_start, array_end)
if last_brace == -1:
    print("Last brace not found.")
    exit()

# Insert the new preview object
new_entry = """,
            {
                type: 'templatePreview',
                templateId: 'student',
                content: 'Ready to build your own? Use this ATS-optimized student template to get started instantly.'
            }"""

new_text = text[:last_brace+1] + new_entry + text[last_brace+1:]

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(new_text)

print("Done.")
