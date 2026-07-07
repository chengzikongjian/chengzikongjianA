import { characters, stories } from '../data'
import type { Lesson } from '../types'

export function StoryScreen({
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
  const highlightChars = new Map(
    story.highlightCharacterIds.map((id) => [characters.find((item) => item.id === id)?.char, id])
  )

  return (
    <section className="story-stage">
      <div className="section-title">
        <p className="eyebrow">故事找字</p>
        <h2>{story.title}</h2>
        <p>{isUnlocked ? '点击故事里亮起来的字，可以回到字卡复习。' : '完成当前关卡后，这个故事就会解锁。'}</p>
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
        <p className="eyebrow">故事书架上还有</p>
        <div className="story-shelf-items">
          {stories.map((item) => (
            <span className={`shelf-book ${unlockedStories.has(item.id) ? 'unlocked' : ''}`} key={item.id}>
              {unlockedStories.has(item.id) ? '📖' : '🔒'} {item.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
