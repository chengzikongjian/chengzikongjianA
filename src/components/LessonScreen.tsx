import { BookOpen, Gamepad2 } from 'lucide-react'
import type { CharacterItem, Lesson } from '../types'
import type { QuizQuestion } from '../utils/quiz'
import { CharacterCard } from './CharacterCard'
import { QuizPanel } from './QuizPanel'

export function LessonScreen({
  lesson,
  lessonCharacters,
  activeCharacter,
  quiz,
  quizIndex,
  feedback,
  storyUnlocked,
  setActiveCharacterId,
  startQuiz,
  answerQuestion,
  openStory,
}: {
  lesson: Lesson
  lessonCharacters: CharacterItem[]
  activeCharacter: CharacterItem
  quiz: QuizQuestion[]
  quizIndex: number
  feedback: 'correct' | 'wrong' | 'done' | null
  storyUnlocked: boolean
  setActiveCharacterId: (id: string) => void
  startQuiz: () => void
  answerQuestion: (choice: CharacterItem) => void
  openStory: () => void
}) {
  return (
    <section className="lesson-layout">
      <aside className="character-list" aria-label="本课汉字">
        <h2>{lesson.title}</h2>
        <p>{lesson.subtitle}</p>
        <div className="character-buttons">
          {lessonCharacters.map((item) => (
            <button
              className={item.id === activeCharacter.id ? 'active' : ''}
              key={item.id}
              onClick={() => setActiveCharacterId(item.id)}
            >
              {item.char}
            </button>
          ))}
        </div>
        <div className="lesson-actions">
          <button className="primary-action action-btn" onClick={startQuiz}>
            <Gamepad2 size={20} /> 开始闯关
          </button>
          <button className="secondary-action action-btn" disabled={!storyUnlocked} onClick={openStory}>
            <BookOpen size={20} /> {storyUnlocked ? '阅读已解锁故事' : '完成闯关解锁故事'}
          </button>
        </div>
      </aside>

      <CharacterCard character={activeCharacter} />

      <QuizPanel
        quiz={quiz}
        quizIndex={quizIndex}
        feedback={feedback}
        answerQuestion={answerQuestion}
      />
    </section>
  )
}
