import type { CharacterItem } from '../types'
import { charData } from './charData'

let preferredVoice: SpeechSynthesisVoice | null = null

function findChineseFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  const female = voices.find((v) => {
    const name = v.name.toLowerCase()
    return v.lang.startsWith('zh') && (name.includes('female') || name.includes('girl') || name.includes('xiao') || name.includes('mei') || name.includes('lady') || name.includes('woman') || name.includes('jia') || name.includes('女'))
  })
  if (female) return female
  const zh = voices.find((v) => v.lang.startsWith('zh'))
  if (zh) return zh
  return voices[0] ?? null
}

export function warmupVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.getVoices()
  if ('onvoiceschanged' in window.speechSynthesis) {
    ;(window.speechSynthesis as any).onvoiceschanged = () => { preferredVoice = findChineseFemaleVoice() }
  }
  preferredVoice = findChineseFemaleVoice()
}

export const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.55
  utterance.pitch = 1.2
  utterance.volume = 1.0
  if (!preferredVoice) preferredVoice = findChineseFemaleVoice()
  if (preferredVoice) utterance.voice = preferredVoice
  window.speechSynthesis.speak(utterance)
}

export function speakCharacter(char: CharacterItem) {
  const data = charData[char.char]
  const text = data ? `${char.char}，${data.pinyin}` : char.char
  speak(text)
}

export function speakQuiz(character: CharacterItem) {
  const data = charData[character.char]
  const text = data ? `${character.char}，${data.pinyin}。` : character.char
  speak(text)
}
