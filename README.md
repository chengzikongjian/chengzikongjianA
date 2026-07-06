# 星光识字岛

一款面向幼儿园及小学阶段的 PWA/H5 识字系统 MVP。首版以孩子端体验为核心，包含学习地图、字卡学习、闯关练习、故事找字、创意工坊、学情报告、成就系统和本地学习进度。

## 技术栈

- React + TypeScript + Vite
- PWA: vite-plugin-pwa
- 本地持久化: IndexedDB + idb
- 状态管理: Zustand
- 笔顺动画: hanzi-writer
- 图标: lucide-react

## 运行

```bash
npm install
npm run dev
```

## 验证

```bash
npm run lint
npm run build
npm run preview
```

## 当前 MVP 内容

- 52 个样例汉字，覆盖幼儿启蒙到小学五六年级
- 10 个短节奏关卡
- 10 篇分级短故事
- 7 个成就徽章
- 本地学情报告：识字量、星级、分级掌握率、建议复习字
- 模板化拼句创意工坊

## 后续扩展方向

- 将内容扩充到约 200 个精选汉字，并逐步接入 3000+ 课标字库
- 替换为人工审核图片和真人普通话音频
- 增加账号登录、云同步、家长/老师报告和内容后台
- 增加更多游戏类型和复习算法
