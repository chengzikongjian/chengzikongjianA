export type LevelId =
  | 'sprout'
  | 'bridge'
  | 'grade1'
  | 'grade2'
  | 'grade34'
  | 'grade56'

export type GameType = 'image-choice' | 'audio-choice' | 'pinyin-match' | 'story-find'

export interface CharacterItem {
  id: string
  char: string
  pinyin: string
  audioUrl?: string
  imageUrl?: string
  imageGlyph: string
  meaning: string
  words: string[]
  sentences: string[]
  radical?: string
  structure?: string
  strokeCount?: number
  mistakeNote?: string
  pictographHint?: string
  level: LevelId
  tags: string[]
  strokeKey: string
}

export interface Lesson {
  id: string
  title: string
  subtitle: string
  level: LevelId
  characterIds: string[]
  gameTypes: GameType[]
  unlockRules: {
    requiredLessonId?: string
    minStars?: number
  }
  storyId: string
}

export interface Story {
  id: string
  title: string
  level: LevelId
  text: string
  highlightCharacterIds: string[]
  unlockAfterLessonIds: string[]
}

export interface CreatedSentence {
  id: string
  text: string
  createdAt: string
}

export interface UserProgress {
  learnedCharacterIds: string[]
  lessonStars: Record<string, number>
  badges: string[]
  streakDays: number
  storyUnlocks: string[]
  createdSentences: CreatedSentence[]
  lastStudyAt?: string
}

export interface GameResult {
  lessonId: string
  gameType: GameType
  score: number
  accuracy: number
  stars: number
  completedAt: string
}

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
}
