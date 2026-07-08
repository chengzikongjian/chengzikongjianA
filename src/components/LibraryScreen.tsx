import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2 } from "lucide-react";
import HanziWriter from "hanzi-writer";
import { curriculumEntries, curriculumStages, curriculumSummary } from "../curriculum";
import { getCharacter } from "../data";
import { speakCharacter } from "../utils/speech";
import "../lib-modal.css";

function CharModal({ char, onClose }: { char: string; onClose: () => void }) {
  const writerRef = useRef<HTMLDivElement>(null);
  const found = getCharacter(char);

  useEffect(() => {
    if (!writerRef.current || !found) return;
    writerRef.current.innerHTML = "";
    HanziWriter.create(writerRef.current, found.strokeKey, {
      width: 120, height: 120, padding: 16,
      showOutline: true, strokeAnimationSpeed: 1.2,
      delayBetweenStrokes: 120, radicalColor: "#ef476f",
    });
  }, [found]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <article className="char-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        {found ? (
          <>
            <div className="modal-hanzi">{found.char}</div>
            <p className="modal-pinyin">{found.pinyin}</p>
            <p className="modal-meaning">{found.meaning}</p>
            <div className="modal-chips">
              {found.words.map((w) => <span key={w}>{w}</span>)}
            </div>
            <p className="modal-sentence">{found.sentences[0]}</p>
            <div className="modal-meta">
              <span>部首：{found.radical ?? "-"}</span>
              <span>笔画：{found.strokeCount ?? "-"}</span>
              <span>结构：{found.structure ?? "-"}</span>
            </div>
            <div className="modal-actions">
              <button onClick={() => speakCharacter(found)}>
                <Volume2 size={16} /> 听读音
              </button>
            </div>
            <div className="writer-box mini-writer" ref={writerRef} />
          </>
        ) : (
          <>
            <div className="modal-hanzi">{char}</div>
            <p className="modal-hint">课程库补充字</p>
            <div className="modal-actions">
              <button onClick={() => { const u = new SpeechSynthesisUtterance(char); u.lang = "zh-CN"; u.rate = 0.55; speechSynthesis.speak(u); }}>
                <Volume2 size={16} /> 听读音
              </button>
            </div>
          </>
        )}
      </article>
    </div>
  );
}

export function LibraryScreen() {
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});

  const toggleStage = useCallback((stageId: string) => {
    setExpandedStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
  }, []);

  return (
    <section className="library-layout">
      <div className="section-title">
        <p className="eyebrow">分级字库</p>
        <h2>按幼儿园和小学 1-6 年级建立课程识字库</h2>
        <p>点击下方任意汉字，可查看详细档案。</p>
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
          const entries = curriculumEntries.filter((entry) => entry.stageId === stage.id);
          const coreCount = entries.filter((entry) => entry.priority === "core").length;
          const isExpanded = expandedStages[stage.id] ?? false;
          const displayEntries = isExpanded ? entries : entries.slice(0, 42);
          const totalCount = entries.length;
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
                <span>{isExpanded ? '已展开全部' : `显示前 42 字`}</span>
              </div>
              <div className="character-sample-grid" aria-label={`${stage.title}样例字`}>
                {displayEntries.map((entry) => (
                  <button
                    className="char-sample-btn"
                    key={entry.id}
                    onClick={() => setSelectedChar(entry.char)}
                    title={`${entry.char}`}
                  >
                    {entry.char}
                  </button>
                ))}
              </div>
              {totalCount > 42 && (
                <button
                  className="expand-toggle-btn"
                  onClick={() => toggleStage(stage.id)}
                >
                  {isExpanded
                    ? `收起，仅显示前 42 字（共 ${totalCount} 字）`
                    : `展开全部 ${totalCount} 字`}
                </button>
              )}
            </article>
          );
        })}
      </div>

      {selectedChar && (
        <CharModal char={selectedChar} onClose={() => setSelectedChar(null)} />
      )}
    </section>
  );
}
