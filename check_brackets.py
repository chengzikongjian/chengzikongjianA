import os
root = os.getcwd()
with open(os.path.join(root, 'src/supportData.ts'), 'r', encoding='utf-8') as f:
    lines = f.readlines()
line_nums = []
for i, line in enumerate(lines):
    if "textbookUnits" in line or "studyPlanTemplates" in line or line.strip() == "]":
        line_nums.append((i+1, line.rstrip()))
for i, l in line_nums:
    print(i, l)
