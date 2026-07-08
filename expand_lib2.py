import os, re
root = os.getcwd()

with open(os.path.join(root, 'src/components/TrainingScreen.tsx'), 'r', encoding='utf-8') as f:
    content = f.read()

# Find the textbook sync section
idx = content.find('部编版/人教版课文生字样例')
if idx < 0:
    print("Could not find target section")
    exit()

# Find start of the section-subtitle div
start = content.rfind('<div className="section-subtitle">', 0, idx)

# Find the end of the sync-plan-grid div
end_marker = '      </div>\n    </>\n  );\n\n  // === MAIN RENDER ==='
end = content.find(end_marker, idx)
if end < 0:
    # Try alternate
    end_marker2 = '    </>\n  );\n\n  // === MAIN RENDER ==='
    end = content.find(end_marker2, idx)
    if end < 0:
        print("Could not find end marker")
        exit()
    end = end + len('    ')
else:
    end = end + len('      ')

print(f"Replacing from {start} to {end}")

new_section = '''      <div className="section-subtitle"><h3>教材同步与学习计划</h3></div>

      {/* ===== 年级选择器 ===== */}
      <div className="grade-selector">
        {["全部年级","一年级","二年级","三年级","四年级","五年级","六年级"].map((g) => (
          <button
            key={g}
            className={gradeFilter === g ? "grade-btn active" : "grade-btn"}
            onClick={() => setGradeFilter(g)}
          >
            {g.replace("全部年级","全部")}
          </button>
        ))}
      </div>

      <div className="sync-plan-grid">
        {/* ===== 左侧：教材同步 ===== */}
        <article className="textbook-sync-panel">
          <div className="sync-panel-header">
            <p className="eyebrow">教材同步</p>
            <span className="unit-count">
              {filteredUnits.length} 课 / {filteredUnits.reduce((s,u) => s + u.characters.length, 0)} 字
            </span>
          </div>
          <h3>部编版 · 课文同步生字</h3>
          <p className="sync-subtitle">点击课文查看生字，选择年级筛选内容</p>

          {/* 课文字列表 */}
          <div className="textbook-lesson-list">
            {filteredUnits.map((unit) => (
              <div
                className={`textbook-row ${selectedUnit === unit.id ? "active" : ""}`}
                key={unit.id}
                onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
              >
                <div className="textbook-row-header">
                  <div className="textbook-meta">
                    <strong>{unit.lesson}</strong>
                    <span className="unit-tag">{unit.grade} · {unit.unit}</span>
                  </div>
                  <span className="char-count">{unit.characters.length} 字</span>
                  {selectedUnit === unit.id && <span className="expand-arrow">收起</span>}
                  {selectedUnit !== unit.id && <span className="expand-arrow">展开</span>}
                </div>
                <small className="focus-desc">{unit.focus}</small>

                {selectedUnit === unit.id && (
                  <div className="textbook-chars-expanded">
                    <div className="textbook-char-grid">
                      {unit.characters.map((ch) => {
                        const charInfo = characters.find((c) => c.char === ch);
                        return (
                          <div className="tb-char-item" key={ch}>
                            <span className="tb-char">{ch}</span>
                            {charInfo && <span className="tb-pinyin">{charInfo.pinyin}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredUnits.length === 0 && (
            <div className="empty-hint">该年级暂无数据，请选择其他年级</div>
          )}
        </article>

        {/* ===== 右侧：学习计划 ===== */}
        <article className="plan-panel">
          <div className="sync-panel-header">
            <p className="eyebrow">学习计划</p>
            <span className="unit-count">{filteredPlans.length} 个计划</span>
          </div>
          <h3>分龄分级学习计划</h3>
          <p className="sync-subtitle">选择一个计划，设定每日识字目标</p>

          {/* 计划筛选标签 */}
          <div className="plan-filter-tabs">
            {["全部","幼儿园","小学低年级","小学中年级","小学高年级"].map((tab) => (
              <button
                key={tab}
                className={planFilter === tab ? "filter-tab active" : "filter-tab"}
                onClick={() => setPlanFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="plan-list">
            {filteredPlans.map((plan) => (
              <div
                className={`plan-row ${activePlanId === plan.id ? "active" : ""}`}
                key={plan.id}
                onClick={() => setActivePlanId(activePlanId === plan.id ? null : plan.id)}
              >
                <div className="plan-row-header">
                  <strong>{plan.title}</strong>
                  <span className="plan-audience-tag">{plan.audience}</span>
                </div>
                <div className="plan-daily">
                  <span className="plan-label">每日目标</span>
                  <span>{plan.dailyTarget}</span>
                </div>

                {activePlanId === plan.id && (
                  <div className="plan-expanded">
                    <div className="plan-detail-row">
                      <span className="plan-label">复习方式</span>
                      <p>{plan.reviewMode}</p>
                    </div>
                    <div className="plan-detail-row">
                      <span className="plan-label">家长控制</span>
                      <p>{plan.parentControl}</p>
                    </div>
                    <button className="primary-action start-plan-btn">
                      启用此计划
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>
      </div>'''

new_content = content[:start] + new_section + content[end:]

with open(os.path.join(root, 'src/components/TrainingScreen.tsx'), 'w', encoding='utf-8') as f:
    f.write(new_content)
print("TrainingScreen.tsx updated!")
