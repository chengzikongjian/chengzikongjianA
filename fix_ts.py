import os
root = os.getcwd()
def edit(rel, fn):
    with open(os.path.join(root, rel), 'r', encoding='utf-8') as f:
        c = f.read()
    with open(os.path.join(root, rel), 'w', encoding='utf-8') as f:
        f.write(fn(c))

edit('src/App.tsx', lambda c: c.replace(
    'import { speak, speakQuiz, warmupVoice } from "./utils/speech";',
    'import { speakQuiz, warmupVoice } from "./utils/speech";'
))
print('1. App.tsx')

edit('src/components/CharacterCard.tsx', lambda c: c.replace(
    'speak, speakCharacter', 'speak'
).replace(
    'delayBetweenLoops: 2000,\n      ', ''
))
print('2. CharacterCard.tsx')

edit('src/components/LibraryScreen.tsx', lambda c: c.replace(
    'const isHandcrafted = hasHandcraftedData(char);\n  ', ''
).replace(
    '        } : found ? (', '        } : hasHandcraftedData(char) ? ('
))
print('3. LibraryScreen.tsx')

edit('src/components/QuizPanel.tsx', lambda c: c.replace(
    'speak, speakQuiz', 'speakQuiz'
))
print('4. QuizPanel.tsx')

edit('src/components/ReportScreen.tsx', lambda c: c.replace(
    'import type { CharacterItem, Lesson }',
    'import type { CharacterItem }'
))
print('5. ReportScreen.tsx')

edit('src/components/TrainingScreen.tsx', lambda c: c.replace(
    'import { useCallback, useMemo, useRef, useState }',
    'import { useCallback, useRef, useState }'
).replace(
    'import { ChevronLeft, ChevronRight, Mic2, RotateCcw, Sparkles, Star, Volume2, X }',
    'import { ChevronLeft, Mic2, RotateCcw, Sparkles, Star, Volume2 }'
))
print('6. TrainingScreen.tsx')
print('All done')
