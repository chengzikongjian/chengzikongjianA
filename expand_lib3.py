import os
root = os.getcwd()

with open(os.path.join(root, 'src/components/TrainingScreen.tsx'), 'r', encoding='utf-8') as f:
    content = f.read()

# Add new state variables after totalAnswered state
old_state_end = "const [totalAnswered, setTotalAnswered] = useState(0);"
new_state = '''const [totalAnswered, setTotalAnswered] = useState(0);
  const [gradeFilter, setGradeFilter] = useState("全部年级");
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [planFilter, setPlanFilter] = useState("全部");
  const [activePlanId, setActivePlanId] = useState<string | null>(null);'''

content = content.replace(old_state_end, new_state)
print("State variables added")

# Now add the computed filters - find where nextCharacter and shuffle are defined
# We need to add filteredUnits and filteredPlans 
# Find "const selectedIndex" to add after it
insert_marker = "const selectedIndex = characters.findIndex((item) => item.id === activeCharacter.id);"
new_code = '''const selectedIndex = characters.findIndex((item) => item.id === activeCharacter.id);
  const filteredUnits = useMemo(() => {
    if (gradeFilter === "全部年级") return textbookUnits;
    return textbookUnits.filter((u) => u.grade.includes(gradeFilter));
  }, [gradeFilter]);

  const filteredPlans = useMemo(() => {
    if (planFilter === "全部") return studyPlanTemplates;
    const map: Record<string, string> = {
      "幼儿园": "幼儿园",
      "小学低年级": "小",
      "小学中年级": "3",
      "小学高年级": "5",
    };
    const kw = map[planFilter];
    if (!kw) return studyPlanTemplates;
    return studyPlanTemplates.filter((p) => p.audience.includes(kw));
  }, [planFilter]);'''

content = content.replace(insert_marker, new_code)
print("Filter functions added")

# Also need to import useMemo - check if already imported
if 'useMemo' not in content[:content.find('export function TrainingScreen')]:
    content = content.replace(
        'import { useCallback, useRef, useState }',
        'import { useCallback, useMemo, useRef, useState }'
    )
    print("Added useMemo import")

with open(os.path.join(root, 'src/components/TrainingScreen.tsx'), 'w', encoding='utf-8') as f:
    f.write(content)
print("All updates applied!")
