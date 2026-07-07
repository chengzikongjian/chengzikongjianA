import { characters, lessons, levels } from "../data";
import type { Lesson } from "../types";

export function MapScreen({
  progressStars,
  isLessonUnlocked,
  openLesson,
}: {
  progressStars: Record<string, number>;
  isLessonUnlocked: (lesson: Lesson) => boolean;
  openLesson: (lesson: Lesson) => void;
}) {
  const currentLessonIndex = lessons.findIndex(
    (lesson) => isLessonUnlocked(lesson) && (progressStars[lesson.id] ?? 0) === 0
  );
  const nextLessonIndex = currentLessonIndex === -1 ? lessons.length - 1 : currentLessonIndex;

  return (
    <section className="chain-stage" aria-label="链式学习路径">
      <div className="section-title compact-title">
        <p className="eyebrow">学习链</p>
        <h2>从这里出发，沿着星光往前走</h2>
        <p>每一关学会几个汉字，攒够星星就能解锁下一关和一个小故事。</p>
      </div>
      <div className="learning-chain">
        {lessons.map((lesson, index) => {
          const unlocked = isLessonUnlocked(lesson);
          const stars = progressStars[lesson.id] ?? 0;
          const level = levels.find((item) => item.id === lesson.level);
          const completed = stars > 0;
          const current = index === nextLessonIndex && unlocked && !completed;

          let nodeLabel = `${index + 1}`;
          if (completed) nodeLabel = "✓";
          else if (!unlocked) nodeLabel = "🔒";

          return (
            <button
              className={`chain-node ${completed ? "completed" : ""} ${current ? "current" : ""}`}
              disabled={!unlocked}
              key={lesson.id}
              onClick={() => openLesson(lesson)}
            >
              <span className="chain-step">{nodeLabel}</span>
              <div className="chain-body">
                <span className="chain-copy">
                  {level && <small style={{ color: level.color }}>{level.title}</small>}
                  <strong>{lesson.title}</strong>
                  <em>{lesson.subtitle}</em>
                </span>
                <span className="chain-chars">
                  {lesson.characterIds.map((id) => {
                    const ch = characters.find((c) => c.id === id);
                    return ch ? (
                      <span key={id} className="chain-char-sample">
                        {ch.char}
                      </span>
                    ) : null;
                  })}
                </span>
              </div>
              <span className="chain-stars">
                {"★".repeat(stars)}
                {"☆".repeat(3 - stars)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
