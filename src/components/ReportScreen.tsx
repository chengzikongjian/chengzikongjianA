import { CheckCircle2, Sparkles, Star, Target } from 'lucide-react'
import { characters, lessons, levels } from '../data'
import type { CharacterItem } from '../types'
import { curriculumSummary } from '../curriculum'
import { useProgressStore } from '../useProgressStore'

export function ReportScreen() {
  const { progress } = useProgressStore()
  const learned = new Set(progress.learnedCharacterIds)
  const completedLessons = lessons.filter((lesson) => (progress.lessonStars[lesson.id] ?? 0) > 0)
  const totalStars = Object.values(progress.lessonStars).reduce((sum, stars) => sum + stars, 0)
  const mastery = Math.round((learned.size / curriculumSummary.totalTarget) * 100)

  const nextLesson = lessons.find((lesson) => {
    const unfinished = (progress.lessonStars[lesson.id] ?? 0) === 0
    const required = lesson.unlockRules.requiredLessonId
    const unlocked = !required || (progress.lessonStars[required] ?? 0) >= (lesson.unlockRules.minStars ?? 1)
    return unfinished && unlocked
  })

  const reviewLessons = lessons.filter((lesson) => {
    const stars = progress.lessonStars[lesson.id] ?? 0
    return stars > 0 && stars < 3
  })

  const reviewCharacters: CharacterItem[] = (
    reviewLessons.length
      ? reviewLessons.flatMap((lesson) =>
          lesson.characterIds
            .map((id) => characters.find((item) => item.id === id))
            .filter((item): item is CharacterItem => Boolean(item))
        )
      : characters.filter((item) => !learned.has(item.id))
  ).slice(0, 10)

  return (
    <section className="report-layout">
      <div className="section-title">
        <p className="eyebrow">学情报告</p>
        <h2>今天的学习轨迹在这里</h2>
        <p>本地记录识字数量、关卡星级、分级进度和下一组复习字。</p>
      </div>

      <div className="report-cards">
        <article className="report-card">
          <Sparkles size={26} />
          <strong>{learned.size}</strong>
          <span>已认识汉字</span>
        </article>
        <article className="report-card">
          <Star size={26} />
          <strong>{totalStars}/{lessons.length * 3}</strong>
          <span>关卡星级</span>
        </article>
        <article className="report-card">
          <CheckCircle2 size={26} />
          <strong>{completedLessons.length}/{lessons.length}</strong>
          <span>完成关卡</span>
        </article>
        <article className="report-card">
          <Target size={26} />
          <strong>{mastery}%</strong>
          <span>课程库掌握率</span>
        </article>
      </div>

      <div className="level-progress-grid">
        {levels.map((level) => {
          const total = characters.filter((item) => item.level === level.id).length
          const done = characters.filter((item) => item.level === level.id && learned.has(item.id)).length
          const percent = total ? Math.round((done / total) * 100) : 0
          return (
            <article className="level-progress" key={level.id}>
              <div className="level-header">
                <h3>{level.title}</h3>
                <span>{done}/{total} 字</span>
              </div>
              <div className="progress-track" aria-label={`${level.title}掌握率${percent}%`}>
                <span style={{ width: `${percent}%`, background: level.color }} />
              </div>
            </article>
          )
        })}
      </div>

      <div className="review-panel">
        <article className="next-lesson">
          <p className="eyebrow">下一步</p>
          <h3>{nextLesson ? nextLesson.title : '全部关卡已完成'}</h3>
          <p>{nextLesson ? nextLesson.subtitle : '可以回到低星关卡复习，争取拿满星。'}</p>
        </article>
        <article className="review-words">
          <p className="eyebrow">建议复习</p>
          <div className="review-word-grid">
            {reviewCharacters.map((item) => (
              <span key={item.id}>
                {item.char}
                <small>{item.pinyin}</small>
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
