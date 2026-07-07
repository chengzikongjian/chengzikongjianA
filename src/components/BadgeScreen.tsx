import { RotateCcw } from 'lucide-react'
import { badges } from '../data'
import { useProgressStore } from '../useProgressStore'

export function BadgeScreen({ resetProgress }: { resetProgress: () => void }) {
  const { progress } = useProgressStore()
  const earned = new Set(progress.badges)

  return (
    <section className="badge-layout">
      <div className="section-title">
        <p className="eyebrow">学习成就</p>
        <h2>把每一次努力收进星光册</h2>
        <p>完成学习任务就能收集勋章，看看你已经点亮了多少！</p>
      </div>

      <div className="badge-grid">
        {badges.map((badge) => (
          <article className={earned.has(badge.id) ? 'badge earned' : 'badge'} key={badge.id}>
            <span className="badge-icon">{badge.icon}</span>
            <h3>{badge.title}</h3>
            <p>{badge.description}</p>
            {earned.has(badge.id) && <span className="earned-tag">已获得</span>}
          </article>
        ))}
      </div>

      <div className="sentence-log">
        <h3>我的句子</h3>
        {progress.createdSentences.length === 0 ? (
          <p className="empty-note">还没有保存句子，去创意工坊试试吧。</p>
        ) : (
          progress.createdSentences.map((sentence) => (
            <p key={sentence.id} className="saved-sentence">
              <span className="sentence-quote">"</span>
              {sentence.text}
              <span className="sentence-quote">"</span>
            </p>
          ))
        )}
      </div>

      <button className="danger-action action-btn" onClick={resetProgress}>
        <RotateCcw size={18} /> 重置本地学习进度
      </button>
    </section>
  )
}
