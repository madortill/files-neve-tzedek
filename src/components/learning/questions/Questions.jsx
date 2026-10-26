import { useState } from "react";
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
  const [questions] = useState(() => buildQuestions(part));
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("closing"); // closing -> ready -> leaving
  const [answers, setAnswers] = useState(() => Array(total).fill(null));

  const question = questions[index];
  const selected = answers[index];

  function handleSelect(opt) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = opt;
      return next;
    });
  }

  function handleNext() {
    if (selected === null) return;
    if (index === total - 1) {
      setPhase("leaving"); // הדלת נפתחת ואז onFinish
      return;
    }
    setIndex((i) => i + 1);
  }

  function handleBack() {
    if (index === 0) {
      onBack?.();
      return;
    }
    setIndex((i) => i - 1);
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
    
        <div className="q-chapter-tag">שאלות פרק {chapterNumber}</div>

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
                      style={{ backgroundImage: `url(${note})` }}
                      onClick={() => handleSelect(opt)}
                    >
                      {/* משטח לבן שמכסה טקסט שאפוי בתוך ה-SVG (למשל "תשובה 1") */}
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