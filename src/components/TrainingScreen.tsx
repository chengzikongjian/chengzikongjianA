import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { Mic2, RotateCcw } from 'lucide-react'
import { characters } from '../data'
import { textbookUnits, trainingModes } from '../supportData'
import { studyPlanTemplates } from '../supportData'
import type { CharacterItem } from '../types'
import { speak } from '../utils/speech'

export function TrainingScreen({
  activeCharacter,
  setPracticeCharacterId,
}: {
  activeCharacter: CharacterItem
  setPracticeCharacterId: (id: string) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const [readScore, setReadScore] = useState<number | null>(null)
  const [strokeScore, setStrokeScore] = useState<number | null>(null)

  const selectedIndex = characters.findIndex((item) => item.id === activeCharacter.id)
  const nextCharacter = () => setPracticeCharacterId(characters[(selectedIndex + 1) % characters.length].id)

  const startReadingCheck = () => {
    speak(activeCharacter.char)
    const base = activeCharacter.level === 'sprout' || activeCharacter.level === 'bridge' ? 88 : 78
    setReadScore(Math.min(99, base + (activeCharacter.char.codePointAt(0)! % 12)))
  }

  const canvasPoint = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  const drawStart = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    drawingRef.current = true
    const point = canvasPoint(event)
    context.beginPath()
    context.moveTo(point.x, point.y)
  }

  const drawMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const point = canvasPoint(event)
    context.lineTo(point.x, point.y)
    context.lineWidth = 12
    context.lineCap = 'round'
    context.strokeStyle = '#14342f'
    context.stroke()
  }

  const drawEnd = () => {
    if (!drawingRef.current || !canvasRef.current) return
    drawingRef.current = false
    const context = canvasRef.current.getContext('2d')
    if (!context) return
    const pixels = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height).data
    let ink = 0
    for (let index = 3; index < pixels.length; index += 4) {
      if (pixels[index] > 0) ink += 1
    }
    setStrokeScore(Math.min(100, Math.round((ink / 8800) * 100)))
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    setStrokeScore(null)
  }

  return (
    <section className="training-layout">
      <div className="section-title">
        <p className="eyebrow">专项训练</p>
        <h2>AI 跟读、书写轨迹、教材同步和分龄游戏</h2>
        <p>当前为轻量本地演示版，后续可接入商用语音测评和书写识别接口。</p>
      </div>

      <div className="assist-grid">
        <article className="assist-card read-card">
          <p className="eyebrow">轻量 AI 跟读测评</p>
          <div className="practice-hanzi">{activeCharacter.char}</div>
          <p className="practice-info">{activeCharacter.pinyin} · {activeCharacter.words[0]}</p>
          <button className="primary-action action-btn" onClick={startReadingCheck}>
            <Mic2 size={18} /> 跟读测评
          </button>
          <div className="score-meter">
            <span style={{ width: `${readScore ?? 0}%` }} />
          </div>
          <strong className="score-label">
            {readScore === null ? '等待跟读' : `${readScore} 分 · 发音清晰`}
          </strong>
        </article>

        <article className="assist-card writing-card">
          <p className="eyebrow">汉字书写轨迹识别</p>
          <canvas
            aria-label="书写练习画布"
            height={260}
            onPointerDown={drawStart}
            onPointerLeave={drawEnd}
            onPointerMove={drawMove}
            onPointerUp={drawEnd}
            ref={canvasRef}
            width={260}
          />
          <div className="writing-actions">
            <button onClick={clearCanvas}><RotateCcw size={16} /> 清空</button>
            <button onClick={nextCharacter}>换一个字</button>
          </div>
          <p className="stroke-hint">
            {strokeScore === null
              ? '在米字格里描摹，系统会估算轨迹覆盖度。'
              : `轨迹覆盖 ${strokeScore}% · 注意笔顺和结构。`}
          </p>
        </article>

        <article className="assist-card standard-card">
          <p className="eyebrow">标准化汉字档案</p>
          <div className="standard-fields">
            {[
              ['字形', activeCharacter.char],
              ['读音', activeCharacter.pinyin],
              ['部首', activeCharacter.radical ?? '-'],
              ['笔画', String(activeCharacter.strokeCount ?? '-')],
              ['结构', activeCharacter.structure ?? '-'],
              ['易错点', activeCharacter.mistakeNote ?? '-'],
            ].map(([label, value]) => (
              <div className="field-row" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="section-subtitle">
        <h3>分龄游戏闯关模式</h3>
      </div>
      <div className="training-mode-grid">
        {trainingModes.map((mode) => (
          <article className="training-mode-card" key={mode.id}>
            <p className="mode-stage-tag">
              {mode.stage === 'kindergarten' ? '🧒 幼儿园玩法'
                : mode.stage === 'lower-primary' ? '📚 低年级玩法'
                : '🎓 高年级玩法'}
            </p>
            <h3>{mode.title}</h3>
            <p className="mode-purpose">{mode.purpose}</p>
            <span className="mode-play">{mode.play}</span>
            <strong className="mode-reward">{mode.reward}</strong>
          </article>
        ))}
      </div>

      <div className="section-subtitle">
        <h3>教材同步与学习计划</h3>
      </div>
      <div className="sync-plan-grid">
        <article className="textbook-sync-panel">
          <p className="eyebrow">教材同步</p>
          <h3>部编版/人教版课文生字样例</h3>
          {textbookUnits.map((unit) => (
            <div className="textbook-row" key={unit.id}>
              <strong>{unit.publisher} · {unit.grade} · {unit.lesson}</strong>
              <span>{unit.characters.join(' ')}</span>
              <small>{unit.focus}</small>
            </div>
          ))}
        </article>
        <article className="plan-panel">
          <p className="eyebrow">学习计划</p>
          <h3>每日、单元、期末复习模板</h3>
          {studyPlanTemplates.map((plan) => (
            <div className="plan-row" key={plan.id}>
              <strong>{plan.title}</strong>
              <span>{plan.audience} · {plan.dailyTarget}</span>
              <small>{plan.reviewMode}；{plan.parentControl}</small>
            </div>
          ))}
        </article>
      </div>
    </section>
  )
}
