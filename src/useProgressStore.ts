import { create } from 'zustand'
import { badges, lessons, stories } from './data'
import { defaultProgress, loadProgress, saveProgress } from './storage'
import type { CreatedSentence, GameResult, UserProgress } from './types'

interface ProgressState {
  progress: UserProgress
  hydrated: boolean
  hydrate: () => Promise<void>
  completeLesson: (result: GameResult, characterIds: string[]) => void
  addSentence: (text: string) => void
  resetProgress: () => void
}

const today = () => new Date().toISOString().slice(0, 10)

const unique = <T,>(items: T[]) => Array.from(new Set(items))

function computeStreak(lastStudyAt?: string, currentStreak = 0) {
  const current = today()
  if (!lastStudyAt) return 1
  if (lastStudyAt === current) return Math.max(currentStreak, 1)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return lastStudyAt === yesterday.toISOString().slice(0, 10) ? currentStreak + 1 : 1
}

function deriveBadges(progress: UserProgress) {
  const earned = new Set(progress.badges)
  const completedLessons = Object.keys(progress.lessonStars).filter((id) => progress.lessonStars[id] > 0)
  if (completedLessons.length >= 1) earned.add('first_lesson')
  if (progress.learnedCharacterIds.length >= 10) earned.add('ten_chars')
  if (progress.learnedCharacterIds.length >= 20) earned.add('twenty_chars')
  if (progress.storyUnlocks.length >= 5) earned.add('five_stories')
  if (progress.learnedCharacterIds.length >= 40) earned.add('grade34_ready')
  if (progress.learnedCharacterIds.length >= 50) earned.add('grade56_ready')
  if (completedLessons.length >= lessons.length) earned.add('all_lessons')
  return badges.filter((badge) => earned.has(badge.id)).map((badge) => badge.id)
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: defaultProgress,
  hydrated: false,
  async hydrate() {
    const progress = await loadProgress()
    set({ progress, hydrated: true })
  },
  completeLesson(result, characterIds) {
    const previous = get().progress
    const lesson = lessons.find((item) => item.id === result.lessonId)
    const storyIds = lesson ? stories.filter((story) => story.unlockAfterLessonIds.includes(lesson.id)).map((story) => story.id) : []
    const next: UserProgress = {
      ...previous,
      learnedCharacterIds: unique([...previous.learnedCharacterIds, ...characterIds]),
      lessonStars: {
        ...previous.lessonStars,
        [result.lessonId]: Math.max(previous.lessonStars[result.lessonId] ?? 0, result.stars),
      },
      storyUnlocks: unique([...previous.storyUnlocks, ...storyIds]),
      streakDays: computeStreak(previous.lastStudyAt, previous.streakDays),
      lastStudyAt: today(),
    }
    next.badges = deriveBadges(next)
    set({ progress: next })
    void saveProgress(next)
  },
  addSentence(text) {
    const previous = get().progress
    const sentence: CreatedSentence = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    }
    const next = {
      ...previous,
      createdSentences: [sentence, ...previous.createdSentences].slice(0, 12),
    }
    set({ progress: next })
    void saveProgress(next)
  },
  resetProgress() {
    set({ progress: defaultProgress })
    void saveProgress(defaultProgress)
  },
}))
