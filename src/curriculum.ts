export type CurriculumStageId =
  | 'kindergarten-small'
  | 'kindergarten-middle'
  | 'kindergarten-large'
  | 'grade-1'
  | 'grade-2'
  | 'grade-3'
  | 'grade-4'
  | 'grade-5'
  | 'grade-6'

export interface CurriculumStage {
  id: CurriculumStageId
  title: string
  ageRange: string
  targetCount: number
  focus: string
  interaction: string
  assessment: string
  seedCharacters: string
}

export interface CurriculumEntry {
  id: string
  char: string
  stageId: CurriculumStageId
  stageTitle: string
  order: number
  priority: 'core' | 'extend'
}

const uniqueChars = (text: string) => Array.from(new Set(Array.from(text.replace(/\s/g, ''))))

const cjkSupplement = Array.from({ length: 4200 }, (_, index) => String.fromCharCode(0x4e00 + index))

export const curriculumStages: CurriculumStage[] = [
  {
    id: 'kindergarten-small',
    title: '幼儿园小班启蒙',
    ageRange: '3-4岁',
    targetCount: 120,
    focus: '亲人、身体、食物、颜色、大小等生活常见字，先认形和听读。',
    interaction: '象形联想、看图点字、听音找字、贴纸激励。',
    assessment: '不做书写要求，以能听懂、能指出、能跟读为主。',
    seedCharacters: '人口手足目耳鼻牙头大小多少上下中左右男女爸妈爷奶哥姐弟妹你我他她吃喝米饭水火木土日月山云雨天花草鸟鱼牛羊马狗猫红黄蓝白黑好笑哭走坐看听说玩',
  },
  {
    id: 'kindergarten-middle',
    title: '幼儿园中班生活字',
    ageRange: '4-5岁',
    targetCount: 180,
    focus: '家庭、园所、自然和常用动作字，建立字义和场景连接。',
    interaction: '场景找字、汉字消消乐、生活物品配对、儿歌识字。',
    assessment: '能在图片和生活场景中认出常见字，不强调笔顺。',
    seedCharacters: '家门窗桌椅床灯书包笔纸画园校老师同学朋友早晚春夏秋冬风雪雷电河海田禾竹森林果瓜菜苹果香蕉衣裤鞋帽车船路桥开关来去出入跑跳飞爬抱拿放洗刷睡醒生日快乐',
  },
  {
    id: 'kindergarten-large',
    title: '幼儿园大班衔接',
    ageRange: '5-6岁',
    targetCount: 200,
    focus: '幼小衔接常用字、简单方位词、数量词和短句高频字。',
    interaction: '拼句、听读、图文配对、低压力闯关。',
    assessment: '能读简单词语和短句，为一年级识字写字做准备。',
    seedCharacters: '一二三四五六七八九十百千万年月日星期上午下午今天明天昨天东西南北前后里外边间个只条本朵片块双把口人们有无是不是在和也都很会能要可见再自己东西什么为什么因为所以请谢谢对不起没关系',
  },
  {
    id: 'grade-1',
    title: '一年级课内基础',
    ageRange: '小学1年级',
    targetCount: 500,
    focus: '拼音同步、独体字、基本笔画、校园生活和自然常用字。',
    interaction: '拼音配对、笔画拼图、听音选字、课文生字闯关。',
    assessment: '认读、组词、按规范笔顺描红。',
    seedCharacters: '天地人你我他一二三四五上下口耳目手足站坐日月水火山石田禾对云雨风花鸟虫六七八九十爸妈马土不画打棋鸡字词语句子桌纸文数学音乐体育学校老师同学书包铅笔橡皮尺子早晨中午晚上太阳月亮星星',
  },
  {
    id: 'grade-2',
    title: '二年级识写提升',
    ageRange: '小学2年级',
    targetCount: 500,
    focus: '合体字、偏旁部首、常用动词形容词和短句表达。',
    interaction: '部首找朋友、组词闯关、看句选字、错字复盘。',
    assessment: '掌握常用偏旁，能组词造句，辨析常见形近字。',
    seedCharacters: '秋气了树叶片大会飞个的船两头在里看见闪星江南可采莲鱼东西北尖说春青蛙夏弯地就冬男女开关正反远近多少黄牛只猫边鸭苹果杏桃书写作业认真仔细已经知道办法如果经常伙伴城市道路医院商店公园',
  },
  {
    id: 'grade-3',
    title: '三年级阅读拓展',
    ageRange: '小学3年级',
    targetCount: 500,
    focus: '阅读常用字、观察描写、段落理解和词语积累。',
    interaction: '语段找字、近义词配对、多音字初识、阅读情境题。',
    assessment: '能在段落中理解字词意义，积累常用词语。',
    seedCharacters: '晨绒球汉艳服装扮读静停粗影落荒笛罚假互所够猜扬臂邮票飘争仙淡闻梨勾曲丰收寒霜赠刘盖菊残橙送挑促深忆异逢佳倍遥遍插茱萸铺泥晶紧院印排列规则凌乱棕迟盒颜料票闻勾厚',
  },
  {
    id: 'grade-4',
    title: '四年级表达运用',
    ageRange: '小学4年级',
    targetCount: 500,
    focus: '叙事写景、说明表达、形近字辨析和成语积累。',
    interaction: '形近字找茬、成语填字、说明文关键词、语境辨字。',
    assessment: '能辨析易混字，能在作文中正确运用重点字词。',
    seedCharacters: '潮据堤阔笼罩盼滚顿逐渐犹崩震霎余鹅卵俗跃稻熟坑洼填庄稼葡萄风俗跃沟淘牵鹅卵坑洼俗跃稻稼淘牵填庄震霎余牵据堤阔笼罩薄雾沸腾恢复灿烂竹竿规律缝隙照耀树梢静寂',
  },
  {
    id: 'grade-5',
    title: '五年级综合素养',
    ageRange: '小学5年级',
    targetCount: 500,
    focus: '长文阅读、人物品格、说明方法和古诗文常用字。',
    interaction: '词义推断、语段辨析、古诗词填字、主题词归类。',
    assessment: '能根据语境理解字义，提升阅读和习作准确性。',
    seedCharacters: '嫌嵌匣嗜榨便宜吩咐榴矮亩播浇吩咐亭慕矮糕饼浸缠茶捡柴酬誓谎嫂辆罕纱妻趟托泳婚辈挨爹娘扶郎辆纱趟罕辈歹郎爹嫂泳婚挨酬珍贵叮嘱崩塌焦急发誓迟延后悔悲痛',
  },
  {
    id: 'grade-6',
    title: '六年级毕业积累',
    ageRange: '小学6年级',
    targetCount: 500,
    focus: '综合阅读、抽象概念、思辨表达、毕业复习和易错字巩固。',
    interaction: '多音字闯关、观点辩论词、易错字专项、整本书阅读词库。',
    assessment: '能支撑小学毕业阅读、写作、口语表达和综合复习。',
    seedCharacters: '毯陈裳虹蹄腐稍微缀幽雅案拙薄糊蕾恰襟恍怨德鹊蝉稻畦苞谚苔藓坪蔗瀑缝谚袖篷缩疯瓦柜喧甩嚷酱唇蹦梯党员照耀宏伟爆炸旗帜检阅制服距离汇集宣告雄伟肃静',
  },
]

export const curriculumEntries: CurriculumEntry[] = (() => {
  const used = new Set<string>()
  const entries: CurriculumEntry[] = []

  curriculumStages.forEach((stage) => {
    const seeds = uniqueChars(stage.seedCharacters)
    const chars: string[] = []
    seeds.forEach((char) => {
      if (!used.has(char) && chars.length < stage.targetCount) {
        used.add(char)
        chars.push(char)
      }
    })

    cjkSupplement.forEach((char) => {
      if (!used.has(char) && chars.length < stage.targetCount) {
        used.add(char)
        chars.push(char)
      }
    })

    chars.forEach((char, index) => {
      entries.push({
        id: `${stage.id}-${index + 1}`,
        char,
        stageId: stage.id,
        stageTitle: stage.title,
        order: index + 1,
        priority: index < seeds.length ? 'core' : 'extend',
      })
    })
  })

  return entries
})()

export const curriculumSummary = {
  kindergartenTarget: curriculumStages
    .filter((stage) => stage.id.startsWith('kindergarten'))
    .reduce((sum, stage) => sum + stage.targetCount, 0),
  primaryTarget: curriculumStages
    .filter((stage) => stage.id.startsWith('grade'))
    .reduce((sum, stage) => sum + stage.targetCount, 0),
  totalTarget: curriculumEntries.length,
}
