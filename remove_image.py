import codecs

file_path = r'l:\CVArchitect\utils\blogData.ts'
with codecs.open(file_path, 'r', 'utf-8') as f:
    lines = f.readlines()

target_idx = -1
for i, line in enumerate(lines):
    if "src: '/images/Student/Reume%20Sample.png'" in line:
        target_idx = i
        break

if target_idx != -1:
    # Find the start of the object {
    start = -1
    for i in range(target_idx, target_idx - 5, -1):
        if "{" in lines[i]:
            start = i
            break
    
    # Find the end of the object },
    end = -1
    for i in range(target_idx, target_idx + 5):
        if "}," in lines[i]:
            end = i
            break
            
    if start != -1 and end != -1:
        del lines[start:end+1]
        with codecs.open(file_path, 'w', 'utf-8') as f:
            f.writelines(lines)
        print("Deleted successfully")
    else:
        print(f"Indices not found: start={start}, end={end}")
else:
    print("Image src not found")
