import codecs
import re

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_next = False
for i, line in enumerate(lines):
    if skip_next:
        skip_next = False
        continue
    
    # Check for double braces that I introduced
    if "            }," in line:
        if i + 1 < len(lines) and "            }," in lines[i+1]:
            # This is likely the double brace bug
            # Check the context to be sure
            continue # Skip this line
            
    new_lines.append(line)

# Now find the chronological part which failed
# content: '... This is the format ATS was built for.'
for i, line in enumerate(new_lines):
    if "This is the format ATS was built for." in line:
        # Insert after the closing brace of this object
        # The line itself is the content. The brace should be on the next line.
        if i + 1 < len(new_lines) and "            }" in new_lines[i+1]:
            # Found it
            insertion = [
                "            },\n",
                "            {\n",
                "                type: 'image',\n",
                "                src: '/images/Resume Tutorial/Reume Sample.png',\n",
                "                alt: 'Chronological Resume Format Sample',\n",
                "                content: 'The most popular resume format which focuses on career progression and timeline.'\n",
                "            },\n",
                "            {\n",
                "                type: 'templatePreview',\n",
                "                templateId: 'modern',\n",
                "                showPreview: true,\n",
                "                content: 'Use our Modern Chronological template for a layout that recruiters and ATS systems love.'\n",
                "            }\n"
            ]
            new_lines[i+1] = "" # Remove old brace line
            # We will join later
            # Actually let's just use a list of strings
            pass

# Let's use a simpler approach for the insertion.
# I'll just rewrite the whole logic to be cleaner.
