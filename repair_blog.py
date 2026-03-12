import codecs

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    lines = f.readlines()

# Stage 1: Fix the broken area between chronological list and functional paragraphs
target_line = "You showed clear career progression (promotions, increasing responsibility)"
idx = -1
for i, line in enumerate(lines):
    if target_line in line:
        idx = i
        break

if idx != -1:
    # Find where the functional paragraph starts
    end_idx = -1
    for i in range(idx, len(lines)):
        if "I need to be honest here because I know this is a controversial opinion." in lines[i]:
            end_idx = i
            break
    
    if end_idx != -1:
        new_content = [
            "                    'You showed clear career progression (promotions, increasing responsibility)'\n",
            "                ]\n",
            "            },\n",
            "            {\n",
            "                type: 'subheading',\n",
            "                content: 'ATS compatibility: Excellent (10/10)'\n",
            "            },\n",
            "            {\n",
            "                type: 'paragraph',\n",
            "                content: 'Every major ATS platform — Workday, Greenhouse, Lever, iCIMS, Taleo, SmartRecruiters, and BambooHR — is designed to parse the reverse chronological format. The system can correctly extract job titles, company names, employment dates, and associate your bullet points with the right employer. This is the format ATS was built for.'\n",
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
            "            },\n",
            "            {\n",
            "                type: 'heading',\n",
            "                content: 'Format 2: Functional Resume — Why Most Hiring Managers Distrust It'\n",
            "            },\n",
            "            {\n",
            "                type: 'paragraph',\n"
        ]
        lines[idx:end_idx] = new_content
    else:
        print("Could not find functional start")
else:
    print("Could not find chronological target")

# Stage 2: Fix the broken braces/commas at lines around 540-541 and 604-605 (approximate)
# I'll search for the specific content to be safe.
for i in range(len(lines)):
    if "risky choice for online applications." in lines[i]:
        # Look for the broken sequence } \n ,
        if i+1 < len(lines) and "            }" in lines[i+1]:
             if i+2 < len(lines) and "            ," in lines[i+2]:
                 lines[i+1] = "            },\n"
                 lines[i+2] = "" # Mark for removal
    
    if "front and center for the parser." in lines[i]:
        if i+1 < len(lines) and "            }" in lines[i+1]:
             if i+2 < len(lines) and "            ," in lines[i+2]:
                 lines[i+1] = "            },\n"
                 lines[i+2] = "" # Mark for removal

# Filter out empty lines that were marked for removal
final_lines = [line for line in lines if line != ""]

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.writelines(final_lines)

print("Repair completed")
