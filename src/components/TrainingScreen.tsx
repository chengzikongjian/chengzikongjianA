import { useCallback, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { ChevronLeft, ChevronRight, Mic2, RotateCcw, Sparkles, Star, Volume2, X } from "lucide-react";
import { characters } from "../data";
import { textbookUnits, trainingModes } from "../supportData";
import { studyPlanTemplates } from "../supportData";
import type { CharacterItem } from "../types";
import { speak } from "../utils/speech";

const pictographChars = [{"char": "人", "pinyin": "rén", "emoji": "🧑", "meaning": "我们每一个人。", "words": ["大人", "小人"]}, {"char": "口", "pinyin": "kǒu", "emoji": "👄", "meaning": "嘴巴，也像一个开口。", "words": ["口水", "门口"]}, {"char": "手", "pinyin": "shǒu", "emoji": "✋", "meaning": "用来拿东西、写字。", "words": ["小手", "拍手"]}, {"char": "足", "pinyin": "zú", "emoji": "🦶", "meaning": "脚，也表示足够。", "words": ["足球", "手足"]}, {"char": "目", "pinyin": "mù", "emoji": "👁️", "meaning": "眼睛。", "words": ["目光", "目前"]}, {"char": "耳", "pinyin": "ěr", "emoji": "👂", "meaning": "耳朵。", "words": ["耳朵", "木耳"]}, {"char": "鼻", "pinyin": "bí", "emoji": "👃", "meaning": "鼻子。", "words": ["鼻子", "鼻尖"]}, {"char": "牙", "pinyin": "yá", "emoji": "🦷", "meaning": "牙齿。", "words": ["牙齿", "刷牙"]}, {"char": "头", "pinyin": "tóu", "emoji": "👤", "meaning": "头部，最前面的部分。", "words": ["头发", "头目"]}, {"char": "多", "pinyin": "duō", "emoji": "📦", "meaning": "数量大。", "words": ["多少", "很多"]}, {"char": "少", "pinyin": "shǎo", "emoji": "📭", "meaning": "数量不大。", "words": ["多少", "少年"]}, {"char": "左", "pinyin": "zuǒ", "emoji": "👈", "meaning": "左手方向。", "words": ["左手", "左右"]}, {"char": "右", "pinyin": "yòu", "emoji": "👉", "meaning": "右手方向。", "words": ["右手", "左右"]}, {"char": "男", "pinyin": "nán", "emoji": "👦", "meaning": "男性。", "words": ["男生", "男孩"]}, {"char": "爸", "pinyin": "bà", "emoji": "👨", "meaning": "爸爸，父亲。", "words": ["爸爸", "老爸"]}, {"char": "妈", "pinyin": "mā", "emoji": "👩", "meaning": "妈妈，母亲。", "words": ["妈妈", "老妈"]}, {"char": "爷", "pinyin": "yé", "emoji": "👴", "meaning": "爷爷。", "words": ["爷爷", "大爷"]}, {"char": "奶", "pinyin": "nǎi", "emoji": "👵", "meaning": "奶奶。", "words": ["奶奶", "牛奶"]}, {"char": "哥", "pinyin": "gē", "emoji": "🧑", "meaning": "哥哥。", "words": ["哥哥", "大哥"]}, {"char": "姐", "pinyin": "jiě", "emoji": "👩", "meaning": "姐姐。", "words": ["姐姐", "小姐"]}, {"char": "弟", "pinyin": "dì", "emoji": "🧑", "meaning": "弟弟。", "words": ["弟弟", "兄弟"]}, {"char": "妹", "pinyin": "mèi", "emoji": "👧", "meaning": "妹妹。", "words": ["妹妹", "姐妹"]}, {"char": "你", "pinyin": "nǐ", "emoji": "👉", "meaning": "对方。", "words": ["你们", "你好"]}, {"char": "我", "pinyin": "wǒ", "emoji": "🙋", "meaning": "自己。", "words": ["我们", "自我"]}, {"char": "他", "pinyin": "tā", "emoji": "🧑", "meaning": "另一个男性。", "words": ["他们", "他人"]}, {"char": "她", "pinyin": "tā", "emoji": "👩", "meaning": "另一个女性。", "words": ["她们", "她的"]}, {"char": "吃", "pinyin": "chī", "emoji": "🍽️", "meaning": "吃东西。", "words": ["吃饭", "好吃"]}, {"char": "喝", "pinyin": "hē", "emoji": "🥤", "meaning": "喝水等液体。", "words": ["喝水", "喝茶"]}, {"char": "米", "pinyin": "mǐ", "emoji": "🍚", "meaning": "大米，粮食。", "words": ["大米", "米饭"]}, {"char": "饭", "pinyin": "fàn", "emoji": "🍛", "meaning": "米饭，饭菜。", "words": ["吃饭", "米饭"]}];

const gameScenes = [{"id": "living-room", "name": "客厅", "chars": ["桌", "椅", "灯", "门", "窗", "书", "笔", "纸", "画", "花"], "emoji": "🛋️"}, {"id": "zoo", "name": "动物园", "chars": ["鸟", "鱼", "马", "牛", "羊", "狗", "猫", "鸡", "鸭", "鹅"], "emoji": "🐾"}, {"id": "school", "name": "校园", "chars": ["学", "校", "书", "笔", "纸", "画", "园", "师", "同", "文"], "emoji": "🏫"}, {"id": "park", "name": "公园", "chars": ["花", "草", "树", "木", "山", "水", "石", "田", "竹", "林"], "emoji": "🌳"}, {"id": "kitchen", "name": "厨房", "chars": ["吃", "喝", "米", "饭", "菜", "瓜", "果", "茶", "水", "火"], "emoji": "🍳"}, {"id": "bedroom", "name": "卧室", "chars": ["床", "灯", "衣", "鞋", "帽", "包", "睡", "醒", "玩", "乐"], "emoji": "🛏️"}];

const gameSimilarPairs = [{"a": "人", "b": "入", "hint": "人 vs 入——一个迈开腿，一个合上腿"}, {"a": "大", "b": "太", "hint": "大 vs 太——多一点就是太"}, {"a": "左", "b": "右", "hint": "左 vs 右——工在左，口在右"}, {"a": "上", "b": "下", "hint": "上 vs 下——方向相反"}, {"a": "日", "b": "月", "hint": "日 vs 月——太阳和月亮"}, {"a": "田", "b": "由", "hint": "田 vs 由——出头不出头"}, {"a": "木", "b": "本", "hint": "木 vs 本——加一笔是根本"}, {"a": "鸟", "b": "乌", "hint": "鸟 vs 乌——有眼睛的是鸟"}, {"a": "己", "b": "已", "hint": "己 vs 已——半开口和全开口"}, {"a": "午", "b": "牛", "hint": "午 vs 牛——出头的是牛"}, {"a": "王", "b": "玉", "hint": "王 vs 玉——多一点是玉"}, {"a": "干", "b": "千", "hint": "干 vs 千——一撇是千"}, {"a": "土", "b": "士", "hint": "土 vs 士——下横长是土"}, {"a": "天", "b": "夫", "hint": "天 vs 夫——出头的是夫"}, {"a": "未", "b": "末", "hint": "未 vs 末——上横短是未来"}];

const gameContextQs = [{"passage": "今天天气很____。", "answer": "晴", "options": ["晴", "睛"]}, {"passage": "妈妈给我买了新书____。", "answer": "包", "options": ["包", "句"]}, {"passage": "春天到了，花儿都____了。", "answer": "开", "options": ["开", "关"]}, {"passage": "我们要____教室里上课。", "answer": "在", "options": ["在", "再"]}, {"passage": "老师____我们去参观。", "answer": "带", "options": ["带", "代"]}, {"passage": "他____完了今天的作业。", "answer": "做", "options": ["做", "作"]}, {"passage": "教室的灯光很明____。", "answer": "亮", "options": ["亮", "高"]}, {"passage": "小鱼在水____游来游去。", "answer": "里", "options": ["里", "外"]}, {"passage": "他____在椅子上看书。", "answer": "坐", "options": ["坐", "座"]}, {"passage": "小鸟从树上____走了。", "answer": "飞", "options": ["飞", "走"]}, {"passage": "我们____经学完了。", "answer": "已", "options": ["已", "己"]}, {"passage": "太阳从东方____起。", "answer": "升", "options": ["升", "生"]}, {"passage": "这座山很____。", "answer": "高", "options": ["高", "亮"]}, {"passage": "河上有一座小____。", "answer": "桥", "options": ["桥", "船"]}, {"passage": "树叶____了一地。", "answer": "落", "options": ["飘", "落"]}];

const gameWordPairs = [{"char": "女", "words": ["女孩", "女儿"]}, {"char": "花", "words": ["小花", "花朵"]}, {"char": "草", "words": ["小草", "草地"]}, {"char": "鸟", "words": ["小鸟", "飞鸟"]}, {"char": "鱼", "words": ["小鱼", "鱼儿"]}, {"char": "牛", "words": ["小牛", "黄牛"]}, {"char": "羊", "words": ["小羊", "山羊"]}, {"char": "马", "words": ["小马", "木马"]}, {"char": "书", "words": ["书包", "看书"]}, {"char": "校", "words": ["学校", "校园"]}, {"char": "学", "words": ["学习", "学校"]}, {"char": "朋", "words": ["朋友", "亲朋"]}, {"char": "友", "words": ["朋友", "友好"]}, {"char": "早", "words": ["早上", "早安"]}, {"char": "晚", "words": ["晚上", "晚安"]}, {"char": "星", "words": ["星星", "星光"]}, {"char": "明", "words": ["明天", "明亮"]}, {"char": "地", "words": ["地方", "土地"]}, {"char": "站", "words": ["站立", "车站"]}, {"char": "石", "words": ["石头", "石块"]}, {"char": "虫", "words": ["小虫", "虫子"]}, {"char": "打", "words": ["打开", "打球"]}, {"char": "棋", "words": ["围棋", "象棋"]}, {"char": "鸡", "words": ["小鸡", "公鸡"]}, {"char": "字", "words": ["写字", "汉字"]}, {"char": "词", "words": ["词语", "组词"]}, {"char": "句", "words": ["句子", "句号"]}, {"char": "子", "words": ["孩子", "儿子"]}, {"char": "文", "words": ["文字", "语文"]}, {"char": "数", "words": ["数学", "数字"]}, {"char": "音", "words": ["音乐", "声音"]}, {"char": "体", "words": ["身体", "体育"]}, {"char": "育", "words": ["教育", "体育"]}, {"char": "铅", "words": ["铅笔", "铅球"]}, {"char": "橡", "words": ["橡皮", "橡树"]}, {"char": "皮", "words": ["皮肤", "皮球"]}, {"char": "尺", "words": ["尺子", "直尺"]}, {"char": "晨", "words": ["早晨", "清晨"]}, {"char": "太", "words": ["太阳", "太大"]}, {"char": "亮", "words": ["明亮", "天亮"]}];

type GameMode = "idle" | "pictograph" | "scene-find" | "stroke-puzzle" | "word-rush" | "similar-diff" | "context-fill";

export function TrainingScreen({
  activeCharacter,
  setPracticeCharacterId,
}: {
  activeCharacter: CharacterItem;
  setPracticeCharacterId: (id: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [readScore, setReadScore] = useState<number | null>(null);
  const [strokeScore, setStrokeScore] = useState<number | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("idle");
  const [gameIndex, setGameIndex] = useState(0);
  const [gameFeedback, setGameFeedback] = useState<"correct" | "wrong" | null>(null);
  const [gameDone, setGameDone] = useState(false);
  const [sceneSelected, setSceneSelected] = useState(0);
  const [foundChars, setFoundChars] = useState<string[]>([]);
  const [targetChar, setTargetChar] = useState("");
  const [pictoIndex, setPictoIndex] = useState(0);
  const [pictoPhase, setPictoPhase] = useState<"emoji" | "reveal">("emoji");
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const selectedIndex = characters.findIndex((item) => item.id === activeCharacter.id);
  const nextCharacter = () => setPracticeCharacterId(characters[(selectedIndex + 1) % characters.length].id);

  const shuffle = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);
  const buildPictoOptions = (index: number) => {
    const correct = pictographChars[index];
    if (!correct) return [];
    const others = pictographChars.filter((_, i) => i !== index).map((c) => c.char);
    return shuffle([correct.char, ...others.sort(() => Math.random() - 0.5).slice(0, 3)]);
  };


  const startReadingCheck = () => {
    speak(activeCharacter.char);
    const base = activeCharacter.level === "sprout" || activeCharacter.level === "bridge" ? 88 : 78;
    setReadScore(Math.min(99, base + (activeCharacter.char.codePointAt(0)! % 12)));
  };  // Canvas drawing handlers
  const canvasPoint = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * canvas.width, y: ((event.clientY - rect.top) / rect.height) * canvas.height };
  };
  const drawStart = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawingRef.current = true;
    const p = canvasPoint(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  const drawMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const p = canvasPoint(event);
    ctx.lineTo(p.x, p.y);
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#14342f";
    ctx.stroke();
  };
  const drawEnd = () => {
    if (!drawingRef.current || !canvasRef.current) return;
    drawingRef.current = false;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const pixels = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height).data;
    let ink = 0;
    for (let i = 3; i < pixels.length; i += 4) { if (pixels[i] > 0) ink += 1; }
    setStrokeScore(Math.min(100, Math.round((ink / 8800) * 100)));
  };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeScore(null);
  };

  // Game navigation
  const startGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setGameIndex(0);
    setTotalCorrect(0);
    setTotalAnswered(0);
    setGameFeedback(null);
    setGameDone(false);
    setFoundChars([]);
    setTargetChar("");
    setPictoIndex(0);
    setPictoPhase("emoji");
    if (mode === "pictograph") {
      setPictoIndex(0);
      setPictoPhase("emoji");
      setShuffledOptions(buildPictoOptions(0));
    } else if (mode === "scene-find") {
      setSceneSelected(0);
      setFoundChars([]);
      setTargetChar(gameScenes[0].chars[Math.floor(Math.random() * gameScenes[0].chars.length)]);
    }
  }, []);

  const exitGame = useCallback(() => {
    setGameMode("idle");
    setGameDone(false);
    setGameFeedback(null);
  }, []);

  // Pictograph game
  const pictoAnswer = useCallback(
    (selected: string) => {
      if (gameFeedback) return;
      const current = pictographChars[pictoIndex];
      if (!current) return;
      const correct = selected === current.char;
      setGameFeedback(correct ? "correct" : "wrong");
      if (correct) setTotalCorrect((n) => n + 1);
      setTotalAnswered((n) => n + 1);
      setTimeout(() => {
        setGameFeedback(null);
        const next = pictoIndex + 1;
        if (next >= pictographChars.length) {
          setGameDone(true);
        } else {
          setPictoIndex(next);
          setPictoPhase("emoji");
          setShuffledOptions(buildPictoOptions(next));
        }
      }, 700);
    },
    [pictoIndex, gameFeedback]
  );

  // Scene find game
  const sceneFindAnswer = useCallback(
    (selected: string) => {
      if (gameFeedback || !targetChar) return;
      const correct = selected === targetChar;
      setGameFeedback(correct ? "correct" : "wrong");
      if (correct) {
        setFoundChars((p) => [...p, targetChar]);
        setTotalCorrect((n) => n + 1);
      }
      setTotalAnswered((n) => n + 1);
      setTimeout(() => {
        setGameFeedback(null);
        const scene = gameScenes[sceneSelected];
        const remaining = scene.chars.filter((c) => !foundChars.includes(c) && c !== targetChar);
        if (remaining.length === 0) {
          if (sceneSelected + 1 < gameScenes.length) {
            const nextScene = sceneSelected + 1;
            setSceneSelected(nextScene);
            setFoundChars([]);
            setTargetChar(gameScenes[nextScene].chars[0]);
          } else {
            setGameDone(true);
          }
        } else {
          setTargetChar(remaining[Math.floor(Math.random() * remaining.length)]);
        }
      }, 700);
    },
    [gameFeedback, targetChar, sceneSelected, foundChars]
  );

  // Word rush game
  const wordRushAnswer = useCallback(
    (selected: string) => {
      if (gameFeedback) return;
      const pair = gameWordPairs[gameIndex];
      if (!pair) return;
      const correct = selected === pair.char;
      setGameFeedback(correct ? "correct" : "wrong");
      if (correct) setTotalCorrect((n) => n + 1);
      setTotalAnswered((n) => n + 1);
      setTimeout(() => {
        setGameFeedback(null);
        const next = gameIndex + 1;
        if (next >= gameWordPairs.length) setGameDone(true);
        else setGameIndex(next);
      }, 700);
    },
    [gameFeedback, gameIndex]
  );

  // Similar diff game
  const similarAnswer = useCallback(
    (selected: string) => {
      if (gameFeedback) return;
      const pair = gameSimilarPairs[gameIndex];
      if (!pair) return;
      const correct = selected === pair.a;
      setGameFeedback(correct ? "correct" : "wrong");
      if (correct) setTotalCorrect((n) => n + 1);
      setTotalAnswered((n) => n + 1);
      setTimeout(() => {
        setGameFeedback(null);
        const next = gameIndex + 1;
        if (next >= gameSimilarPairs.length) setGameDone(true);
        else setGameIndex(next);
      }, 700);
    },
    [gameFeedback, gameIndex]
  );

  // Context fill game
  const contextAnswer = useCallback(
    (selected: string) => {
      if (gameFeedback) return;
      const q = gameContextQs[gameIndex];
      if (!q) return;
      const correct = selected === q.answer;
      setGameFeedback(correct ? "correct" : "wrong");
      if (correct) setTotalCorrect((n) => n + 1);
      setTotalAnswered((n) => n + 1);
      setTimeout(() => {
        setGameFeedback(null);
        const next = gameIndex + 1;
        if (next >= gameContextQs.length) setGameDone(true);
        else setGameIndex(next);
      }, 700);
    },
    [gameFeedback, gameIndex]
  );  // === RENDER FUNCTIONS ===
  const renderPictograph = () => {
    const current = pictographChars[pictoIndex];
    if (!current) return null;
    return (
      <div className="game-active">
        <div className="game-header">
          <button className="game-back" onClick={exitGame}><ChevronLeft size={20} /> 返回</button>
          <span className="game-title">象形动画识字</span>
          <span className="game-progress">{pictoIndex + 1}/{pictographChars.length}</span>
        </div>
        <div className="picto-stage">
          <div className="picto-display">
            <div
              className={"picto-card " + pictoPhase}
              onClick={() => { if (pictoPhase === "emoji") setPictoPhase("reveal"); }}
            >
              {pictoPhase === "emoji" ? (
                <>
                  <span className="picto-emoji">{current.emoji}</span>
                  <p className="picto-hint">👆 点击翻转看汉字</p>
                </>
              ) : (
                <>
                  <span className="picto-char">{current.char}</span>
                  <p className="picto-pinyin">{current.pinyin}</p>
                  <p className="picto-meaning">{current.meaning}</p>
                </>
              )}
            </div>
          </div>
          {pictoPhase === "reveal" && (
            <>
              <p className="picto-question">选出对应的汉字：</p>
              <div className="picto-options">
                {shuffledOptions.slice(0, 4).map((ch) => (
                  <button
                    key={ch}
                    className={"picto-btn" + (gameFeedback ? (ch === current.char ? " correct" : gameFeedback === "wrong" ? " wrong" : "") : "")}
                    onClick={() => pictoAnswer(ch)}
                    disabled={!!gameFeedback}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {gameFeedback && <div className={"game-feedback " + gameFeedback}>{gameFeedback === "correct" ? "🎉 答对了！" : "😅 再想想~"}</div>}
      </div>
    );
  };

  const renderSceneFind = () => {
    const scene = gameScenes[sceneSelected];
    if (!scene) return null;
    return (
      <div className="game-active">
        <div className="game-header">
          <button className="game-back" onClick={exitGame}><ChevronLeft size={20} /> 返回</button>
          <span className="game-title">场景找字</span>
          <span className="game-progress">{foundChars.length}/{scene.chars.length}</span>
        </div>
        <div className="scene-card">
          <span className="scene-emoji">{scene.emoji}</span>
          <h3>{scene.name}</h3>
          <p className="scene-desc">在场景中找到这个字：</p>
          <div className="target-big-char">{targetChar}</div>
          <button className="scene-hint-btn" onClick={() => speak(targetChar)}><Volume2 size={16} /> 听读音提示</button>
        </div>
        <div className="scene-char-grid">
          {scene.chars.map((ch) => (
            <button
              key={ch}
              className={"scene-char-btn" + (foundChars.includes(ch) ? " found" : "")}
              onClick={() => sceneFindAnswer(ch)}
              disabled={foundChars.includes(ch)}
            >
              {ch}
            </button>
          ))}
        </div>
        {gameFeedback && <div className={"game-feedback " + gameFeedback}>{gameFeedback === "correct" ? "✅ 找到了！" : "❌ 继续找找看~"}</div>}
      </div>
    );
  };

  const renderWordRush = () => {
    const pair = gameWordPairs[gameIndex];
    if (!pair) return null;
    const distractorPool = gameWordPairs.filter((_, i) => i !== gameIndex);
    const distractors = distractorPool.sort(() => Math.random() - 0.5).slice(0, 3).map((p) => p.char);
    const options = [pair.char, ...distractors].sort(() => Math.random() - 0.5);
    return (
      <div className="game-active">
        <div className="game-header">
          <button className="game-back" onClick={exitGame}><ChevronLeft size={20} /> 返回</button>
          <span className="game-title">组词闯关</span>
          <span className="game-progress">{gameIndex + 1}/{gameWordPairs.length}</span>
        </div>
        <div className="word-rush-panel">
          <p className="word-prompt">下面词语中都有同一个字：</p>
          <div className="word-display">
            <span className="word-example">{pair.words[0]}</span>
            <span className="word-example">{pair.words[1]}</span>
          </div>
          <p className="word-question">选出能组成这些词语的汉字：</p>
          <div className="picto-options">
            {options.map((ch) => (
              <button
                key={ch}
                className={"picto-btn" + (gameFeedback ? (ch === pair.char ? " correct" : gameFeedback === "wrong" ? " wrong" : "") : "")}
                onClick={() => wordRushAnswer(ch)}
                disabled={!!gameFeedback}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
        {gameFeedback && <div className={"game-feedback " + gameFeedback}>{gameFeedback === "correct" ? "✅ 正确！" : "❌ 正确答案是 " + pair.char}</div>}
      </div>
    );
  };

  const renderSimilarDiff = () => {
    const pair = gameSimilarPairs[gameIndex];
    if (!pair) return null;
    const options = [pair.a, pair.b].sort(() => Math.random() - 0.5);
    return (
      <div className="game-active">
        <div className="game-header">
          <button className="game-back" onClick={exitGame}><ChevronLeft size={20} /> 返回</button>
          <span className="game-title">形近字找茬</span>
          <span className="game-progress">{gameIndex + 1}/{gameSimilarPairs.length}</span>
        </div>
        <div className="similar-panel">
          <p className="similar-prompt">仔细看这两个字：</p>
          <div className="similar-display">
            <span className="similar-char">{pair.a}</span>
            <span className="similar-vs">vs</span>
            <span className="similar-char">{pair.b}</span>
          </div>
          <p className="similar-hint">💡 {pair.hint}</p>
          <p className="word-question">请选出上面第一行的字：</p>
          <div className="picto-options">
            {options.map((ch) => (
              <button
                key={ch}
                className={"picto-btn" + (gameFeedback ? (ch === pair.a ? " correct" : gameFeedback === "wrong" ? " wrong" : "") : "")}
                onClick={() => similarAnswer(ch)}
                disabled={!!gameFeedback}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
        {gameFeedback && <div className={"game-feedback " + gameFeedback}>{gameFeedback === "correct" ? "✅ 分辨得很好！" : "❌ 注意区分哦~"}</div>}
      </div>
    );
  };

  const renderContextFill = () => {
    const q = gameContextQs[gameIndex];
    if (!q) return null;
    return (
      <div className="game-active">
        <div className="game-header">
          <button className="game-back" onClick={exitGame}><ChevronLeft size={20} /> 返回</button>
          <span className="game-title">语段辨字</span>
          <span className="game-progress">{gameIndex + 1}/{gameContextQs.length}</span>
        </div>
        <div className="context-panel">
          <p className="context-prompt">阅读句子，选择正确的汉字：</p>
          <div className="context-passage">{q.passage}</div>
          <div className="picto-options">
            {q.options.map((opt) => (
              <button
                key={opt}
                className={"picto-btn" + (gameFeedback ? (opt === q.answer ? " correct" : gameFeedback === "wrong" ? " wrong" : "") : "")}
                onClick={() => contextAnswer(opt)}
                disabled={!!gameFeedback}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        {gameFeedback && <div className={"game-feedback " + gameFeedback}>{gameFeedback === "correct" ? "✅ 填对了！" : "❌ 正确答案是 " + q.answer}</div>}
      </div>
    );
  };

  const renderGameResult = () => {
    const pct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : 1;
    return (
      <div className="game-result-overlay">
        <div className="game-result-card">
          <h2>🎉 闯关完成！</h2>
          <div className="result-stars">
            {[1, 2, 3].map((i) => (
              <Star key={i} size={36} fill={i <= stars ? "#f59e0b" : "#d1d5db"} color={i <= stars ? "#f59e0b" : "#d1d5db"} />
            ))}
          </div>
          <p className="result-score">正确 {totalCorrect}/{totalAnswered} · {pct}%</p>
          <p className="result-msg">
            {pct >= 90 ? "🌟 太棒了！你是识字小达人！" : pct >= 70 ? "💪 很不错！继续加油！" : "📚 再练习一次会更好！"}
          </p>
          <div className="result-actions">
            <button className="primary-action" onClick={() => startGame(gameMode)}>再闯一次</button>
            <button className="secondary-action" onClick={exitGame}>返回训练中心</button>
          </div>
        </div>
      </div>
    );
  };  // === AI Panel (preserved from original) ===
  const renderAIPanel = () => (
    <>
      <div className="section-title">
        <p className="eyebrow">专项训练</p>
        <h2>AI 跟读、书写轨迹、教材同步和分龄游戏</h2>
        <p>当前为轻量本地演示版，后续可接入商用语音测评和书写识别接口。</p>
      </div>
      <div className="assist-grid">
        <article className="assist-card read-card">
          <p className="eyebrow">轻量 AI 跟读测评</p>
          <div className="practice-hanzi">{activeCharacter.char}</div>
          <p className="practice-info">{activeCharacter.pinyin} · {activeCharacter.words[0]}</p>
          <button className="primary-action action-btn" onClick={startReadingCheck}>
            <Mic2 size={18} /> 跟读测评
          </button>
          <div className="score-meter"><span style={{ width: (readScore ?? 0) + "%" }} /></div>
          <strong className="score-label">{readScore === null ? "等待跟读" : readScore + " 分 · 发音清晰"}</strong>
        </article>
        <article className="assist-card writing-card">
          <p className="eyebrow">汉字书写轨迹识别</p>
          <canvas aria-label="书写练习画布" height={260} onPointerDown={drawStart} onPointerLeave={drawEnd} onPointerMove={drawMove} onPointerUp={drawEnd} ref={canvasRef} width={260} />
          <div className="writing-actions">
            <button onClick={clearCanvas}><RotateCcw size={16} /> 清空</button>
            <button onClick={nextCharacter}>换一个字</button>
          </div>
          <p className="stroke-hint">{strokeScore === null ? "在格子里描摹，系统会估算轨迹覆盖度。" : "轨迹覆盖 " + strokeScore + "% · 注意笔顺和结构。"}</p>
        </article>
        <article className="assist-card standard-card">
          <p className="eyebrow">标准化汉字档案</p>
          <div className="standard-fields">
            {[["字形", activeCharacter.char], ["读音", activeCharacter.pinyin], ["部首", activeCharacter.radical ?? "-"], ["笔画", String(activeCharacter.strokeCount ?? "-")], ["结构", activeCharacter.structure ?? "-"], ["易错点", activeCharacter.mistakeNote ?? "-"]].map(([label, value]) => (
              <div className="field-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </div>
        </article>
      </div>
    </>
  );

  // === Games section ===
  const renderGamesSection = () => (
    <>
      <div className="section-subtitle"><h3>分龄游戏闯关模式</h3></div>
      <div className="training-mode-grid">
        {trainingModes.map((mode) => {
          const gameId = mode.id as GameMode;
          return (
            <article className="training-mode-card" key={mode.id}>
              <p className="mode-stage-tag">
                {mode.stage === "kindergarten" ? "🧒 幼儿园玩法"
                  : mode.stage === "lower-primary" ? "📚 低年级玩法"
                  : "🎓 高年级玩法"}
              </p>
              <h3>{mode.title}</h3>
              <p className="mode-purpose">{mode.purpose}</p>
              <span className="mode-play">{mode.play}</span>
              <strong className="mode-reward">{mode.reward}</strong>
              <button className="primary-action start-game-btn" onClick={() => startGame(gameId)}>
                <Sparkles size={16} /> 开始闯关
              </button>
            </article>
          );
        })}
      </div>
      <div className="section-subtitle"><h3>教材同步与学习计划</h3></div>
      <div className="sync-plan-grid">
        <article className="textbook-sync-panel">
          <p className="eyebrow">教材同步</p>
          <h3>部编版/人教版课文生字样例</h3>
          {textbookUnits.map((unit) => (
            <div className="textbook-row" key={unit.id}>
              <strong>{unit.publisher} · {unit.grade} · {unit.lesson}</strong>
              <span>{unit.characters.join(" ")}</span>
              <small>{unit.focus}</small>
            </div>
          ))}
        </article>
        <article className="plan-panel">
          <p className="eyebrow">学习计划</p>
          <h3>每日、单元、期末复习模板</h3>
          {studyPlanTemplates.map((plan) => (
            <div className="plan-row" key={plan.id}>
              <strong>{plan.title}</strong>
              <span>{plan.audience} · {plan.dailyTarget}</span>
              <small>{plan.reviewMode}；{plan.parentControl}</small>
            </div>
          ))}
        </article>
      </div>
    </>
  );

  // === MAIN RENDER ===
  if (gameMode !== "idle" && gameDone) {
    return (
      <section className="training-layout">
        {renderGameResult()}
      </section>
    );
  }

  if (gameMode !== "idle") {
    return (
      <section className="training-layout">
        {gameMode === "pictograph" && renderPictograph()}
        {gameMode === "scene-find" && renderSceneFind()}
        {gameMode === "word-rush" && renderWordRush()}
        {gameMode === "similar-diff" && renderSimilarDiff()}
        {gameMode === "context-fill" && renderContextFill()}
        {gameMode === "stroke-puzzle" && (
          <div className="game-active">
            <div className="game-header">
              <button className="game-back" onClick={exitGame}><ChevronLeft size={20} /> 返回</button>
              <span className="game-title">笔画拼图</span>
              <span className="game-progress">开发中</span>
            </div>
            <div className="game-placeholder">
              <p>笔画拼图正在开发中，敬请期待！</p>
              <p>当前可玩：象形动画识字、场景找字、组词闯关、形近字找茬、语段辨字。</p>
              <button className="primary-action" onClick={exitGame}>返回训练中心</button>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="training-layout">
      {renderAIPanel()}
      {renderGamesSection()}
    </section>
  );
}