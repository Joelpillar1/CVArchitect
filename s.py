import re
with open('l:/CVArchitect/utils/blogData.ts', 'r', encoding='utf-8') as f:
    c = f.read()
for p in c.split('slug:')[1:]:
    if 'templatePreview' in p:
        print(p.splitlines()[0].strip().strip("',\""))
