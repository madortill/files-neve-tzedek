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
    wrongAns: ["כאשר אחד הכלואים רוצה להתלונן על חברו", "לא נרשום טופס תלונה כי זה לא בסמכותינו", "כאשר אחד הכלואים מעצבן אותנו ונרצה להתלונן עליו למפקד"],
  },
  {
    id: "q2",
    title: "מי צריך לחתום על אישור מעבר בכדי שיהיה תקין?",
    rightAns: "מ”פ תורן מהכלא, רמן תורן וקצין ששייך לפלוגה הרלוונטית",
    wrongAns: ["מ”פ תורן מהכלא, וקצין ששייך לפלוגה הרלוונטית", "מפקד הבסיס, רמן תורן, והמפקד הישיר שלנו", "קצין ששיך לפלוגה הרלוונטית, אנחנו הכותבים, והכלוא המועבר"],
  },
  { id: "q3", title: "מה כותבים בסוף כל טופס תלונה", rightAns: "!ובכך פגע חמורות במשמעת הפלוגה", wrongAns: ["ובכך פגע קלות במשמעת הגדודית", "ובכך הפר קלות את משמעת הפלוגתית ", "מקווה לטיפול מהיר ומסור!"] },
  { id: "q4", title: "מה כותבים בכל טופס בקשה? ", rightAns: "בהצדעה ובדום מתוח!", wrongAns: [" בתודה ,(החמ) ובדום מתוח", "בהצדעה ובנוח מתוח", "אשמח לטיפול מהיר ויעיל בבקשתי"] },
  { id: "q5", title: "מהו טופס 385", rightAns: "טופס תלונה", wrongAns: ["טופס העברה", "טופס השמדה/החרמה", "טופס בקשה"] },
  { id: "q6", title: "מהו השימוש של גזירת טופס ההפקדה?", rightAns: " החייל יצרף כנספח לטופס הפיקדון שלו ואת השאר מביאים למ”פ שיתייק", wrongAns: ["החייל יצרף כנספח לטופס הפיקדון שלו ואת השאר נביא למבס שיתייק", "החייל יצרף כנספח לטופס השחרור שלו ונביא את ונשיר גם את שאר הטופס אצל החייל", "לא נגזור את טופס ההפקדה, רק במקרים חריגים של חפצים חריגים"] },
];
// //למלעה יש את הטקסט של השאלות תת
// const FIRST_IDS = ["q1", "q2"]; // מופיעות באמצע הלומדה
// const FINAL_IDS = ["q3", "q4", "q5", "q6"]; // מופיעות בסוף הלומדה

// /* ---------------- זיכרון בין שתי ההופעות ---------------- */
// const STORAGE_KEY = "forms-course:questions";
// let memoryFallback = { version: 1 };

// function readStore() {
//   try {
//     const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
//     if (saved && saved.version === 1) return saved;
//   } catch {
//     /* ממשיכים */
//   }
//   return memoryFallback;
// }

// function writeStore(patch) {
//   const next = { ...readStore(), ...patch, version: 1 };
//   memoryFallback = next;
//   try {
//     sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
//   } catch {
//     /* ממשיכים גם אם האחסון חסום */
//   }
// }

// /* ---------------- עזרים ---------------- */
// function shuffle(arr) {
//   const copy = [...arr];
//   for (let i = copy.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [copy[i], copy[j]] = [copy[j], copy[i]];
//   }
//   return copy;
// }

// function buildQuestions(part) {
//   let ids;
//   if (part === "final") {
//     // 4 השאלות האחרונות + השאלות שטעינו בהן בחלק הראשון
//     const missed = readStore().firstMissed || [];
//     ids = [...FINAL_IDS, ...missed];
//   } else {
//     ids = FIRST_IDS;
//   }
//   return ids
//     .map((id) => ALL_QUESTIONS.find((q) => q.id === id))
//     .filter(Boolean)
//     .map((q) => ({ ...q, options: shuffle([q.rightAns, ...q.wrongAns]) }));
// }
// function getProgressKey(chapterNumber, part) {
//   return `forms-course:questions:progress:${chapterNumber}:${part}`;
// }

// const progressMemory = new Map();

// function readQuestionProgress(key) {
//   try {
//     const raw = sessionStorage.getItem(key);

//     if (raw) {
//       const saved = JSON.parse(raw);

//       if (saved?.version === 1) {
//         return saved;
//       }
//     }
//   } catch {
//     // גיבוי בזיכרון אם האחסון אינו זמין.
//     return progressMemory.get(key) ?? null;
//   }

//   return null;
// }

// function saveQuestionProgress(key, progress) {
//   const saved = {
//     version: 1,
//     ...progress,
//   };

//   progressMemory.set(key, saved);

//   try {
//     sessionStorage.setItem(key, JSON.stringify(saved));
//   } catch {
//     // השמירה בזיכרון ממשיכה לעבוד במעבר פנימי בין routes.
//   }
// }

// function createQuestionProgress(part, key) {
//   const saved = readQuestionProgress(key);
//   const freshQuestions = buildQuestions(part);

//   const questions = freshQuestions.map((question) => {
//     const previous = saved?.questions?.find(
//       (item) => item.id === question.id
//     );

//     const expectedOptions = [
//       question.rightAns,
//       ...question.wrongAns,
//     ];

//     // משחזרים את הסדר רק אם אפשרויות השאלה לא השתנו.
//     const remaining = [...expectedOptions];

//     const validOrder =
//       Array.isArray(previous?.options) &&
//       previous.options.length === expectedOptions.length &&
//       previous.options.every((option) => {
//         const position = remaining.indexOf(option);

//         if (position === -1) return false;

//         remaining.splice(position, 1);
//         return true;
//       });

//     return {
//       ...question,
//       options: validOrder ? previous.options : question.options,
//     };
//   });

//   const answers = questions.map((question) => {
//     const previousIndex = saved?.questions?.findIndex(
//       (item) => item.id === question.id
//     );

//     const previousAnswer =
//       previousIndex >= 0 ? saved?.answers?.[previousIndex] : null;

//     return question.options.includes(previousAnswer)
//       ? previousAnswer
//       : null;
//   });

//   const previousQuestionId = saved?.questions?.[saved?.index]?.id;

//   const restoredIndex = questions.findIndex(
//     (question) => question.id === previousQuestionId
//   );

//   return {
//     questions,
//     answers,
//     index: restoredIndex >= 0 ? restoredIndex : 0,
//   };
// }
// /**
//  * props:
//  *  part          - "first" (שתי השאלות הראשונות) או "final" (4 האחרונות + מה שטעינו)
//  *  chapterNumber - המספר בתגית "שאלות פרק X"
//  *  onBack        - נקרא בלחיצה על החץ בשאלה הראשונה
//  *  onFinish      - נקרא אחרי שהדלת נפתחת, עם
//  *                  { correct, total, missedIds, overallCorrect?, overallTotal? }
//  */

// export default function Questions({
//   part = "first",
//   chapterNumber = 1,
//   onBack,
//   onFinish,
// }) {
//   return (
//     <QuestionsContent
//       key={`${chapterNumber}:${part}`}
//       part={part}
//       chapterNumber={chapterNumber}
//       onBack={onBack}
//       onFinish={onFinish}
//     />
//   );
// }

// function QuestionsContent({
//   part,
//   chapterNumber,
//   onBack,
//   onFinish,
// }) {
//   const progressKey = getProgressKey(chapterNumber, part);

//   const [progress, setProgress] = useState(() =>
//     createQuestionProgress(part, progressKey)
//   );

//   const { questions, answers, index } = progress;
//   const total = questions.length;

//   const [phase, setPhase] = useState("closing");

//   const question = questions[index];
//   const selected = answers[index];

//   // שומר גם את סדר האפשרויות שנוצר בכניסה הראשונה.
//   useEffect(() => {
//     saveQuestionProgress(progressKey, progress);
//   }, [progressKey, progress]);

//   function updateProgress(patch) {
//     const next = {
//       ...progress,
//       ...patch,
//     };

//     // שמירה מיידית, לפני יציאה אפשרית מהקומפוננטה.
//     saveQuestionProgress(progressKey, next);
//     setProgress(next);
//   }

//   function handleSelect(option) {
//     if (phase !== "ready") return;

//     const nextAnswers = [...answers];
//     nextAnswers[index] = option;

//     updateProgress({ answers: nextAnswers });
//   }

//   function handleNext() {
//     if (phase !== "ready" || selected === null) return;

//     saveQuestionProgress(progressKey, progress);

//     if (index === total - 1) {
//       setPhase("leaving");
//       return;
//     }

//     updateProgress({ index: index + 1 });
//   }

//   function handleBack() {
//     if (phase !== "ready") return;

//     saveQuestionProgress(progressKey, progress);

//     if (index === 0) {
//       onBack?.();
//       return;
//     }

//     updateProgress({ index: index - 1 });
//   }

//   function finish() {
//     const missedIds = questions
//       .filter((q, i) => answers[i] !== q.rightAns)
//       .map((q) => q.id);
//     const correct = total - missedIds.length;
//     const result = { correct, total, missedIds };

//     if (part === "final") {
//       // ציון כולל: ניסיון ראשון בשתי הראשונות + 4 האחרונות (חזרות על טעויות לא נספרות)
//       const newOnes = questions.filter((q) => FINAL_IDS.includes(q.id));
//       const newCorrect = newOnes.filter((q) => {
//         const i = questions.indexOf(q);
//         return answers[i] === q.rightAns;
//       }).length;
//       result.overallCorrect = (readStore().firstCorrect || 0) + newCorrect;
//       result.overallTotal = FIRST_IDS.length + FINAL_IDS.length;
//       writeStore({ finalMissed: missedIds });
//     } else {
//       writeStore({ firstMissed: missedIds, firstCorrect: correct });
//     }
//     onFinish?.(result);
//   }

//   function handleDoorEnd() {
//     if (phase === "closing") setPhase("ready");
//     else if (phase === "leaving") finish();
//   }

//   const showContent = phase !== "closing";
//   const backDisabled = index === 0 && typeof onBack !== "function";

//   return (
//     <div className="q-wrap" dir="rtl">
//       <div className="q-stage">
//         {/* דלת: נסגרת מימין לשמאל, ובסוף נפתחת משמאל לימין */}
//         <div
//           className={`q-door ${phase === "leaving" ? "q-door-open" : ""}`}
//           style={{ backgroundImage: `url(${prisonBG})` }}
//           onAnimationEnd={handleDoorEnd}
//         />

//         {showContent && (
//           <div className={`q-content ${phase === "leaving" ? "leaving" : ""}`}>
    
//         {/* <div className="q-chapter-tag">שאלות פרק {chapterNumber}</div> */}

//             <div className="q-fit">
//               <div className="q-card" key={index}>
//                 <button
//                   type="button"
//                   className="q-back"
//                   onClick={handleBack}
//                   disabled={backDisabled}
//                   aria-label="חזור"
//                 >
//                   <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
//                     <path
//                       d="M9 20H31M22 11L31 20L22 29"
//                       stroke="currentColor"
//                       strokeWidth="3.5"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </button>

//                 <h2 className="q-title">{question.title}</h2>

//                 <div className="q-notes">
//                   {question.options.map((opt, i) => (
//                     <button
//                         key={i}
//                         type="button"
//                         className={`q-note ${selected === opt ? "selected" : ""}`}
//                         onClick={() => handleSelect(opt)}
//                         aria-pressed={selected === opt}
//                         disabled={phase !== "ready"}
//                         >
//                         <img
//                             src={note}
//                             className="q-note-img"
//                             alt=""
//                             draggable={false}
//                         />
//                         <span className="q-note-text">{opt}</span>
//                         </button>
//                   ))}
//                 </div>

//                 <button
//                   type="button"
//                   className="q-btn"
//                   disabled={selected === null}
//                   onClick={handleNext}
//                 >
//                   להמשך <span aria-hidden="true">←</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


/* ⚠️ שורות ה-import שלך נשארות למעלה כמו שהן
   (useState, useEffect, ALL_QUESTIONS, prisonBG, note, ה-css וכו') */

const FIRST_IDS = ["q1", "q2"]; // מופיעות באמצע הלומדה
const FINAL_IDS = ["q3", "q4", "q5", "q6"]; // מופיעות בסוף הלומדה
const ALL_IDS = [...FIRST_IDS, ...FINAL_IDS]; // כל 6 השאלות שנספרות בציון

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

/* ---------------- סיכום הציון (מסך התוצאות קורא לזה) ----------------
   הציון נקבע לפי הניסיון הראשון בכל שאלה.
   חזרות על טעויות ותרגול נוסף לא משנים אותו. */
export function getFinalSummary() {
  const store = readStore();
  const first = store.first || {};

  const items = ALL_IDS.map((id) => {
    const q = ALL_QUESTIONS.find((item) => item.id === id);
    const attempt = first[id];
    if (!q || !attempt) return null;
    return {
      id,
      title: q.title,
      rightAns: q.rightAns,
      chosen: attempt.chosen,
      correct: attempt.correct,
    };
  }).filter(Boolean);

  return {
    correct: items.filter((i) => i.correct).length,
    total: ALL_IDS.length,
    items,
    practiced: !!store.practiced,
  };
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
  } else if (part === "practice") {
    // כל השאלות שטעינו בהן בניסיון הראשון (משני החלקים)
    const first = readStore().first || {};
    ids = ALL_IDS.filter((id) => first[id] && !first[id].correct);
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

// מוחק התקדמות שמורה, כדי ש"תרגול נוסף" הבא יתחיל מאפס
function clearQuestionProgress(key) {
  progressMemory.delete(key);
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ממשיכים */
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
 *  part          - "first" (שתי השאלות הראשונות), "final" (4 האחרונות + מה שטעינו)
 *                  או "practice" (רק השאלות שטעינו בהן, לתרגול נוסף)
 *  chapterNumber - המספר בתגית "שאלות פרק X"
 *  onBack        - נקרא בלחיצה על החץ בשאלה הראשונה
 *  onFinish      - נקרא אחרי שהדלת נפתחת, עם
 *                  { correct, total, missedIds, overallCorrect, overallTotal }
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

    // תשובות הניסיון הראשון נשמרות לכל שאלה (בחלק הראשון ובחלק האחרון בלבד).
    // חזרות על טעויות בחלק האחרון, ותרגול נוסף, לא נספרות בציון.
    const first = { ...(readStore().first || {}) };
    if (part !== "practice") {
      questions.forEach((q, i) => {
        if (part === "final" && !FINAL_IDS.includes(q.id)) return;
        first[q.id] = {
          correct: answers[i] === q.rightAns,
          chosen: answers[i],
        };
      });
    }

    if (part === "final") {
      writeStore({ first, finalMissed: missedIds });
    } else if (part === "practice") {
      writeStore({ practiced: true });
      // כדי שהתרגול הבא יתחיל מאפס ולא ישחזר תשובות ישנות
      clearQuestionProgress(progressKey);
    } else {
      writeStore({ first, firstMissed: missedIds, firstCorrect: correct });
    }

    result.overallCorrect = ALL_IDS.filter((id) => first[id]?.correct).length;
    result.overallTotal = ALL_IDS.length;

    onFinish?.(result);
  }

  function handleDoorEnd() {
    if (phase === "closing") setPhase("ready");
    else if (phase === "leaving") finish();
  }

  const showContent = phase !== "closing";
  const backDisabled = index === 0 && typeof onBack !== "function";

  // תרגול ללא שאלות (למשל כניסה ישירה ל-route כשהכול נכון)
  if (!question) {
    return null;
  }

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




// import { Routes, Route, useNavigate } from "react-router-dom";
// import Questions from "./Questions";
// import Results from "./Results";

// /* ההנחה: react-router. עדכני את שמות הנתיבים לפי הפרויקט שלך. */

// function FinalQuestionsPage() {
//   const navigate = useNavigate();
//   return (
//     <Questions
//       part="final"
//       chapterNumber={1}
//       onFinish={() => navigate("/results")}
//     />
//   );
// }

// function PracticePage() {
//   const navigate = useNavigate();
//   return (
//     <Questions
//       part="practice"
//       chapterNumber={1}
//       onBack={() => navigate("/results")}
//       onFinish={() => navigate("/results")}
//     />
//   );
// }

// function ResultsPage() {
//   const navigate = useNavigate();
//   return (
//     <Results
//       chapterNumber={1}
//       onPractice={() => navigate("/practice")}
//       onContinue={() => navigate("/end")}
//     />
//   );
// }

// /* בתוך ה-Routes הקיימים שלך, מוסיפים: */
// // <Route path="/final-questions" element={<FinalQuestionsPage />} />
// // <Route path="/practice"        element={<PracticePage />} />
// // <Route path="/results"         element={<ResultsPage />} />
// // <Route path="/end"             element={<קומפוננטת-הסיום-שלך />} />