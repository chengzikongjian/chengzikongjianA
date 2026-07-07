import type { CharacterItem } from '../types'

export const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.85
  window.speechSynthesis.speak(utterance)
}

export const speakCharacter = (char: CharacterItem) => speak(char.char)
