import { PencilLine } from 'lucide-react'
import { sentenceTemplates } from '../data'

export function StudioScreen({
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
  const preview = sentenceTemplates[templateIndex]
    .replace('{word}', chosenWord || words[0])
    .replace('{place}', '故事森林')

  return (
    <section className="studio-layout">
      <div className="section-title">
        <p className="eyebrow">创意工坊</p>
        <h2>用认识的字拼一句话</h2>
        <p>选择一个词和一个句式，生成自己的小故事句子。</p>
      </div>

      <div className="studio-card">
        <p className="studio-label">第一步：选句式</p>
        <div className="template-row">
          {sentenceTemplates.map((template, index) => (
            <button
              className={index === templateIndex ? 'active' : ''}
              key={template}
              onClick={() => setTemplateIndex(index)}
            >
              {template.replace('{word}', '____').replace('{place}', '____')}
            </button>
          ))}
        </div>
      </div>

      <div className="studio-card">
        <p className="studio-label">第二步：选词语</p>
        <div className="word-bank">
          {words.slice(0, 24).map((word) => (
            <button
              className={word === chosenWord ? 'active' : ''}
              key={word}
              onClick={() => setChosenWord(word)}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <div className="studio-card highlight-card">
        <p className="studio-label">你的句子</p>
        <article className="creation-preview">
          <PencilLine size={32} />
          <strong className="preview-text">{preview}</strong>
          <button className="primary-action action-btn" onClick={saveCreation}>
            保存我的句子 ✨
          </button>
        </article>
      </div>
    </section>
  )
}
