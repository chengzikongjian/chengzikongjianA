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
      width: 176,
      height: 176,
      padding: 20,
      showOutline: true,
      strokeAnimationSpeed: 0.4,
      delayBetweenStrokes: 600,
      radicalColor: '#ef476f',
    })
  }, [character, showStroke])

  return (
    <article className={`character-card ${compact ? 'compact' : ''}`}>
      <div className="picture-orbit" aria-label={`${character.char}的实物图`}>
        <span>{character.imageGlyph}</span>
      </div>
      <div className="hanzi-main">{character.char}</div>
      <p className="pinyin">{character.pinyin}</p>
      <p className="meaning">{character.meaning}</p>
      <div className="word-chips">
        {character.words.map(function(word) { return <span key={word}>{word}</span> })}
      </div>
      <p className="sentence">{character.sentences[0]}</p>
      <div className="card-actions">
        <button onClick={function() { speakCharacter(character) }} title="播放读音">
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
