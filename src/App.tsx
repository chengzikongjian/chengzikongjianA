import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  BookOpen,
  Home,
  LibraryBig,
  PencilLine,
  ScanLine,
} from "lucide-react";
import "./App.css";
import { characters, lessons, stories } from "./data";
import { sentenceTemplates } from "./data";
import type { CharacterItem, GameResult, Lesson } from "./types";
import { useProgressStore } from "./useProgressStore";
import { getCharactersByLesson, makeQuestions, type QuizQuestion } from "./utils/quiz";
import { speak, speakQuiz, warmupVoice } from "./utils/speech";

import { BadgeScreen } from "./components/BadgeScreen";
import { Header } from "./components/Header";
import { LessonScreen } from "./components/LessonScreen";
import { LibraryScreen } from "./components/LibraryScreen";
import { MapScreen } from "./components/MapScreen";
import { ReportScreen } from "./components/ReportScreen";
import { StoryScreen } from "./components/StoryScreen";
import { StudioScreen } from "./components/StudioScreen";
import { TrainingScreen } from "./components/TrainingScreen";

type Screen = "map" | "lesson" | "story" | "studio" | "library" | "training" | "report" | "badges";

const navItems: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: "map", label: "学习地图", icon: Home },
  { id: "story", label: "故事", icon: BookOpen },
  { id: "studio", label: "创意工坊", icon: PencilLine },
  { id: "library", label: "分级字库", icon: LibraryBig },
  { id: "training", label: "专项训练", icon: ScanLine },
  { id: "report", label: "学情报告", icon: BarChart3 },
  { id: "badges", label: "成就", icon: Award },
];

function App() {
  const { progress, hydrated, hydrate, completeLesson, addSentence, resetProgress } = useProgressStore();

  const [screen, setScreen] = useState<Screen>("map");
  const [activeLessonId, setActiveLessonId] = useState(lessons[0].id);
  const [activeCharacterId, setActiveCharacterId] = useState(lessons[0].characterIds[0]);
  const [practiceCharacterId, setPracticeCharacterId] = useState(lessons[0].characterIds[0]);

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "done" | null>(null);

  const [storyFound, setStoryFound] = useState<string[]>([]);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [chosenWord, setChosenWord] = useState("");

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const activeLesson = useMemo(() => lessons.find((l) => l.id === activeLessonId) ?? lessons[0], [activeLessonId]);
  const activeCharacters = useMemo(() => getCharactersByLesson(activeLesson), [activeLesson]);
  const activeCharacter = useMemo(
    () => characters.find((item) => item.id === activeCharacterId) ?? activeCharacters[0],
    [activeCharacterId, activeCharacters]
  );
  const totalStars = useMemo(
    () => Object.values(progress.lessonStars).reduce((sum, s) => sum + s, 0),
    [progress.lessonStars]
  );
  const unlockedStories = useMemo(() => new Set(progress.storyUnlocks), [progress.storyUnlocks]);
  const learnedWords = useMemo(
    () =>
      characters
        .filter((item) => progress.learnedCharacterIds.includes(item.id))
        .flatMap((item) => item.words),
    [progress.learnedCharacterIds]
  );

  const isLessonUnlocked = useCallback(
    (lesson: Lesson) => {
      const required = lesson.unlockRules.requiredLessonId;
      if (!required) return true;
      return (progress.lessonStars[required] ?? 0) >= (lesson.unlockRules.minStars ?? 1);
    },
    [progress.lessonStars]
  );

  const openLesson = useCallback(
    (lesson: Lesson) => {
      if (!isLessonUnlocked(lesson)) return;
      setActiveLessonId(lesson.id);
      setActiveCharacterId(lesson.characterIds[0]);
      setScreen("lesson");
      setFeedback(null);
      setQuiz([]);
    },
    [isLessonUnlocked]
  );

  const startQuiz = useCallback(() => {
    const nextQuiz = makeQuestions(activeLesson);
    setQuiz(nextQuiz);
    setQuizIndex(0);
    setCorrectCount(0);
    setFeedback(null);
    if (nextQuiz[0]?.type === "audio-choice") speakQuiz(nextQuiz[0].character);
  }, [activeLesson]);

  const answerQuestion = useCallback(
    (choice: CharacterItem) => {
      if (!quiz[quizIndex] || feedback) return;
      const isCorrect = choice.id === quiz[quizIndex].character.id;
      const nextCorrect = correctCount + (isCorrect ? 1 : 0);
      setCorrectCount(nextCorrect);
      setFeedback(isCorrect ? "correct" : "wrong");

      window.setTimeout(() => {
        const nextIndex = quizIndex + 1;
        if (nextIndex >= quiz.length) {
          const accuracy = nextCorrect / quiz.length;
          const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.65 ? 2 : 1;
          const result: GameResult = {
            lessonId: activeLesson.id,
            gameType: quiz[quizIndex].type,
            score: nextCorrect,
            accuracy,
            stars,
            completedAt: new Date().toISOString(),
          };
          completeLesson(result, activeLesson.characterIds);
          setFeedback("done");
        } else {
          setQuizIndex(nextIndex);
          setFeedback(null);
          if (quiz[nextIndex].type === "audio-choice") speakQuiz(quiz[nextIndex].character);
        }
      }, 800);
    },
    [quiz, quizIndex, feedback, correctCount, activeLesson, completeLesson]
  );

  const saveCreation = useCallback(() => {
    const word = chosenWord || learnedWords[0] || activeCharacters[0]?.words[0] || "汉字";
    addSentence(sentenceTemplates[templateIndex].replace("{word}", word).replace("{place}", "故事森林"));
    setChosenWord("");
    setScreen("badges");
  }, [chosenWord, learnedWords, activeCharacters, templateIndex, addSentence]);

  if (!hydrated) {
    return <main className="loading">正在打开星光识字岛...</main>;
  }

  return (
    <main className="app-shell">
      <Header totalStars={totalStars} learnedCount={progress.learnedCharacterIds.length} streakDays={progress.streakDays} />

      <nav className="top-nav" aria-label="主导航">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button className={screen === item.id ? "active" : ""} key={item.id} onClick={() => setScreen(item.id)}>
              <Icon size={18} /> {item.label}
            </button>
          );
        })}
      </nav>

      {screen === "map" && (
        <MapScreen progressStars={progress.lessonStars} isLessonUnlocked={isLessonUnlocked} openLesson={openLesson} />
      )}

      {screen === "lesson" && (
        <LessonScreen
          lesson={activeLesson}
          lessonCharacters={activeCharacters}
          activeCharacter={activeCharacter}
          quiz={quiz}
          quizIndex={quizIndex}
          feedback={feedback}
          storyUnlocked={stories.some((s) => s.id === activeLesson.storyId && unlockedStories.has(s.id))}
          setActiveCharacterId={setActiveCharacterId}
          startQuiz={startQuiz}
          answerQuestion={answerQuestion}
          openStory={() => setScreen("story")}
        />
      )}

      {screen === "story" && (
        <StoryScreen
          activeLesson={activeLesson}
          storyFound={storyFound}
          setStoryFound={setStoryFound}
          setActiveCharacterId={setActiveCharacterId}
          openLesson={() => setScreen("lesson")}
          unlockedStories={unlockedStories}
        />
      )}

      {screen === "studio" && (
        <StudioScreen
          learnedWords={learnedWords}
          templateIndex={templateIndex}
          chosenWord={chosenWord}
          setTemplateIndex={setTemplateIndex}
          setChosenWord={setChosenWord}
          saveCreation={saveCreation}
        />
      )}

      {screen === "library" && <LibraryScreen />}

      {screen === "training" && (
        <TrainingScreen
          activeCharacter={characters.find((item) => item.id === practiceCharacterId) ?? characters[0]}
          setPracticeCharacterId={setPracticeCharacterId}
        />
      )}

      {screen === "report" && <ReportScreen />}

      {screen === "badges" && <BadgeScreen resetProgress={resetProgress} />}
    </main>
  );
}

export default App;
