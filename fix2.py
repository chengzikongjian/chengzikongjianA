import os
root = os.getcwd()

def edit(rel, fn):
    with open(os.path.join(root, rel), 'r', encoding='utf-8') as f:
        c = f.read()
    with open(os.path.join(root, rel), 'w', encoding='utf-8') as f:
        f.write(fn(c))

edit('src/App.tsx', lambda c: c.replace(
    'import { speakQuiz, warmupVoice } from "./utils/speech";',
    'import { speakQuiz } from "./utils/speech";'
))
print('App.tsx fixed')

edit('src/components/CharacterCard.tsx', lambda c: c.replace(
    'const cx = 100, cy = 100',
    'const _cx = 100, _cy = 100'
))
print('CharacterCard fixed')

def check_lib(c):
    if 'hasHandcraftedData(' not in c:
        c = c.replace('import { getCharacter, hasHandcraftedData }', 'import { getCharacter }')
    return c
edit('src/components/LibraryScreen.tsx', check_lib)
print('LibraryScreen checked')
