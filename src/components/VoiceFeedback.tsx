import { useEffect } from 'react'

export function VoiceFeedback({ text }: { text: string }) {
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'zh-CN'
      u.rate = 0.6
      u.pitch = 1.2
      // Try to find a female Chinese voice
      const voices = window.speechSynthesis.getVoices()
      const female = voices.find(v => v.lang.startsWith('zh') && (v.name.toLowerCase().includes('female') || v.name.includes('女')))
      const zh = voices.find(v => v.lang.startsWith('zh'))
      if (female) u.voice = female
      else if (zh) u.voice = zh
      window.speechSynthesis.speak(u)
    }
  }, [text])
  return null
}
