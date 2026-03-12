import codecs

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    content = f.read()

# I want to find the object with slug 'student-resumes-with-no-experience'
# and add a templatePreview to the end of its content array.

target_slug = "slug: 'student-resumes-with-no-experience'"
if target_slug in content:
    # Find the start of this object
    start_pos = content.find(target_slug)
    # Find the end of the content array for this object
    # The content array starts with 'content: ['
    content_start = content.find('content: [', start_pos)
    # Find the closing bracket ']' for this content array
    # We need to find the one that corresponds to 'content: ['
    bracket_count = 0
    array_end = -1
    for i in range(content_start + 9, len(content)):
        if content[i] == '[':
            bracket_count += 1
        elif content[i] == ']':
            if bracket_count == 0:
                array_end = i
                break
            else:
                bracket_count -= 1
    
    if array_end != -1:
        new_entry = """            {
                type: 'templatePreview',
                templateId: 'student',
                content: 'Ready to build your own? Use this ATS-optimized student template to get started instantly.'
            }
        """
        # We want to insert this before the closing ']'
        # But we need to check if there's a comma before the closing ']'
        # Actually, we can just insert it at the end of the last object if it exists.
        
        # Let's find the last '}' before array_end
        last_obj_end = content.rfind('}', content_start, array_end)
        if last_obj_end != -1:
            insertion = """,
            {
                type: 'templatePreview',
                templateId: 'student',
                content: 'Ready to build your own? Use this ATS-optimized student template to get started instantly.'
            }"""
            new_content = content[:last_obj_end+1] + insertion + content[last_obj_end+1:]
            with codecs.open(file_path, 'w', 'utf-8') as f:
                f.write(new_content)
            print("Successfully updated the post.")
        else:
            print("Could not find end of last object.")
    else:
        print("Could not find end of content array.")
else:
    print("Could not find the target slug.")
