import { useEffect, useMemo, useRef, useState } from 'react'
import HanziWriter from 'hanzi-writer'
import {
  Award,
  BarChart3,
  LibraryBig,
  BookOpen,
  CheckCircle2,
  Gamepad2,
  Home,
  Mic2,
  PencilLine,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Volume2,
} from 'lucide-react'
import './App.css'
import { curriculumEntries, curriculumStages, curriculumSummary } from './curriculum'
import { badges, characters, lessons, levels, sentenceTemplates, stories } from './data'
import { useProgressStore } from './useProgressStore'
import type { CharacterItem, GameResult, GameType, Lesson } from './types'

type Screen = 'map' | 'lesson' | 'story' | 'studio' | 'library' | 'report' | 'badges'

interface QuizQuestion {
  type: GameType
  character: CharacterItem
  prompt: string
  options: CharacterItem[]
}

const gameLabels: Record<GameType, string> = {
  'image-choice': '看图选字',
  'audio-choice': '听音选字',
  'pinyin-match': '拼音配对',
  'story-find': '故事找字',
}

const getCharactersByLesson = (lesson: Lesson) =>
  lesson.characterIds.map((id) => characters.find((item) => item.id === id)).filter(Boolean) as CharacterItem[]

const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.85
  window.speechSynthesis.speak(utterance)
}

const pickOptions = (answer: CharacterItem, count = 4) => {
  const pool = characters.filter((item) => item.id !== answer.id).sort(() => Math.random() - 0.5)
  return [answer, ...pool.slice(0, count - 1)].sort(() => Math.random() - 0.5)
}

const makeQuestions = (lesson: Lesson): QuizQuestion[] => {
  const lessonCharacters = getCharactersByLesson(lesson)
  return lessonCharacters.map((character, index) => {
    const type = lesson.gameTypes[index % lesson.gameTypes.length]
    const prompt =
      type === 'image-choice'
        ? `看看图案，选出“${character.meaning}”对应的字。`
        : type === 'audio-choice'
          ? '听一听，选出你听到的汉字。'
          : type === 'pinyin-match'
            ? `哪个汉字读作 ${character.pinyin}？`
            : `在故事里找到“${character.char}”。`
    return { type, character, prompt, options: pickOptions(character) }
  })
}

function App() {
  const { progress, hydrated, hydrate, completeLesson, addSentence, resetProgress } = useProgressStore()
  const [screen, setScreen] = useState<Screen>('map')
  const [activeLessonId, setActiveLessonId] = useState(lessons[0].id)
  const [activeCharacterId, setActiveCharacterId] = useState(lessons[0].characterIds[0])
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'done' | null>(null)
  const [storyFound, setStoryFound] = useState<string[]>([])
  const [templateIndex, setTemplateIndex] = useState(0)
  const [chosenWord, setChosenWord] = useState('')

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0]
  const activeCharacters = useMemo(() => getCharactersByLesson(activeLesson), [activeLesson])
  const activeCharacter = characters.find((item) => item.id === activeCharacterId) ?? activeCharacters[0]
  const activeStory = stories.find((story) => story.id === activeLesson.storyId)
  const totalStars = Object.values(progress.lessonStars).reduce((sum, stars) => sum + stars, 0)
  const unlockedStories = new Set(progress.storyUnlocks)
  const learnedWords = characters
    .filter((item) => progress.learnedCharacterIds.includes(item.id))
    .flatMap((item) => item.words)

  const isLessonUnlocked = (lesson: Lesson) => {
    const required = lesson.unlockRules.requiredLessonId
    if (!required) return true
    return (progress.lessonStars[required] ?? 0) >= (lesson.unlockRules.minStars ?? 1)
  }

  const openLesson = (lesson: Lesson) => {
    if (!isLessonUnlocked(lesson)) return
    setActiveLessonId(lesson.id)
    setActiveCharacterId(lesson.characterIds[0])
    setScreen('lesson')
    setFeedback(null)
  }

  const startQuiz = () => {
    const nextQuiz = makeQuestions(activeLesson)
    setQuiz(nextQuiz)
    setQuizIndex(0)
    setCorrectCount(0)
    setFeedback(null)
    if (nextQuiz[0]?.type === 'audio-choice') speak(nextQuiz[0].character.char)
  }

  const answerQuestion = (choice: CharacterItem) => {
    if (!quiz[quizIndex] || feedback) return
    const isCorrect = choice.id === quiz[quizIndex].character.id
    const nextCorrect = correctCount + (isCorrect ? 1 : 0)
    setCorrectCount(nextCorrect)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    window.setTimeout(() => {
      const nextIndex = quizIndex + 1
      if (nextIndex >= quiz.length) {
        const accuracy = nextCorrect / quiz.length
        const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.65 ? 2 : 1
        const result: GameResult = {
          lessonId: activeLesson.id,
          gameType: quiz[quizIndex].type,
          score: nextCorrect,
          accuracy,
          stars,
          completedAt: new Date().toISOString(),
        }
        completeLesson(result, activeLesson.characterIds)
        setFeedback('done')
      } else {
        setQuizIndex(nextIndex)
        setFeedback(null)
        if (quiz[nextIndex].type === 'audio-choice') speak(quiz[nextIndex].character.char)
      }
    }, 760)
  }

  const saveCreation = () => {
    const word = chosenWord || learnedWords[0] || activeCharacters[0]?.words[0] || '汉字'
    addSentence(sentenceTemplates[templateIndex].replace('{word}', word).replace('{place}', '故事森林'))
    setChosenWord('')
    setScreen('badges')
  }

  if (!hydrated) {
    return <main className="loading">正在打开星光识字岛...</main>
  }

  return (
    <main className="app-shell">
      <Header totalStars={totalStars} learnedCount={progress.learnedCharacterIds.length} streakDays={progress.streakDays} />

      <nav className="top-nav" aria-label="主导航">
        <button className={screen === 'map' ? 'active' : ''} onClick={() => setScreen('map')}>
          <Home size={18} /> 学习地图
        </button>
        <button className={screen === 'story' ? 'active' : ''} onClick={() => setScreen('story')}>
          <BookOpen size={18} /> 故事
        </button>
        <button className={screen === 'studio' ? 'active' : ''} onClick={() => setScreen('studio')}>
          <PencilLine size={18} /> 创意工坊
        </button>
        <button className={screen === 'library' ? 'active' : ''} onClick={() => setScreen('library')}>
          <LibraryBig size={18} /> 分级字库
        </button>
        <button className={screen === 'report' ? 'active' : ''} onClick={() => setScreen('report')}>
          <BarChart3 size={18} /> 学情报告
        </button>
        <button className={screen === 'badges' ? 'active' : ''} onClick={() => setScreen('badges')}>
          <Award size={18} /> 成就
        </button>
      </nav>

      {screen === 'map' && (
        <MapScreen progressStars={progress.lessonStars} isLessonUnlocked={isLessonUnlocked} openLesson={openLesson} />
      )}

      {screen === 'lesson' && (
        <LessonScreen
          lesson={activeLesson}
          lessonCharacters={activeCharacters}
          activeCharacter={activeCharacter}
          quiz={quiz}
          quizIndex={quizIndex}
          feedback={feedback}
          storyUnlocked={activeStory ? unlockedStories.has(activeStory.id) : false}
          setActiveCharacterId={setActiveCharacterId}
          startQuiz={startQuiz}
          answerQuestion={answerQuestion}
          openStory={() => setScreen('story')}
        />
      )}

      {screen === 'story' && (
        <StoryScreen
          activeLesson={activeLesson}
          storyFound={storyFound}
          setStoryFound={setStoryFound}
          setActiveCharacterId={setActiveCharacterId}
          openLesson={() => setScreen('lesson')}
          unlockedStories={unlockedStories}
        />
      )}

      {screen === 'studio' && (
        <StudioScreen
          learnedWords={learnedWords}
          templateIndex={templateIndex}
          chosenWord={chosenWord}
          setTemplateIndex={setTemplateIndex}
          setChosenWord={setChosenWord}
          saveCreation={saveCreation}
        />
      )}

      {screen === 'library' && <LibraryScreen />}

      {screen === 'report' && <ReportScreen />}

      {screen === 'badges' && <BadgeScreen resetProgress={resetProgress} />}
    </main>
  )
}

function Header({ totalStars, learnedCount, streakDays }: { totalStars: number; learnedCount: number; streakDays: number }) {
  return (
    <header className="hero-band">
      <div>
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

function MapScreen({
  progressStars,
  isLessonUnlocked,
  openLesson,
}: {
  progressStars: Record<string, number>
  isLessonUnlocked: (lesson: Lesson) => boolean
  openLesson: (lesson: Lesson) => void
  }) {
  const currentLessonIndex = lessons.findIndex((lesson) => isLessonUnlocked(lesson) && (progressStars[lesson.id] ?? 0) === 0)
  const nextLessonIndex = currentLessonIndex === -1 ? lessons.length - 1 : currentLessonIndex

  return (
    <section className="chain-stage" aria-label="链式学习路径">
      <div className="section-title compact-title">
        <p className="eyebrow">学习链</p>
        <h2>从第一关开始，顺着星光往前走</h2>
      </div>
      <div className="learning-chain">
        {lessons.map((lesson, index) => {
          const unlocked = isLessonUnlocked(lesson)
          const stars = progressStars[lesson.id] ?? 0
          const level = levels.find((item) => item.id === lesson.level)
          const completed = stars > 0
          const current = index === nextLessonIndex && unlocked && !completed
          return (
            <button
              className={`chain-node ${completed ? 'completed' : ''} ${current ? 'current' : ''}`}
              disabled={!unlocked}
              key={lesson.id}
              onClick={() => openLesson(lesson)}
            >
              <span className="chain-step">{completed ? '✓' : unlocked ? index + 1 : '锁'}</span>
              <span className="chain-copy">
                <small>{level?.title}</small>
                <strong>{lesson.title}</strong>
                <em>{lesson.subtitle}</em>
              </span>
              <span className="chain-stars">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function LessonScreen({
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
      <aside className="character-list" aria-label="本关汉字">
        <h2>{lesson.title}</h2>
        <p>{lesson.subtitle}</p>
        <div className="character-buttons">
          {lessonCharacters.map((item) => (
            <button className={item.id === activeCharacter.id ? 'active' : ''} key={item.id} onClick={() => setActiveCharacterId(item.id)}>
              {item.char}
            </button>
          ))}
        </div>
        <button className="primary-action" onClick={startQuiz}>
          <Gamepad2 size={18} /> 开始闯关
        </button>
        <button className="secondary-action" disabled={!storyUnlocked} onClick={openStory}>
          <BookOpen size={18} /> {storyUnlocked ? '阅读解锁故事' : '完成闯关解锁故事'}
        </button>
      </aside>

      <CharacterCard character={activeCharacter} />

      <QuizPanel quiz={quiz} quizIndex={quizIndex} feedback={feedback} answerQuestion={answerQuestion} />
    </section>
  )
}

function CharacterCard({ character }: { character: CharacterItem }) {
  const writerRef = useRef<HTMLDivElement>(null)
  const writerInstance = useRef<ReturnType<typeof HanziWriter.create> | null>(null)

  useEffect(() => {
    if (!writerRef.current) return
    writerRef.current.innerHTML = ''
    writerInstance.current = HanziWriter.create(writerRef.current, character.strokeKey, {
      width: 160,
      height: 160,
      padding: 10,
      showOutline: true,
      strokeAnimationSpeed: 1.2,
      delayBetweenStrokes: 120,
      radicalColor: '#ef476f',
    })
  }, [character])

  return (
    <article className="character-card">
      <div className="picture-orbit" aria-label={`${character.char} 的图像联想`}>
        <span>{character.imageGlyph}</span>
      </div>
      <div className="hanzi-main">{character.char}</div>
      <p className="pinyin">{character.pinyin}</p>
      <p className="meaning">{character.meaning}</p>
      <div className="word-chips">
        {character.words.map((word) => <span key={word}>{word}</span>)}
      </div>
      <p className="sentence">{character.sentences[0]}</p>
      <div className="card-actions">
        <button onClick={() => speak(character.char)} title="播放读音">
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

function QuizPanel({
  quiz,
  quizIndex,
  feedback,
  answerQuestion,
}: {
  quiz: QuizQuestion[]
  quizIndex: number
  feedback: 'correct' | 'wrong' | 'done' | null
  answerQuestion: (choice: CharacterItem) => void
}) {
  const current = quiz[quizIndex]
  if (!current) {
    return (
      <aside className="quiz-panel calm-panel">
        <Mic2 size={28} />
        <h2>准备好就开始闯关</h2>
        <p>每次闯关会把本课汉字混合成看图、听音和拼音小游戏。</p>
      </aside>
    )
  }

  return (
    <aside className="quiz-panel">
      <p className="eyebrow">第 {quizIndex + 1} 题 / 共 {quiz.length} 题 · {gameLabels[current.type]}</p>
      <h2>{current.prompt}</h2>
      {current.type === 'image-choice' && <div className="quiz-picture">{current.character.imageGlyph}</div>}
      {current.type === 'audio-choice' && (
        <button className="listen-big" onClick={() => speak(current.character.char)}>
          <Volume2 size={22} /> 再听一次
        </button>
      )}
      <div className="option-grid">
        {current.options.map((option) => (
          <button key={option.id} onClick={() => answerQuestion(option)}>
            <span>{option.char}</span>
            <small>{current.type === 'pinyin-match' ? option.pinyin : option.words[0]}</small>
          </button>
        ))}
      </div>
      {feedback && (
        <div className={`feedback ${feedback}`}>
          {feedback === 'correct' && '答对啦，星光亮了一点！'}
          {feedback === 'wrong' && '再试也没关系，我们记住它。'}
          {feedback === 'done' && '闯关完成！故事已经解锁。'}
        </div>
      )}
    </aside>
  )
}

function StoryScreen({
  activeLesson,
  storyFound,
  setStoryFound,
  setActiveCharacterId,
  openLesson,
  unlockedStories,
}: {
  activeLesson: Lesson
  storyFound: string[]
  setStoryFound: (ids: string[]) => void
  setActiveCharacterId: (id: string) => void
  openLesson: () => void
  unlockedStories: Set<string>
}) {
  const story = stories.find((item) => item.id === activeLesson.storyId) ?? stories[0]
  const isUnlocked = unlockedStories.has(story.id)
  const highlightChars = new Map(story.highlightCharacterIds.map((id) => [characters.find((item) => item.id === id)?.char, id]))

  return (
    <section className="story-stage">
      <div className="section-title">
        <p className="eyebrow">故事找字</p>
        <h2>{story.title}</h2>
        <p>{isUnlocked ? '点击亮起来的字，可以回到字卡复习。' : '完成当前关卡后，这个故事就会解锁。'}</p>
      </div>
      <article className={`story-book ${!isUnlocked ? 'locked-story' : ''}`}>
        {story.text.split('').map((char, index) => {
          const id = highlightChars.get(char)
          const found = id ? storyFound.includes(id) : false
          return id && isUnlocked ? (
            <button
              className={found ? 'story-char found' : 'story-char'}
              key={`${char}-${index}`}
              onClick={() => {
                setStoryFound(Array.from(new Set([...storyFound, id])))
                setActiveCharacterId(id)
                openLesson()
              }}
            >
              {char}
            </button>
          ) : (
            <span key={`${char}-${index}`}>{char}</span>
          )
        })}
      </article>
      <div className="story-shelf">
        {stories.map((item) => (
          <span className={unlockedStories.has(item.id) ? 'unlocked' : ''} key={item.id}>{item.title}</span>
        ))}
      </div>
    </section>
  )
}

function StudioScreen({
  learnedWords,
  templateIndex,
  chosenWord,
  setTemplateIndex,
  setChosenWord,
  saveCreation,
}: {
  learnedWords: string[]
  templateIndex: number
  chosenWord: string
  setTemplateIndex: (index: number) => void
  setChosenWord: (word: string) => void
  saveCreation: () => void
}) {
  const words = learnedWords.length ? learnedWords : ['太阳', '小手', '白云', '小花']
  const preview = sentenceTemplates[templateIndex].replace('{word}', chosenWord || words[0]).replace('{place}', '故事森林')
  return (
    <section className="studio-layout">
      <div className="section-title">
        <p className="eyebrow">创意工坊</p>
        <h2>用认识的字拼一句话</h2>
        <p>选择一个词和一个句式，生成自己的小故事句子。</p>
      </div>
      <div className="template-row">
        {sentenceTemplates.map((template, index) => (
          <button className={index === templateIndex ? 'active' : ''} key={template} onClick={() => setTemplateIndex(index)}>
            {template.replace('{word}', '____').replace('{place}', '____')}
          </button>
        ))}
      </div>
      <div className="word-bank">
        {words.slice(0, 18).map((word) => (
          <button className={word === chosenWord ? 'active' : ''} key={word} onClick={() => setChosenWord(word)}>{word}</button>
        ))}
      </div>
      <article className="creation-preview">
        <PencilLine size={26} />
        <strong>{preview}</strong>
        <button className="primary-action" onClick={saveCreation}>保存我的句子</button>
      </article>
    </section>
  )
}

function LibraryScreen() {
  return (
    <section className="library-layout">
      <div className="section-title">
        <p className="eyebrow">分级字库</p>
        <h2>按幼儿园和小学 1-6 年级建立课程识字库</h2>
        <p>当前版本采用课程目标库 + 精编互动关卡的双层结构，先保证覆盖规模，再逐步补充人工校对释义、音频和课文同步。</p>
      </div>

      <div className="library-summary">
        <article>
          <strong>{curriculumSummary.kindergartenTarget}</strong>
          <span>幼儿园启蒙目标字</span>
        </article>
        <article>
          <strong>{curriculumSummary.primaryTarget}</strong>
          <span>小学 1-6 年级目标字</span>
        </article>
        <article>
          <strong>{curriculumSummary.totalTarget}</strong>
          <span>分级字库总条目</span>
        </article>
      </div>

      <div className="stage-library-grid">
        {curriculumStages.map((stage) => {
          const entries = curriculumEntries.filter((entry) => entry.stageId === stage.id)
          const coreCount = entries.filter((entry) => entry.priority === 'core').length
          return (
            <article className="stage-library-card" key={stage.id}>
              <div className="stage-library-head">
                <div>
                  <p className="eyebrow">{stage.ageRange}</p>
                  <h3>{stage.title}</h3>
                </div>
                <strong>{entries.length} 字</strong>
              </div>
              <p>{stage.focus}</p>
              <dl>
                <div>
                  <dt>互动形式</dt>
                  <dd>{stage.interaction}</dd>
                </div>
                <div>
                  <dt>评价重点</dt>
                  <dd>{stage.assessment}</dd>
                </div>
              </dl>
              <div className="library-meta">
                <span>核心样例 {coreCount} 字</span>
                <span>拓展补齐 {entries.length - coreCount} 字</span>
              </div>
              <div className="character-sample-grid" aria-label={`${stage.title}样例字`}>
                {entries.slice(0, 42).map((entry) => <span key={entry.id}>{entry.char}</span>)}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function ReportScreen() {
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
  const reviewCharacters = (reviewLessons.length ? reviewLessons.flatMap((lesson) => lesson.characterIds) : characters.map((item) => item.id))
    .map((id) => characters.find((item) => item.id === id))
    .filter((item): item is CharacterItem => Boolean(item))
    .filter((item) => reviewLessons.length || !learned.has(item.id))
    .slice(0, 10)

  return (
    <section className="report-layout">
      <div className="section-title">
        <p className="eyebrow">学情报告</p>
        <h2>今天的学习轨迹在这里</h2>
        <p>本地记录识字数量、关卡星级、分级进度和下一组复习字。</p>
      </div>

      <div className="report-cards">
        <article className="report-card">
          <Sparkles size={24} />
          <strong>{learned.size}</strong>
          <span>已认识汉字</span>
        </article>
        <article className="report-card">
          <Star size={24} />
          <strong>{totalStars}/{lessons.length * 3}</strong>
          <span>关卡星级</span>
        </article>
        <article className="report-card">
          <CheckCircle2 size={24} />
          <strong>{completedLessons.length}/{lessons.length}</strong>
          <span>完成关卡</span>
        </article>
        <article className="report-card">
          <Target size={24} />
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
              <div>
                <h3>{level.title}</h3>
                <span>{done}/{total} 字</span>
              </div>
              <div className="progress-track" aria-label={`${level.title}掌握率 ${percent}%`}>
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
              <span key={item.id}>{item.char}<small>{item.pinyin}</small></span>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

function BadgeScreen({ resetProgress }: { resetProgress: () => void }) {
  const { progress } = useProgressStore()
  const earned = new Set(progress.badges)
  return (
    <section className="badge-layout">
      <div className="section-title">
        <p className="eyebrow">学习成就</p>
        <h2>把每一次努力收进星光册</h2>
      </div>
      <div className="badge-grid">
        {badges.map((badge) => (
          <article className={earned.has(badge.id) ? 'badge earned' : 'badge'} key={badge.id}>
            <span>{badge.icon}</span>
            <h3>{badge.title}</h3>
            <p>{badge.description}</p>
          </article>
        ))}
      </div>
      <div className="sentence-log">
        <h3>我的句子</h3>
        {progress.createdSentences.length === 0 ? <p>还没有保存句子，去创意工坊试试吧。</p> : null}
        {progress.createdSentences.map((sentence) => <p key={sentence.id}>{sentence.text}</p>)}
      </div>
      <button className="danger-action" onClick={resetProgress}>
        <RotateCcw size={18} /> 重置本地学习进度
      </button>
    </section>
  )
}

export default App
