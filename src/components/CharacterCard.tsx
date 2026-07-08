import { useEffect, useRef } from 'react'
import HanziWriter from 'hanzi-writer'
import { Play, Volume2 } from 'lucide-react'
import type { CharacterItem } from '../types'
import { speak, speakCharacter } from '../utils/speech'

export function CharacterCard({ character, compact }: { character: CharacterItem; compact?: boolean }) {
  const writerRef = useRef<HTMLDivElement>(null)
  const writerInstance = useRef<ReturnType<typeof HanziWriter.create> | null>(null)

  useEffect(() => {
    if (!writerRef.current) return
    writerRef.current.innerHTML = ''
    writerInstance.current = HanziWriter.create(writerRef.current, character.strokeKey, {
      width: compact ? 110 : 160,
      height: compact ? 110 : 160,
      padding: 8,
      showOutline: true,
      strokeAnimationSpeed: 0.35,
      delayBetweenStrokes: 450,
      radicalColor: '#ef476f',
    })
  }, [character, compact])

  return (
    <article className={`character-card ${compact ? 'compact' : ''}`}>
      <div className="picture-orbit" aria-label={`${character.char}的图像联想`}>
        <span>{character.imageGlyph}</span>
      </div>
      <div className="hanzi-main">{character.char}</div>
      <p className="pinyin">{character.pinyin}</p>
      <p className="meaning">{character.meaning}</p>
      {!compact && (
        <>
          <div className="word-chips">
            {character.words.map((word) => <span key={word}>{word}</span>)}
          </div>
          <p className="sentence">{character.sentences[0]}</p>
        </>
      )}
      <div className="card-actions">
        <button onClick={() => speakCharacter(character)} title="播放读音">
          <Volume2 size={18} /> 听读音
        </button>
        <button onClick={() => writerInstance.current?.animateCharacter()} title="播放笔顺">
          <Play size={18} /> 看笔顺
        </button>
      </div>
      <div className="writer-box" ref={writerRef} aria-label="笔顺动画" />
    </article>
  )
}
