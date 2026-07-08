import { useEffect, useRef, useState } from 'react'
import HanziWriter from 'hanzi-writer'
import { Play, Volume2 } from 'lucide-react'
import type { CharacterItem } from '../types'
import { speak, speakCharacter } from '../utils/speech'

export function CharacterCard({ character, compact }: { character: CharacterItem; compact?: boolean }) {
  const writerRef = useRef<HTMLDivElement>(null)
  const writerInstance = useRef<ReturnType<typeof HanziWriter.create> | null>(null)
  const [showStroke, setShowStroke] = useState(false)

  useEffect(() => {
    if (!writerRef.current) return
    writerRef.current.innerHTML = ''
    if (!showStroke) return
    writerInstance.current = HanziWriter.create(writerRef.current, character.strokeKey, {
      width: 200,
      height: 200,
      padding: 12,
      showOutline: true,
      strokeAnimationSpeed: 0.4,
      delayBetweenStrokes: 600,
      radicalColor: '#ef476f',
      showCharacter: false,
      delayBetweenLoops: 2000,
    })
    // 添加田字格背景
    const svg = writerRef.current.querySelector('svg')
    if (svg) {
      svg.style.background = '#fafafa'
      svg.style.borderRadius = '8px'
      svg.style.boxShadow = 'inset 0 0 0 1px #ddd'
      // 田字格十字线
      const cx = 100, cy = 100
      const ns = 'http://www.w3.org/2000/svg'
      const hLine = document.createElementNS(ns, 'line')
      hLine.setAttribute('x1', '12')
      hLine.setAttribute('y1', '100')
      hLine.setAttribute('x2', '188')
      hLine.setAttribute('y2', '100')
      hLine.setAttribute('stroke', '#e0e0e0')
      hLine.setAttribute('stroke-width', '0.5')
      svg.prepend(hLine)
      const vLine = document.createElementNS(ns, 'line')
      vLine.setAttribute('x1', '100')
      vLine.setAttribute('y1', '12')
      vLine.setAttribute('x2', '100')
      vLine.setAttribute('y2', '188')
      vLine.setAttribute('stroke', '#e0e0e0')
      vLine.setAttribute('stroke-width', '0.5')
      svg.prepend(vLine)
      // 外框虚线
      const rect = document.createElementNS(ns, 'rect')
      rect.setAttribute('x', '12')
      rect.setAttribute('y', '12')
      rect.setAttribute('width', '176')
      rect.setAttribute('height', '176')
      rect.setAttribute('fill', 'none')
      rect.setAttribute('stroke', '#ccc')
      rect.setAttribute('stroke-width', '0.5')
      rect.setAttribute('stroke-dasharray', '3,3')
      svg.prepend(rect)
    }
  }, [character, showStroke])

  return (
    <article className={`character-card ${compact ? 'compact' : ''}`}>
      <div className="picture-orbit" aria-label={`${character.char}的实物图`}>
        <span>{character.imageGlyph}</span>
      </div>
      <div className="hanzi-main" onClick={function() { setShowStroke(!showStroke) }} style={{cursor: "pointer"}}>{character.char}</div>
      <p className="pinyin">{character.pinyin}</p>
      <p className="meaning">{character.meaning}</p>
      <div className="word-chips">
        {character.words.map(function(word) { return <span key={word}>{word}</span> })}
      </div>
      <p className="sentence">{character.sentences[0]}</p>
      <div className="card-actions">
        <button onClick={function() { 
          const data = character.pinyin ? character.pinyin : ""
          const wordText = character.words.length > 0 ? "，" + character.words.join("，") : ""
          const sentenceText = character.sentences[0] ? "。" + character.sentences[0] : ""
          speak(character.char + "，" + data + wordText + sentenceText) 
        }} title="播放读音">
          <Volume2 size={18} /> 听读音
        </button>
        <button onClick={function() {
          setShowStroke(!showStroke)
          if (!showStroke) setTimeout(function() { if (writerInstance.current) writerInstance.current.animateCharacter() }, 300)
        }} title="播放笔顺">
          <Play size={18} /> {showStroke ? '收起笔顺' : '看笔顺'}
        </button>
      </div>
      {showStroke && <div className="writer-box" ref={writerRef} aria-label="笔顺动画" />}
    </article>
  )
}
