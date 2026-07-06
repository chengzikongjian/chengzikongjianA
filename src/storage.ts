import { openDB } from 'idb'
import type { UserProgress } from './types'

const DB_NAME = 'hanzi-adventure-db'
const STORE_NAME = 'progress'
const PROGRESS_KEY = 'current-child'

export const defaultProgress: UserProgress = {
  learnedCharacterIds: [],
  lessonStars: {},
  badges: [],
  streakDays: 0,
  storyUnlocks: [],
  createdSentences: [],
}

const getDb = () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    },
  })

export async function loadProgress(): Promise<UserProgress> {
  const db = await getDb()
  const saved = await db.get(STORE_NAME, PROGRESS_KEY)
  return saved ?? defaultProgress
}

export async function saveProgress(progress: UserProgress) {
  const db = await getDb()
  await db.put(STORE_NAME, progress, PROGRESS_KEY)
}
