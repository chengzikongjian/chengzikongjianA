import { Mic2, Volume2 } from 'lucide-react'
import { VoiceFeedback } from './VoiceFeedback'
import { speak, speakQuiz } from '../utils/speech'
import { gameLabels } from '../utils/quiz'
import type { QuizQuestion } from '../utils/quiz'

export function QuizPanel({
  quiz,
  quizIndex,
  feedback,
  answerQuestion,
}: {
  quiz: QuizQuestion[]
  quizIndex: number
  feedback: 'correct' | 'wrong' | 'done' | null
  answerQuestion: (choice: import('../types').CharacterItem) => void
}) {
  const current = quiz[quizIndex]
  if (!current) {
    return (
      <aside className="quiz-panel calm-panel">
        <Mic2 size={32} />
        <h2>准备好了吗？开始闯关吧！</h2>
        <p>每次闯关会把本课汉字混合成看图、听音和拼音小游戏。</p>
      </aside>
    )
  }

  return (
    <aside className={`quiz-panel ${feedback === 'correct' ? 'glow-correct' : feedback === 'wrong' ? 'glow-wrong' : ''}`}>
      <div className="quiz-header">
        <span className="quiz-progress">
          第 <strong>{quizIndex + 1}</strong> 题 / 共 {quiz.length} 题
        </span>
        <span className="quiz-type-badge">{gameLabels[current.type]}</span>
      </div>

      <h2 className="quiz-prompt">{current.prompt}</h2>

      {current.type === 'image-choice' && (
        <div className="quiz-picture-wrapper">
          <span className="quiz-picture">{current.character.imageGlyph}</span>
        </div>
      )}

      {current.type === 'audio-choice' && (
        <button className="listen-big pulse-anim" onClick={() => speakQuiz(current.character)}>
          <Volume2 size={24} /> 再听一次
        </button>
      )}

      <div className={`option-grid ${feedback === 'correct' ? 'disabled' : feedback === 'wrong' ? 'disabled' : ''}`}>
        {current.options.map((option) => (
          <button
            className={`option-btn ${feedback && option.id === current.character.id && feedback === 'correct' ? 'correct-option' : ''} ${feedback && option.id !== current.character.id && feedback === 'wrong' ? 'wrong-option' : ''}`}
            key={option.id}
            onClick={() => answerQuestion(option)}
            disabled={!!feedback}
          >
            <span className="option-char">{option.char}</span>
            <small className="option-hint">{current.type === 'pinyin-match' ? option.pinyin : option.words[0]}</small>
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`feedback-banner ${feedback}`}>
          <span className="feedback-icon">{feedback === 'correct' ? '✨' : feedback === 'wrong' ? '💪' : '🎉'}</span>
          <span className="feedback-text">
            {feedback === 'correct' && '答对啦，星光亮了一点！'}
            {feedback === 'wrong' && '再试一次，应该是 "' + current.character.char + '"，加油！'}
            {feedback === 'done' && '闯关完成！故事已经解锁了，去读一读吧！'}
          </span>
        </div>
      )}
      {feedback === 'correct' && <VoiceFeedback text="恭喜你回答正确，你太棒了！" />}
      {feedback === 'wrong' && <VoiceFeedback text="很遗憾答错了，请再次选择" />}
    </aside>
  )
}
