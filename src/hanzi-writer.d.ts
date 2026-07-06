declare module 'hanzi-writer' {
  interface WriterOptions {
    width?: number
    height?: number
    padding?: number
    showOutline?: boolean
    showCharacter?: boolean
    strokeAnimationSpeed?: number
    delayBetweenStrokes?: number
    radicalColor?: string
  }

  interface WriterInstance {
    animateCharacter: () => void
    showCharacter: () => void
    hideCharacter: () => void
  }

  const HanziWriter: {
    create: (element: string | HTMLElement, character: string, options?: WriterOptions) => WriterInstance
  }

  export default HanziWriter
}
