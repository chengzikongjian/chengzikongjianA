import os, re
root = os.getcwd()

with open(os.path.join(root, 'src/supportData.ts'), 'r', encoding='utf-8') as f:
    content = f.read()

# ===== New comprehensive textbook units =====
new_textbook = '''export const textbookUnits: TextbookUnit[] = [
  // ========== 一年级上册 ==========
  { id: "tb-1-1", publisher: "部编版", grade: "一年级上", unit: "识字一", lesson: "天地人", characters: ["天","地","人","你","我","他"], focus: "入学第一组高频独体字" },
  { id: "tb-1-2", publisher: "部编版", grade: "一年级上", unit: "识字二", lesson: "金木水火土", characters: ["一","二","三","四","五","金","木","水","火","土"], focus: "数字和自然基础字" },
  { id: "tb-1-3", publisher: "部编版", grade: "一年级上", unit: "识字三", lesson: "口耳目", characters: ["口","耳","目","手","足","站","坐","行"], focus: "身体部位常用字" },
  { id: "tb-1-4", publisher: "部编版", grade: "一年级上", unit: "识字四", lesson: "日月水火", characters: ["日","月","水","火","山","石","田","禾"], focus: "自然事物象形字" },
  { id: "tb-1-5", publisher: "部编版", grade: "一年级上", unit: "识字五", lesson: "对韵歌", characters: ["对","云","雨","风","花","鸟","虫","鱼"], focus: "自然景物配对识字" },
  { id: "tb-1-6", publisher: "部编版", grade: "一年级上", unit: "课文一", lesson: "秋天", characters: ["秋","气","了","树","叶","片","大","飞","会","个"], focus: "描写秋天的常用字" },
  { id: "tb-1-7", publisher: "部编版", grade: "一年级上", unit: "课文一", lesson: "小小的船", characters: ["的","船","两","头","在","里","看","见","闪","星"], focus: "儿歌中的方位和视觉字" },
  { id: "tb-1-8", publisher: "部编版", grade: "一年级上", unit: "课文一", lesson: "江南", characters: ["江","南","可","采","莲","鱼","东","西","北"], focus: "方位和自然识字" },
  { id: "tb-1-9", publisher: "部编版", grade: "一年级上", unit: "课文二", lesson: "四季", characters: ["尖","说","春","青","蛙","夏","弯","地","就","冬"], focus: "四季特征和动作字" },
  { id: "tb-1-10", publisher: "部编版", grade: "一年级上", unit: "课文二", lesson: "影子", characters: ["影","前","后","黑","狗","左","右","它","好","朋","友"], focus: "方位和动物字" },
  { id: "tb-1-11", publisher: "部编版", grade: "一年级上", unit: "课文三", lesson: "比尾巴", characters: ["比","尾","巴","谁","长","短","把","伞","猴","鼠","扁","最"], focus: "动物特征对比字" },
  { id: "tb-1-12", publisher: "部编版", grade: "一年级上", unit: "课文三", lesson: "青蛙写诗", characters: ["蛙","写","诗","点","要","过","给","当","串","们","以","成"], focus: "文学创作相关字" },
  { id: "tb-1-13", publisher: "部编版", grade: "一年级上", unit: "课文四", lesson: "大还是小", characters: ["时","候","觉","得","自","己","很","穿","衣","服","快"], focus: "自我认知相关字" },
  { id: "tb-1-14", publisher: "部编版", grade: "一年级上", unit: "课文四", lesson: "雪地里的小画家", characters: ["雪","画","家","牙","用","几","步","为","参","加","洞","着"], focus: "动物和动作字" },

  // ========== 一年级下册 ==========
  { id: "tb-1-15", publisher: "部编版", grade: "一年级下", unit: "识字一", lesson: "春夏秋冬", characters: ["春","风","冬","雪","花","飞","入","姓","什","么","双","国"], focus: "四季气象与基础字" },
  { id: "tb-1-16", publisher: "部编版", grade: "一年级下", unit: "识字二", lesson: "姓氏歌", characters: ["姓","李","张","古","吴","赵","钱","孙","周","王","官"], focus: "常见姓氏用字" },
  { id: "tb-1-17", publisher: "部编版", grade: "一年级下", unit: "识字三", lesson: "小青蛙", characters: ["清","晴","眼","睛","保","护","害","事","情","请","让","病"], focus: "形声字启蒙" },
  { id: "tb-1-18", publisher: "部编版", grade: "一年级下", unit: "课文一", lesson: "吃水不忘挖井人", characters: ["吃","忘","井","村","叫","毛","主","席","乡","亲","战","士","面"], focus: "革命传统故事用字" },
  { id: "tb-1-19", publisher: "部编版", grade: "一年级下", unit: "课文二", lesson: "我多想去看看", characters: ["想","告","诉","路","京","安","门","广","非","常","壮","观"], focus: "愿望与地点表达" },
  { id: "tb-1-20", publisher: "部编版", grade: "一年级下", unit: "课文三", lesson: "怎么都快乐", characters: ["玩","很","当","音","讲","行","许","连","跳","绳","羽","球"], focus: "游戏活动相关字" },

  // ========== 二年级上册 ==========
  { id: "tb-2-1", publisher: "部编版", grade: "二年级上", unit: "课文一", lesson: "小蝌蚪找妈妈", characters: ["两","哪","宽","顶","眼","睛","肚","皮","孩","跳","变","条"], focus: "动物故事中的形声字和身体部位字" },
  { id: "tb-2-2", publisher: "部编版", grade: "二年级上", unit: "课文一", lesson: "我是什么", characters: ["变","极","傍","海","洋","作","坏","给","带","晒","淹","没"], focus: "自然现象相关动词" },
  { id: "tb-2-3", publisher: "部编版", grade: "二年级上", unit: "课文二", lesson: "场景歌", characters: ["帆","艘","军","舰","稻","园","孔","翠","队","铜","号","领","巾"], focus: "场景归类识字" },
  { id: "tb-2-4", publisher: "部编版", grade: "二年级上", unit: "课文二", lesson: "树之歌", characters: ["杨","壮","桐","枫","松","柏","棉","杉","化","桂","守","疆"], focus: "树木名称与特征字" },
  { id: "tb-2-5", publisher: "部编版", grade: "二年级上", unit: "课文三", lesson: "曹冲称象", characters: ["称","柱","底","杆","秤","做","岁","站","船","然","量"], focus: "历史故事中的量词和动词" },
  { id: "tb-2-6", publisher: "部编版", grade: "二年级上", unit: "课文三", lesson: "玲玲的画", characters: ["玲","详","幅","评","奖","催","叭","脏","报","另","及","懒"], focus: "生活场景常用字" },

  // ========== 二年级下册 ==========
  { id: "tb-2-7", publisher: "部编版", grade: "二年级下", unit: "课文一", lesson: "古诗二首", characters: ["诗","村","童","碧","妆","绿","丝","剪","冲","寻","姑","娘"], focus: "古诗常用字和描写字" },
  { id: "tb-2-8", publisher: "部编版", grade: "二年级下", unit: "课文二", lesson: "雷锋叔叔你在哪里", characters: ["锋","叔","曾","泞","窝","迈","荆","棘","瓣","莹","觅","需"], focus: "品德故事中的形容词" },
  { id: "tb-2-9", publisher: "部编版", grade: "二年级下", unit: "课文三", lesson: "千人糕", characters: ["糕","粉","蔗","糖","劳","确","应","盒","谊","诱","汁","菜"], focus: "食物制作过程相关字" },
  { id: "tb-2-10", publisher: "部编版", grade: "二年级下", unit: "课文四", lesson: "画杨桃", characters: ["图","摆","座","室","交","哈","页","抢","嘻","靠","审","肃"], focus: "校园生活和观察字" },

  // ========== 三年级上册 ==========
  { id: "tb-3-1", publisher: "部编版", grade: "三年级上", unit: "第一单元", lesson: "大青树下的小学", characters: ["晨","绒","球","汉","艳","服","装","扮","读","静","停","粗","影"], focus: "校园生活词和描写词" },
  { id: "tb-3-2", publisher: "部编版", grade: "三年级上", unit: "第二单元", lesson: "铺满金色巴掌的水泥道", characters: ["铺","泥","晶","紧","院","印","排","列","规","则","凌","乱","棕"], focus: "写景观察类用字" },
  { id: "tb-3-3", publisher: "部编版", grade: "三年级上", unit: "第三单元", lesson: "那一定会很好", characters: ["缩","努","茎","推","吱","拆","旧","修","供","舒","锯","斧"], focus: "童话中的动作和状态字" },
  { id: "tb-3-4", publisher: "部编版", grade: "三年级上", unit: "第四单元", lesson: "总也倒不了的老屋", characters: ["洞","准","备","墙","蜘","蛛","漂","母","撞","饱","晒","饿"], focus: "童话故事中的角色字" },

  // ========== 三年级下册 ==========
  { id: "tb-3-5", publisher: "部编版", grade: "三年级下", unit: "第一单元", lesson: "燕子", characters: ["凑","拂","集","聚","形","掠","偶","尔","沾","倦","谱","符"], focus: "动物描写中的精炼动词" },
  { id: "tb-3-6", publisher: "部编版", grade: "三年级下", unit: "第二单元", lesson: "守株待兔", characters: ["守","株","待","触","颈","释","其","骄","傲","谦","虚","懦"], focus: "寓言故事用字和品质字" },
  { id: "tb-3-7", publisher: "部编版", grade: "三年级下", unit: "第三单元", lesson: "赵州桥", characters: ["赵","省","县","匠","设","计","史","创","举","砌","跨","栏"], focus: "建筑说明文用字" },

  // ========== 四年级上册 ==========
  { id: "tb-4-1", publisher: "部编版", grade: "四年级上", unit: "第一单元", lesson: "观潮", characters: ["潮","据","堤","阔","笼","罩","盼","滚","顿","逐","渐","犹","震","霎","余"], focus: "写景文章中的观察和动态描写字" },
  { id: "tb-4-2", publisher: "部编版", grade: "四年级上", unit: "第二单元", lesson: "走月亮", characters: ["鹅","卵","俗","跃","稻","熟","坑","洼","填","庄","稼","葡","萄"], focus: "田园生活场景用字" },
  { id: "tb-4-3", publisher: "部编版", grade: "四年级上", unit: "第三单元", lesson: "爬山虎的脚", characters: ["虎","操","占","嫩","顺","均","叠","隙","茎","柄","萎","瞧"], focus: "植物观察用字" },
  { id: "tb-4-4", publisher: "部编版", grade: "四年级上", unit: "第四单元", lesson: "盘古开天地", characters: ["劈","浊","丈","撑","竭","液","滋","茂","奔","疗","创","宙"], focus: "神话故事用字" },

  // ========== 四年级下册 ==========
  { id: "tb-4-5", publisher: "部编版", grade: "四年级下", unit: "第一单元", lesson: "古诗词三首", characters: ["杂","疏","茅","檐","翁","笼","赖","剥","构","饰","蹲","率"], focus: "古诗词和田园描写" },
  { id: "tb-4-6", publisher: "部编版", grade: "四年级下", unit: "第二单元", lesson: "琥珀", characters: ["琥","珀","脂","渗","俯","澎","湃","黏","稠","推","测"], focus: "自然科学说明文" },
  { id: "tb-4-7", publisher: "部编版", grade: "四年级下", unit: "第三单元", lesson: "短诗三首", characters: ["繁","漫","灭","藤","萝","漆","膝","挥","桦","涂","挤"], focus: "现代诗常用字" },

  // ========== 五年级上册 ==========
  { id: "tb-5-1", publisher: "部编版", grade: "五年级上", unit: "第一单元", lesson: "白鹭", characters: ["嫌","嵌","匣","嗜","榨","矮","榴","亩","播","浇","吩","咐"], focus: "文学描写和审美表达" },
  { id: "tb-5-2", publisher: "部编版", grade: "五年级上", unit: "第二单元", lesson: "将相和", characters: ["召","诺","怯","拒","诸","荆","罪","璧","臣","议","献","协"], focus: "历史故事用字" },
  { id: "tb-5-3", publisher: "部编版", grade: "五年级上", unit: "第三单元", lesson: "猎人海力布", characters: ["酬","誓","谎","嫂","罕","纱","妻","趟","托","泳","婚","辈"], focus: "民间故事中的角色和动作词" },
  { id: "tb-5-4", publisher: "部编版", grade: "五年级上", unit: "第四单元", lesson: "少年中国说", characters: ["泻","潜","渊","胎","履","疆","鳞","惶","懈","纵"], focus: "思辨议论类用字" },

  // ========== 五年级下册 ==========
  { id: "tb-5-5", publisher: "部编版", grade: "五年级下", unit: "第一单元", lesson: "古诗三首", characters: ["昼","耘","桑","晓","漪","稚","陂","寒","供","耕","织"], focus: "田园古诗常用字" },
  { id: "tb-5-6", publisher: "部编版", grade: "五年级下", unit: "第二单元", lesson: "草船借箭", characters: ["瑜","忌","督","寨","擂","呐","弩","丞","幔","翎","粮"], focus: "三国故事用字" },
  { id: "tb-5-7", publisher: "部编版", grade: "五年级下", unit: "第三单元", lesson: "青山处处埋忠骨", characters: ["泽","彭","拟","损","锻","炼","眷","赴","搞","殊","尊"], focus: "革命历史题材用字" },

  // ========== 六年级上册 ==========
  { id: "tb-6-1", publisher: "部编版", grade: "六年级上", unit: "第一单元", lesson: "草原", characters: ["毯","陈","裳","虹","蹄","腐","稍","微","缀","幽","雅","案","拙"], focus: "写景抒情散文用字" },
  { id: "tb-6-2", publisher: "部编版", grade: "六年级上", unit: "第二单元", lesson: "七律·长征", characters: ["逶","迤","磅","礴","丸","岷","崖","渡","索","攀","诞","典"], focus: "革命诗词用字" },
  { id: "tb-6-3", publisher: "部编版", grade: "六年级上", unit: "第三单元", lesson: "竹节人", characters: ["豁","凛","疙","瘩","棍","裁","筹","橡","雕","跺","颓"], focus: "童年生活记叙文用字" },
  { id: "tb-6-4", publisher: "部编版", grade: "六年级上", unit: "第四单元", lesson: "桥", characters: ["咆","哮","嗓","淌","哑","揪","瞪","呻","搀","祭","奠"], focus: "小说场景用字" },

  // ========== 六年级下册 ==========
  { id: "tb-6-5", publisher: "部编版", grade: "六年级下", unit: "第一单元", lesson: "北京的春节", characters: ["旬","熬","蒜","醋","饺","摊","拌","眨","宵","燃","贩","彼"], focus: "民俗文化用字" },
  { id: "tb-6-6", publisher: "部编版", grade: "六年级下", unit: "第二单元", lesson: "匆匆", characters: ["涔","潸","挪","徘","徊","蒸","裸","伶","俐","跨","溜"], focus: "抒情散文精炼用字" },
  { id: "tb-6-7", publisher: "部编版", grade: "六年级下", unit: "第三单元", lesson: "那个星期天", characters: ["媚","蚁","叨","绞","耽","揉","绽","搓","惶","吻","偎"], focus: "心理描写细腻用字" },
  { id: "tb-6-8", publisher: "部编版", grade: "六年级下", unit: "第四单元", lesson: "学弈", characters: ["弈","惟","鸿","鹄","缴","辩","弗","俱","援","射","智"], focus: "文言文启蒙用字" },
]'''

# ===== New comprehensive study plan templates =====
new_plans = '''export const studyPlanTemplates: StudyPlanTemplate[] = [
  // ===== 幼儿园阶段 =====
  { id: "kinder-3", title: "小班启蒙计划（3-4岁）", audience: "幼儿园小班 3-4岁", dailyTarget: "每天 3-5 个生活常用字（人、口、手、大、小）", reviewMode: "每 2 天用看图识字游戏复习一次；每周循环复习本周 15 个字", parentControl: "家长可手动添加本周重点字；不限时长；无计分无惩罚；纯兴趣驱动" },
  { id: "kinder-4", title: "中班进阶计划（4-5岁）", audience: "幼儿园中班 4-5岁", dailyTarget: "每天 5-8 个字（动植物、颜色、方位、简单动词）", reviewMode: "每 3 天用场景找字游戏复习；用象形动画加深字形记忆", parentControl: "家长可设置每日学习上限（建议 15 分钟）；可添加课外字" },
  { id: "kinder-5", title: "大班衔接计划（5-6岁）", audience: "幼儿园大班 5-6岁", dailyTarget: "每天 8-10 个字，为小学一年级做学前铺垫", reviewMode: "每 5 天综合复习一次（听音选字 + 组词闯关）", parentControl: "可开启拼音认读辅助；可提前设置一年级上册生字表" },

  // ===== 小学低年级 =====
  { id: "g1-plan", title: "一年级同步巩固计划", audience: "小学一年级", dailyTarget: "每天 8-12 个课文同步生字", reviewMode: "当天听读音 + 次日描红 + 周末错字复盘", parentControl: "可设置每日学习时长（建议 20 分钟）；可选择部编版/人教版版本" },
  { id: "g2-plan", title: "二年级识写提升计划", audience: "小学二年级", dailyTarget: "每天 10-15 个生字，重点掌握偏旁部首", reviewMode: "部首找朋友游戏 + 组词闯关 + 看句选字", parentControl: "可开启笔顺检测；可设置薄弱单元专项练习" },
  { id: "unit-review", title: "单元专项复习计划", audience: "小学 1-2 年级", dailyTarget: "按单元同步复习课文生字", reviewMode: "形近字辨析 + 多音字初识 + 语段填空混合复习", parentControl: "可选择薄弱单元或本学期全部单元专项复习" },

  // ===== 小学中年级 =====
  { id: "g3-plan", title: "三年级阅读拓展计划", audience: "小学三年级", dailyTarget: "每天 12-15 个字，侧重阅读理解和段落用字", reviewMode: "语段找字 + 近义词配对 + 多音字闯关", parentControl: "可指定课文篇目；可开启成语积累小任务" },
  { id: "g4-plan", title: "四年级表达运用计划", audience: "小学四年级", dailyTarget: "每天 15-18 个字，侧重形近字辨析和成语积累", reviewMode: "形近字找茬 + 成语填字 + 说明文关键词语境辨字", parentControl: "可生成易错字专属练习册；可设置期末冲刺模式" },
  { id: "midterm-review", title: "期中/期末总复习计划", audience: "小学 3-4 年级", dailyTarget: "按单元、按题型分类复习半学期所学字词", reviewMode: "多音字闯关 + 语段辨字 + 成语识字综合复习", parentControl: "可自动生成错题本和薄弱字清单；可设置复习天数" },

  // ===== 小学高年级 =====
  { id: "g5-plan", title: "五年级综合素养计划", audience: "小学五年级", dailyTarget: "每天 15-20 个字，结合长文阅读和古诗文", reviewMode: "词义推断 + 古诗词填字 + 主题词归类 + 说明文专项", parentControl: "可设置阅读篇目同步；可监控易错字变化曲线" },
  { id: "g6-plan", title: "六年级毕业冲刺计划", audience: "小学六年级", dailyTarget: "每天 18-22 个字，覆盖小学全部核心字词", reviewMode: "多音字闯关 + 易错字专项 + 整本书阅读词库 + 毕业模拟", parentControl: "可查看毕业掌握率报告；可自动生成薄弱字周计划" },
  { id: "graduate-review", title: "小升初衔接复习计划", audience: "小学六年级毕业", dailyTarget: "按知识点分类复习小学阶段所有重点汉字", reviewMode: "综合闯关 + 易错字大盘点 + 课外拓展识字", parentControl: "可开启初中预备字库；可生成毕业学情总报告" },

  // ===== 自定义计划 =====
  { id: "custom-kinder", title: "自定义启蒙计划（幼儿园）", audience: "幼儿园（全年龄段）", dailyTarget: "家长可自由设置每日识字量（1-15 字）", reviewMode: "自动按记忆曲线安排复习；支持象形、场景、听音多种模式", parentControl: "可手动添加重点学习汉字；可设置每周学习天数；无强制时长" },
  { id: "custom-primary", title: "自定义同步计划（小学）", audience: "小学 1-6 年级（全年级）", dailyTarget: "可设置每日新学字数和复习字数比例", reviewMode: "支持按课文、单元、薄弱字三种模式自动生成复习题", parentControl: "可绑定教材版本和年级；可设置每日学习提醒时间" },
]'''

# Find and replace textbookUnits
old_textbook_start = 'export const textbookUnits: TextbookUnit[] = ['
old_textbook_end = ']\\n\\nexport const studyPlanTemplates'

new_content = content

# Replace textbook data
idx = new_content.find(old_textbook_start)
if idx >= 0:
    end_match = re.search(r'\]\n\nexport const studyPlanTemplates', new_content)
    if end_match:
        end = end_match.start()
        new_content = new_content[:idx] + new_textbook + new_content[end:]

# Replace study plan data
old_plans_start = 'export const studyPlanTemplates: StudyPlanTemplate[] = ['
# Find closing bracket of old study plans
idx2 = new_content.find(old_plans_start)
if idx2 >= 0:
    # Find the matching closing bracket
    after = new_content[idx2+len(old_plans_start):]
    depth = 0
    bracket_pos = -1
    for i, c in enumerate(after):
        if c == '[': depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                bracket_pos = idx2 + len(old_plans_start) + i + 1
                break
    if bracket_pos > 0:
        new_content = new_content[:idx2] + new_plans + new_content[bracket_pos:]

with open(os.path.join(root, 'src/supportData.ts'), 'w', encoding='utf-8') as f:
    f.write(new_content)
print("supportData.ts updated successfully!")
