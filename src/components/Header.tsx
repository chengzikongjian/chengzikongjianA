import { CheckCircle2, Sparkles, Star } from 'lucide-react'

export function Header({ totalStars, learnedCount, streakDays }: { totalStars: number; learnedCount: number; streakDays: number }) {
  return (
    <header className="hero-band">
      <div className="hero-content">
        <p className="eyebrow">星光识字岛</p>
        <h1>一关一关认识汉字</h1>
        <p className="hero-copy">沿着学习链往前走：学字、闯关、读故事、攒星星。</p>
      </div>
      <div className="stats-panel" aria-label="学习统计">
        <span><Star size={18} /> {totalStars} 颗星</span>
        <span><Sparkles size={18} /> {learnedCount} 个字</span>
        <span><CheckCircle2 size={18} /> 连续 {streakDays} 天</span>
      </div>
    </header>
  )
}
