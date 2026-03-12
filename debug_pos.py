import codecs

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    text = f.read()

slug = "'student-resumes-with-no-experience'"
post_start = text.find(slug)
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

last_brace = text.rfind('}', content_start, array_end)

print(f"Slug found at pos {post_start}")
print(f"Content start at pos {content_start}")
print(f"Array end at pos {array_end}")
print(f"Last brace at pos {last_brace}")

# Get line number for last_brace
lines = text[:last_brace].split('\n')
print(f"Last brace is on line {len(lines)}")
