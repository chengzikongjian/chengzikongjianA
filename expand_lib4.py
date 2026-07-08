import os
root = os.getcwd()

with open(os.path.join(root, 'src/App.css'), 'r', encoding='utf-8') as f:
    css = f.read()

# Add new CSS styles before the /* ===== 学情报告 ===== */ section
insert_marker = '/* ===== 学情报告 ===== */'

new_css = '''
/* ===== 教材同步与学习计划增强样式 ===== */
.grade-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
}
.grade-btn {
  padding: 6px 16px;
  border: 2px solid #b8d2ce;
  border-radius: 20px;
  background: #fff;
  color: #3a6b65;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.grade-btn:hover {
  border-color: #2fa68e;
  background: #e8f5f0;
}
.grade-btn.active {
  background: #2fa68e;
  color: #fff;
  border-color: #2fa68e;
  box-shadow: 0 2px 8px rgba(47, 166, 142, 0.3);
}

.sync-plan-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  align-items: start;
}

.textbook-sync-panel,
.plan-panel {
  display: grid;
  gap: 10px;
  align-content: start;
  padding: 16px;
  border: 2px solid #14342f;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 5px 5px 0 rgba(20, 52, 47, 0.12);
}

.sync-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit-count {
  font-size: 0.78rem;
  color: #6d9590;
  font-weight: 600;
  background: #eef6f4;
  padding: 2px 10px;
  border-radius: 10px;
}

.sync-subtitle {
  font-size: 0.82rem;
  color: #6d9590;
  margin: -6px 0 4px;
}

.textbook-lesson-list {
  display: grid;
  gap: 6px;
  max-height: 480px;
  overflow-y: auto;
}

.textbook-row {
  display: grid;
  gap: 2px;
  padding: 10px 12px;
  border: 1.5px solid #dce8e5;
  border-radius: 8px;
  background: #fafffe;
  cursor: pointer;
  transition: all 0.15s;
}
.textbook-row:hover {
  border-color: #2fa68e;
  background: #f2fffa;
}
.textbook-row.active {
  border-color: #2fa68e;
  background: #eefaf6;
  box-shadow: 0 1px 4px rgba(47, 166, 142, 0.12);
}

.textbook-row-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.textbook-meta {
  display: flex;
  gap: 8px;
  align-items: baseline;
}
.textbook-meta strong {
  font-size: 0.95rem;
  color: #14342f;
}
.unit-tag {
  font-size: 0.75rem;
  color: #6d9590;
  background: #eef6f4;
  padding: 1px 8px;
  border-radius: 6px;
}

.char-count {
  font-size: 0.72rem;
  color: #6d9590;
  font-weight: 600;
}
.expand-arrow {
  font-size: 0.72rem;
  color: #2fa68e;
  font-weight: 700;
  margin-left: 6px;
}

.focus-desc {
  font-size: 0.8rem;
  color: #6d9590;
}

.textbook-chars-expanded {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #dce8e5;
}

.textbook-char-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tb-char-item {
  display: grid;
  gap: 0;
  justify-items: center;
  padding: 4px 10px;
  border: 1px solid #dce8e5;
  border-radius: 6px;
  background: #fff;
  min-width: 48px;
}
.tb-char {
  font-size: 1.3rem;
  font-weight: 800;
  color: #14342f;
}
.tb-pinyin {
  font-size: 0.65rem;
  color: #8ab5af;
  font-weight: 500;
}

.empty-hint {
  text-align: center;
  padding: 30px 10px;
  color: #8ab5af;
  font-size: 0.9rem;
}

.plan-filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.filter-tab {
  padding: 4px 12px;
  border: 1.5px solid #dce8e5;
  border-radius: 14px;
  background: #fff;
  color: #3a6b65;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-tab:hover {
  border-color: #2fa68e;
}
.filter-tab.active {
  background: #2fa68e;
  color: #fff;
  border-color: #2fa68e;
}

.plan-list {
  display: grid;
  gap: 6px;
  max-height: 440px;
  overflow-y: auto;
}

.plan-row {
  display: grid;
  gap: 4px;
  padding: 10px 12px;
  border: 1.5px solid #dce8e5;
  border-radius: 8px;
  background: #fafffe;
  cursor: pointer;
  transition: all 0.15s;
}
.plan-row:hover {
  border-color: #7b61ff;
  background: #f5f2ff;
}
.plan-row.active {
  border-color: #7b61ff;
  background: #f0ecff;
  box-shadow: 0 1px 4px rgba(123, 97, 255, 0.12);
}

.plan-row-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.plan-row-header strong {
  font-size: 0.9rem;
  color: #14342f;
}

.plan-audience-tag {
  font-size: 0.7rem;
  color: #6d9590;
  background: #eef6f4;
  padding: 1px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.plan-daily {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 0.82rem;
  color: #3a6b65;
}

.plan-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #8ab5af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 56px;
}

.plan-expanded {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #dce8e5;
  display: grid;
  gap: 8px;
}

.plan-detail-row {
  display: grid;
  gap: 2px;
}
.plan-detail-row p {
  font-size: 0.84rem;
  color: #14342f;
  line-height: 1.4;
}

.start-plan-btn {
  margin-top: 6px;
  justify-self: start;
}

/* Mobile responsive */
@media (max-width: 720px) {
  .sync-plan-grid {
    grid-template-columns: 1fr;
  }
  .grade-selector {
    gap: 6px;
  }
  .grade-btn {
    font-size: 0.78rem;
    padding: 4px 12px;
  }
}

''' 

css = css.replace(insert_marker, new_css + '\n' + insert_marker)

with open(os.path.join(root, 'src/App.css'), 'w', encoding='utf-8') as f:
    f.write(css)
print("CSS updated!")
