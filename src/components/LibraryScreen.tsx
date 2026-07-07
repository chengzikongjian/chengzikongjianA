import { curriculumEntries, curriculumStages, curriculumSummary } from '../curriculum'

export function LibraryScreen() {
  return (
    <section className="library-layout">
      <div className="section-title">
        <p className="eyebrow">分级字库</p>
        <h2>按幼儿园和小学 1-6 年级建立课程识字库</h2>
        <p>当前版本采用课程目标库 + 精编互动关卡的双层结构，先保证覆盖规模，再逐步补充人工校对释义、音频和课文同步。</p>
      </div>

      <div className="library-summary">
        <article className="summary-stat">
          <strong>{curriculumSummary.kindergartenTarget}</strong>
          <span>幼儿园启蒙目标字</span>
        </article>
        <article className="summary-stat">
          <strong>{curriculumSummary.primaryTarget}</strong>
          <span>小学 1-6 年级目标字</span>
        </article>
        <article className="summary-stat">
          <strong>{curriculumSummary.totalTarget}</strong>
          <span>分级字库总条目</span>
        </article>
      </div>

      <div className="stage-library-grid">
        {curriculumStages.map((stage) => {
          const entries = curriculumEntries.filter((entry) => entry.stageId === stage.id)
          const coreCount = entries.filter((entry) => entry.priority === 'core').length
          return (
            <article className="stage-library-card" key={stage.id}>
              <div className="stage-library-head">
                <div>
                  <p className="eyebrow">{stage.ageRange}</p>
                  <h3>{stage.title}</h3>
                </div>
                <strong className="stage-count">{entries.length} 字</strong>
              </div>
              <p>{stage.focus}</p>
              <div className="stage-details">
                <div>
                  <dt>互动形式</dt>
                  <dd>{stage.interaction}</dd>
                </div>
                <div>
                  <dt>评价重点</dt>
                  <dd>{stage.assessment}</dd>
                </div>
              </div>
              <div className="library-meta">
                <span>核心样例 {coreCount} 字</span>
                <span>拓展补齐 {entries.length - coreCount} 字</span>
              </div>
              <div className="character-sample-grid" aria-label={`${stage.title}样例字`}>
                {entries.slice(0, 42).map((entry) => (
                  <span key={entry.id}>{entry.char}</span>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
