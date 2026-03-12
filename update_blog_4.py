import codecs

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    lines = f.readlines()

new_lines = []
found_slug = False
updated = False

for line in lines:
    new_lines.append(line)
    if "slug: 'student-resumes-with-no-experience'" in line:
        found_slug = True
    if found_slug and not updated and "]" in line and "content: [" not in line:
        # Check if it's the end of the content array
        # This is a bit risky but we can check the indentation
        if line.strip() == "]":
            # Replace ] with our new object and then ]
            new_lines.pop() # Remove the ]
            new_lines.append("            },\n")
            new_lines.append("            {\n")
            new_lines.append("                type: 'templatePreview',\n")
            new_lines.append("                templateId: 'student',\n")
            new_lines.append("                content: 'Ready to build your own? Use this ATS-optimized student template to get started instantly.'\n")
            new_lines.append("            }\n")
            new_lines.append("        ]\n")
            updated = True
            found_slug = False

if updated:
    with codecs.open(file_path, 'w', 'utf-8') as f:
        f.writelines(new_lines)
    print("Successfully updated.")
else:
    print("Not updated.")
