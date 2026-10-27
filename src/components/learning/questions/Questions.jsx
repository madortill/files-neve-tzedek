import { useEffect, useState } from "react";
import "./Questions.css";

import note from "../../../assets/images/answerBGNote.svg";
import prisonBG from "../../../assets/images/prisonBG.svg"; // TODO: לעדכן לשם הקובץ של רקע הכלא


/* ---------------- נתונים ---------------- */
const ALL_QUESTIONS = [
  {
    id: "q1",
    title: "מתי נרשום טופס תלונה?",
    rightAns:
      "את טופס התלונה נרשום כאשר אחד הכלואים יעבור על הגדרת הנהלים של הפלוגה",
    wrongAns: ["2", "3", "4"],
  },
  {
    id: "q2",
    title: "מי צריך לחתום על אישור מעבר בכדי שיהיה תקין?",
    rightAns: "מ”פ תורן מהכלא, רמן תורן וקצין ששייך לפלוגה הרלוונטית",
    wrongAns: ["2", "3", "4"],
  },
  { id: "q3", title: "שאלה 3", rightAns: "תשובה נכונה", wrongAns: ["2", "3", "4"] },
  { id: "q4", title: "שאלה 4", rightAns: "תשובה נכונה", wrongAns: ["2", "3", "4"] },
  { id: "q5", title: "שאלה 5", rightAns: "תשובה נכונה", wrongAns: ["2", "3", "4"] },
  { id: "q6", title: "שאלה 6", rightAns: "תשובה נכונה", wrongAns: ["2", "3", "4"] },
];

const FIRST_IDS = ["q1", "q2"]; // מופיעות באמצע הלומדה
const FINAL_IDS = ["q3", "q4", "q5", "q6"]; // מופיעות בסוף הלומדה

/* ---------------- זיכרון בין שתי ההופעות ---------------- */
const STORAGE_KEY = "forms-course:questions";
let memoryFallback = { version: 1 };

function readStore() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (saved && saved.version === 1) return saved;
  } catch {
    /* ממשיכים */
  }
  return memoryFallback;
}

function writeStore(patch) {
  const next = { ...readStore(), ...patch, version: 1 };
  memoryFallback = next;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ממשיכים גם אם האחסון חסום */
  }
}

/* ---------------- עזרים ---------------- */
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuestions(part) {
  let ids;
  if (part === "final") {
    // 4 השאלות האחרונות + השאלות שטעינו בהן בחלק הראשון
    const missed = readStore().firstMissed || [];
    ids = [...FINAL_IDS, ...missed];
  } else {
    ids = FIRST_IDS;
  }
  return ids
    .map((id) => ALL_QUESTIONS.find((q) => q.id === id))
    .filter(Boolean)
    .map((q) => ({ ...q, options: shuffle([q.rightAns, ...q.wrongAns]) }));
}
function getProgressKey(chapterNumber, part) {
  return `forms-course:questions:progress:${chapterNumber}:${part}`;
}

const progressMemory = new Map();

function readQuestionProgress(key) {
  try {
    const raw = sessionStorage.getItem(key);

    if (raw) {
      const saved = JSON.parse(raw);

      if (saved?.version === 1) {
        return saved;
      }
    }
  } catch {
    // גיבוי בזיכרון אם האחסון אינו זמין.
    return progressMemory.get(key) ?? null;
  }

  return null;
}

function saveQuestionProgress(key, progress) {
  const saved = {
    version: 1,
    ...progress,
  };

  progressMemory.set(key, saved);

  try {
    sessionStorage.setItem(key, JSON.stringify(saved));
  } catch {
    // השמירה בזיכרון ממשיכה לעבוד במעבר פנימי בין routes.
  }
}

function createQuestionProgress(part, key) {
  const saved = readQuestionProgress(key);
  const freshQuestions = buildQuestions(part);

  const questions = freshQuestions.map((question) => {
    const previous = saved?.questions?.find(
      (item) => item.id === question.id
    );

    const expectedOptions = [
      question.rightAns,
      ...question.wrongAns,
    ];

    // משחזרים את הסדר רק אם אפשרויות השאלה לא השתנו.
    const remaining = [...expectedOptions];

    const validOrder =
      Array.isArray(previous?.options) &&
      previous.options.length === expectedOptions.length &&
      previous.options.every((option) => {
        const position = remaining.indexOf(option);

        if (position === -1) return false;

        remaining.splice(position, 1);
        return true;
      });

    return {
      ...question,
      options: validOrder ? previous.options : question.options,
    };
  });

  const answers = questions.map((question) => {
    const previousIndex = saved?.questions?.findIndex(
      (item) => item.id === question.id
    );

    const previousAnswer =
      previousIndex >= 0 ? saved?.answers?.[previousIndex] : null;

    return question.options.includes(previousAnswer)
      ? previousAnswer
      : null;
  });

  const previousQuestionId = saved?.questions?.[saved?.index]?.id;

  const restoredIndex = questions.findIndex(
    (question) => question.id === previousQuestionId
  );

  return {
    questions,
    answers,
    index: restoredIndex >= 0 ? restoredIndex : 0,
  };
}
/**
 * props:
 *  part          - "first" (שתי השאלות הראשונות) או "final" (4 האחרונות + מה שטעינו)
 *  chapterNumber - המספר בתגית "שאלות פרק X"
 *  onBack        - נקרא בלחיצה על החץ בשאלה הראשונה
 *  onFinish      - נקרא אחרי שהדלת נפתחת, עם
 *                  { correct, total, missedIds, overallCorrect?, overallTotal? }
 */

export default function Questions({
  part = "first",
  chapterNumber = 1,
  onBack,
  onFinish,
}) {
  return (
    <QuestionsContent
      key={`${chapterNumber}:${part}`}
      part={part}
      chapterNumber={chapterNumber}
      onBack={onBack}
      onFinish={onFinish}
    />
  );
}

function QuestionsContent({
  part,
  chapterNumber,
  onBack,
  onFinish,
}) {
  const progressKey = getProgressKey(chapterNumber, part);

  const [progress, setProgress] = useState(() =>
    createQuestionProgress(part, progressKey)
  );

  const { questions, answers, index } = progress;
  const total = questions.length;

  const [phase, setPhase] = useState("closing");

  const question = questions[index];
  const selected = answers[index];

  // שומר גם את סדר האפשרויות שנוצר בכניסה הראשונה.
  useEffect(() => {
    saveQuestionProgress(progressKey, progress);
  }, [progressKey, progress]);

  function updateProgress(patch) {
    const next = {
      ...progress,
      ...patch,
    };

    // שמירה מיידית, לפני יציאה אפשרית מהקומפוננטה.
    saveQuestionProgress(progressKey, next);
    setProgress(next);
  }

  function handleSelect(option) {
    if (phase !== "ready") return;

    const nextAnswers = [...answers];
    nextAnswers[index] = option;

    updateProgress({ answers: nextAnswers });
  }

  function handleNext() {
    if (phase !== "ready" || selected === null) return;

    saveQuestionProgress(progressKey, progress);

    if (index === total - 1) {
      setPhase("leaving");
      return;
    }

    updateProgress({ index: index + 1 });
  }

  function handleBack() {
    if (phase !== "ready") return;

    saveQuestionProgress(progressKey, progress);

    if (index === 0) {
      onBack?.();
      return;
    }

    updateProgress({ index: index - 1 });
  }

  function finish() {
    const missedIds = questions
      .filter((q, i) => answers[i] !== q.rightAns)
      .map((q) => q.id);
    const correct = total - missedIds.length;
    const result = { correct, total, missedIds };

    if (part === "final") {
      // ציון כולל: ניסיון ראשון בשתי הראשונות + 4 האחרונות (חזרות על טעויות לא נספרות)
      const newOnes = questions.filter((q) => FINAL_IDS.includes(q.id));
      const newCorrect = newOnes.filter((q) => {
        const i = questions.indexOf(q);
        return answers[i] === q.rightAns;
      }).length;
      result.overallCorrect = (readStore().firstCorrect || 0) + newCorrect;
      result.overallTotal = FIRST_IDS.length + FINAL_IDS.length;
      writeStore({ finalMissed: missedIds });
    } else {
      writeStore({ firstMissed: missedIds, firstCorrect: correct });
    }
    onFinish?.(result);
  }

  function handleDoorEnd() {
    if (phase === "closing") setPhase("ready");
    else if (phase === "leaving") finish();
  }

  const showContent = phase !== "closing";
  const backDisabled = index === 0 && typeof onBack !== "function";

  return (
    <div className="q-wrap" dir="rtl">
      <div className="q-stage">
        {/* דלת: נסגרת מימין לשמאל, ובסוף נפתחת משמאל לימין */}
        <div
          className={`q-door ${phase === "leaving" ? "q-door-open" : ""}`}
          style={{ backgroundImage: `url(${prisonBG})` }}
          onAnimationEnd={handleDoorEnd}
        />

        {showContent && (
          <div className={`q-content ${phase === "leaving" ? "leaving" : ""}`}>
    
        {/* <div className="q-chapter-tag">שאלות פרק {chapterNumber}</div> */}

            <div className="q-fit">
              <div className="q-card" key={index}>
                <button
                  type="button"
                  className="q-back"
                  onClick={handleBack}
                  disabled={backDisabled}
                  aria-label="חזור"
                >
                  <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                    <path
                      d="M9 20H31M22 11L31 20L22 29"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <h2 className="q-title">{question.title}</h2>

                <div className="q-notes">
                  {question.options.map((opt, i) => (
                    <button
                        key={i}
                        type="button"
                        className={`q-note ${selected === opt ? "selected" : ""}`}
                        onClick={() => handleSelect(opt)}
                        aria-pressed={selected === opt}
                        disabled={phase !== "ready"}
                        >
                        <img
                            src={note}
                            className="q-note-img"
                            alt=""
                            draggable={false}
                        />
                        <span className="q-note-text">{opt}</span>
                        </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="q-btn"
                  disabled={selected === null}
                  onClick={handleNext}
                >
                  להמשך <span aria-hidden="true">←</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}