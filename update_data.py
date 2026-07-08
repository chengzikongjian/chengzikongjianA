import os, re
root = os.getcwd()
with open(os.path.join(root, 'src/supportData.ts'), 'r', encoding='utf-8') as f:
    c = f.read()

tb_entries = []
items = [
    ("tb-1-1","一年级上","识字一","天地人",["天","地","人","你","我","他"],"入学第一组高频独体字"),("tb-1-2","一年级上","识字二","金木水火土",["一","二","三","四","五","金","木","水","火","土"],"数字和自然基础字"),
]
for item in items:
    chars = ",".join(["'"+ch+"'" for ch in item[4]])
    line = "  { id: '"+item[0]+"', publisher: '部编版', grade: '"+item[1]+"', unit: '"+item[2]+"', lesson: '"+item[3]+"', characters: ["+chars+"], focus: '"+item[5]+"' },"
    tb_entries.append(line)

new_tb = "export const textbookUnits: TextbookUnit[] = [\n" + "\n".join(tb_entries) + "\n]"

old_tb_match = re.search(r'export const textbookUnits: TextbookUnit\[\] = \[.*?\n\]', c, re.DOTALL)
if old_tb_match:
    c = c[:old_tb_match.start()] + new_tb + c[old_tb_match.end():]

with open(os.path.join(root, 'src/supportData.ts'), 'w', encoding='utf-8') as f:
    f.write(c)
print("Done")
