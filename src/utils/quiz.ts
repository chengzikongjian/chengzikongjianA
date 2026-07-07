import { characters } from '../data'
import type { CharacterItem, GameType, Lesson } from '../types'

export interface QuizQuestion {
  type: GameType
  character: CharacterItem
  prompt: string
  options: CharacterItem[]
}

export const gameLabels: Record<GameType, string> = {
  'image-choice': '看图选字',
  'audio-choice': '听音选字',
  'pinyin-match': '拼音配对',
  'story-find': '故事找字',
}

export const getCharactersByLesson = (lesson: Lesson) =>
  lesson.characterIds.map((id) => characters.find((item) => item.id === id)).filter(Boolean) as CharacterItem[]

const pickOptions = (answer: CharacterItem, count = 4) => {
  const pool = characters.filter((item) => item.id !== answer.id).sort(() => Math.random() - 0.5)
  return [answer, ...pool.slice(0, count - 1)].sort(() => Math.random() - 0.5)
}

export const makeQuestions = (lesson: Lesson): QuizQuestion[] => {
  const lessonCharacters = getCharactersByLesson(lesson)
  return lessonCharacters.map((character, index) => {
    const type = lesson.gameTypes[index % lesson.gameTypes.length]
    const prompt =
      type === 'image-choice'
        ? `看看图示，选出"${character.meaning}"对应的字。`
        : type === 'audio-choice'
          ? '听一听，选出你听到的汉字。'
          : type === 'pinyin-match'
            ? `哪个汉字读作 ${character.pinyin}？`
            : `在故事里找到"${character.char}"。`
    return { type, character, prompt, options: pickOptions(character) }
  })
}
