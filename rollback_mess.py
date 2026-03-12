import codecs

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    lines = f.readlines()

# I want to find the mess at the end
# Line 3493-3501 in the current state
# I want to remove the templatePreview that I accidentally added after the last post
# And fix the double comma

# The last post ends at 3494 approx.
# Let's find the second to last ]; 

# Actually I'll just look for the double comma
for i in range(len(lines)):
    if "    },," in lines[i]:
        lines[i] = "    }\n"
        # The following lines until ]; should be removed
        for j in range(i+1, len(lines)):
            if "];" in lines[j]:
                # Remove lines between i and j
                for k in range(i+1, j):
                    lines[k] = ""
                break
        break

# Filter out empty lines
final_lines = [line for line in lines if line != ""]

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.writelines(final_lines)

print("Rollback mess completed")
