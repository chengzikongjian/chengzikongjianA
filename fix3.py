import os
root = os.getcwd()
with open(os.path.join(root, 'src/components/CharacterCard.tsx'), 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("      const _cx = 100, _cy = 100\n", "")
with open(os.path.join(root, 'src/components/CharacterCard.tsx'), 'w', encoding='utf-8') as f:
    f.write(c)
print('Removed unused _cx, _cy')
