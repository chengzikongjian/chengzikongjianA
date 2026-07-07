import type { LevelId } from './types'

export interface TrainingMode {
  id: string
  title: string
  stage: 'kindergarten' | 'lower-primary' | 'upper-primary'
  levelIds: LevelId[]
  purpose: string
  play: string
  reward: string
}

export interface TextbookUnit {
  id: string
  publisher: '部编版' | '人教版'
  grade: string
  unit: string
  lesson: string
  characters: string[]
  focus: string
}

export interface StudyPlanTemplate {
  id: string
  title: string
  audience: string
  dailyTarget: string
  reviewMode: string
  parentControl: string
}

export const trainingModes: TrainingMode[] = [
  {
    id: 'pictograph',
    title: '象形动画识字',
    stage: 'kindergarten',
    levelIds: ['sprout', 'bridge'],
    purpose: '用图形演变帮助低龄儿童建立字形和字义连接。',
    play: '图画 -> 象形轮廓 -> 现代汉字三段式动画。',
    reward: '贴纸、勋章、角色表情反馈，无扣分。',
  },
  {
    id: 'scene-find',
    title: '场景找字',
    stage: 'kindergarten',
    levelIds: ['sprout', 'bridge'],
    purpose: '把客厅、动物园、校园等场景与汉字绑定。',
    play: '在场景词中点选目标字，支持听音提示。',
    reward: '找齐后解锁卡通贴纸。',
  },
  {
    id: 'stroke-puzzle',
    title: '笔画拼图',
    stage: 'lower-primary',
    levelIds: ['grade1', 'grade2'],
    purpose: '巩固基本笔画、笔顺和字形结构。',
    play: '按提示把笔画拖入正确位置，再播放标准笔顺。',
    reward: '闯关星星和错题复盘。',
  },
  {
    id: 'word-rush',
    title: '组词闯关',
    stage: 'lower-primary',
    levelIds: ['grade1', 'grade2'],
    purpose: '从会认字过渡到会用词。',
    play: '选择能组成常用词的字卡，完成词语篮。',
    reward: '积分、等级升级、复习推荐。',
  },
  {
    id: 'similar-diff',
    title: '形近字找茬',
    stage: 'upper-primary',
    levelIds: ['grade34', 'grade56'],
    purpose: '强化形近字、易错字辨析。',
    play: '在语境中区分字形差异和词义差异。',
    reward: '生成专属错题本。',
  },
  {
    id: 'context-fill',
    title: '语段辨字',
    stage: 'upper-primary',
    levelIds: ['grade34', 'grade56'],
    purpose: '服务阅读理解、成语积累和习作表达。',
    play: '根据语段意思选择正确汉字、成语或多音字读法。',
    reward: '阅读积分和阶段证书。',
  },
]

export const textbookUnits: TextbookUnit[] = [
  { id: 'tb-1-1', publisher: '部编版', grade: '一年级上', unit: '识字一', lesson: '天地人', characters: ['天', '地', '人', '你', '我', '他'], focus: '入学第一组高频独体字。' },
  { id: 'tb-1-2', publisher: '部编版', grade: '一年级上', unit: '识字二', lesson: '金木水火土', characters: ['一', '二', '三', '四', '五', '金', '木', '水', '火', '土'], focus: '数字和自然基础字。' },
  { id: 'tb-2-1', publisher: '部编版', grade: '二年级上', unit: '课文一', lesson: '小蝌蚪找妈妈', characters: ['两', '哪', '宽', '顶', '眼', '睛', '肚', '皮'], focus: '动物故事中的形声字和身体部位字。' },
  { id: 'tb-3-1', publisher: '部编版', grade: '三年级上', unit: '第一单元', lesson: '大青树下的小学', characters: ['晨', '绒', '球', '汉', '艳', '服', '装', '扮'], focus: '校园生活词和描写词。' },
  { id: 'tb-4-1', publisher: '部编版', grade: '四年级上', unit: '第一单元', lesson: '观潮', characters: ['潮', '据', '堤', '阔', '笼', '罩', '盼', '滚'], focus: '写景文章中的观察和动态描写字。' },
  { id: 'tb-5-1', publisher: '部编版', grade: '五年级上', unit: '第一单元', lesson: '白鹭', characters: ['嫌', '嵌', '匣', '嗜', '鹭', '朱', '框', '哨'], focus: '文学描写和审美表达。' },
  { id: 'tb-6-1', publisher: '部编版', grade: '六年级上', unit: '第一单元', lesson: '草原', characters: ['毯', '陈', '裳', '虹', '蹄', '腐', '稍', '微'], focus: '长文阅读中的写景和情感表达。' },
]

export const studyPlanTemplates: StudyPlanTemplate[] = [
  { id: 'kindergarten-plan', title: '幼儿园启蒙计划', audience: '3-6岁', dailyTarget: '每天 5-8 个生活常见字', reviewMode: '每 3 天用场景找字复习一次', parentControl: '家长可添加本周重点字，不启用计分惩罚。' },
  { id: 'daily-plan', title: '每日识字计划', audience: '小学1-2年级', dailyTarget: '每天 8-12 个课内生字', reviewMode: '当天听读 + 次日描红 + 周末错字复盘', parentControl: '可设置学习时长和课本版本。' },
  { id: 'unit-plan', title: '单元专项复习', audience: '小学3-6年级', dailyTarget: '按单元课文同步生字', reviewMode: '形近字、多音字、语段填空混合复习', parentControl: '可选择期中、期末或薄弱单元专项。' },
]
