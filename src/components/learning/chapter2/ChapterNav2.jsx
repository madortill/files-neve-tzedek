import { useEffect, useState } from "react";
import "./ChapterNav2.css";

import tillLogo from "../../../assets/images/Till.svg";
import bahad13 from "../../../assets/images/bahad13.svg";

import FileTluna from "./FileTluna/FileTluna";
import Popup from "../chapter1/elements/PopUp.jsx";
import FormFillTluna from "./formFillTluna/FormFillTluna";
import FormViewer from "../FormViewer";
import { TlunaForm } from "../../../data/forms/TlunaForm.js";
import Questions from "../questions/Questions.jsx";
const STORAGE_KEY = "forms-course:chapter2";

const STEPS = ["file1", "form1", "questions1", "file2","popUp"];
function readProgress() {
  try {
    const saved = JSON.parse(
      sessionStorage.getItem(STORAGE_KEY)
    );

    if (!saved || saved.version !== 1) return {};

    return saved;
  } catch {
    return {};
  }
}

// export default function ChapterNav2({
//   onBack,
//   onFinish,
//   complaintForm,
// }) {
//   const [savedProgress] = useState(readProgress);

//   const [step, setStep] = useState(() =>
//     STEPS.includes(savedProgress.step)
//       ? savedProgress.step
//       : STEPS[0]
//   );

//   const [answers, setAnswers] = useState(() => {
//     const savedAnswers = savedProgress.answers;

//     return savedAnswers &&
//       typeof savedAnswers === "object" &&
//       !Array.isArray(savedAnswers)
//       ? savedAnswers
//       : {};
//   });

//   useEffect(() => {
//     try {
//       sessionStorage.setItem(
//         STORAGE_KEY,
//         JSON.stringify({
//           version: 1,
//           step,
//           answers,
//         })
//       );
//     } catch {
//       // ממשיכים גם אם האחסון חסום.
//     }
//   }, [step, answers]);

//   function updateAnswer(fieldId, value) {
//     setAnswers((previous) => ({
//       ...previous,
//       [fieldId]: value,
//     }));
//   }

//   function goNext() {
//     const index = STEPS.indexOf(step);
//     const nextStep = STEPS[index + 1];

//     if (nextStep) {
//       setStep(nextStep);
//       return;
//     }

//     // Learning תציג את Questions.
//     onFinish?.();
//   }

//   function goBack() {
//     const index = STEPS.indexOf(step);

//     if (index === 0) {
//       onBack?.();
//       return;
//     }

//     setStep(STEPS[index - 1]);
//   }

//   const backDisabled =
//     step === STEPS[0] && typeof onBack !== "function";

// function renderStep() {
//   switch (step) {
//     case "file1":
//       return <FileTluna part={1} onNext={goNext} />;

//     case "form1":
//       return (
//         <FormFillTluna
//           answers={answers}
//           onAnswerChange={updateAnswer}
//           onContinue={goNext}
//         />
//       );

//     case "questions1":
//       return (
//         <Questions
//           part="first"
//           chapterNumber={2}
//           onBack={goBack}
//           onFinish={goNext}
//         />
//       );

//     case "file2":
//       return <FileTluna part={2} onNext={goNext} />;

//     default:
//       return null;
//   }
// }

//  return (
//   <section className="chapter2" dir="rtl">
//     <header className="chapter2-header">
//       <div className="chapter2-logos">
//         <img src={bahad13} alt='בה״ד 13' draggable={false} />
//         <img src={tillLogo} alt='מדור טי״ל' draggable={false} />
//       </div>
//     </header>

//     <main className="chapter2-content">
//       <div className="chapter2-frame">
//         {renderStep()}
//       </div>
//     </main>

//     <nav className="chapter2-controls" aria-label="ניווט בפרק 2">
//       <button
//         type="button"
//         className="chapter2-back"
//         onClick={goBack}
//         disabled={backDisabled}
//         aria-label="חזור"
//       >
//         <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
//           <path
//             d="M9 20H31M22 11L31 20L22 29"
//             stroke="currentColor"
//             strokeWidth="3"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </button>
//     </nav>
//   </section>
// );
// }

export default function ChapterNav2({ onBack, onFinish }) {
  const [savedProgress] = useState(readProgress);

  const [step, setStep] = useState(() =>
    STEPS.includes(savedProgress.step) ? savedProgress.step : STEPS[0]
  );
  const stepIndex = STEPS.indexOf(step);

  // השלב הרחוק ביותר שהמשתמש הגיע אליו
  const [maxIndex, setMaxIndex] = useState(() =>
    Math.max(
      Number.isInteger(savedProgress.maxIndex) ? savedProgress.maxIndex : 0,
      stepIndex
    )
  );

  const [answers, setAnswers] = useState(() => {
    const a = savedProgress.answers;
    return a && typeof a === "object" && !Array.isArray(a) ? a : {};
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, step, maxIndex, answers })
      );
    } catch {
      // ממשיכים גם אם האחסון חסום.
    }
  }, [step, maxIndex, answers]);

  function updateAnswer(fieldId, value) {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  }

  // נקרא כשהשלב הסתיים (מהקומפוננטות עצמן)
  function goNext() {
    const nextStep = STEPS[stepIndex + 1];
    if (nextStep) {
      setStep(nextStep);
      setMaxIndex((m) => Math.max(m, stepIndex + 1));
      return;
    }
    onFinish?.();
  }

  function goBack() {
    if (stepIndex === 0) {
      onBack?.();
      return;
    }
    setStep(STEPS[stepIndex - 1]);
  }

  // כפתור קדימה בניווט: רק לשלב שכבר עברנו
  function goForward() {
    if (stepIndex < maxIndex) setStep(STEPS[stepIndex + 1]);
  }

  const backDisabled = stepIndex === 0 && typeof onBack !== "function";
  const forwardDisabled = stepIndex >= maxIndex;
  const hideNav = step === "questions1";

  function renderStep() {
    switch (step) {
      case "file1":
        return <FileTluna dialogueNumber={1} onNext={goNext} />;
      case "form1":
        return (
          <FormFillTluna
            answers={answers}
            onAnswerChange={updateAnswer}
            onContinue={goNext}
          />
        );
      case "questions1":
        return (
          <Questions
            part="first"
            chapterNumber={2}
            onBack={goBack}
            onFinish={goNext}
          />
        );
      case "file2":
        return <FileTluna dialogueNumber={2} onNext={goNext} />;
      case "popUp":
        return <Popup num={2} dialogueNumber={2} onNext={goNext} />;
      default:
        return null;
    }
  }

  return (
    <section className="chapter2" dir="rtl">
      <header className="chapter2-header">
        <div className="chapter2-logos">
          <img src={bahad13} alt="בה״ד 13" draggable={false} />
          <img src={tillLogo} alt="מדור טי״ל" draggable={false} />
        </div>
      </header>

      <main className="chapter2-content">
        <div className="chapter2-frame">{renderStep()}</div>
      </main>

      {!hideNav && (
        <nav className="chapter2-controls" aria-label="ניווט בפרק 2">
          {/* ב-RTL הראשון מופיע בימין: אחורה אפור */}
          <button
            type="button"
            className="chapter2-nav chapter2-nav--back"
            onClick={goBack}
            disabled={backDisabled}
            aria-label="חזור"
          >
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path d="M9 20H31M22 11L31 20L22 29" stroke="currentColor"
                strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* קדימה כחול בשמאל */}
          <button
            type="button"
            className="chapter2-nav chapter2-nav--next"
            onClick={goForward}
            disabled={forwardDisabled}
            aria-label="הבא"
          >
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path d="M31 20H9M18 11L9 20L18 29" stroke="currentColor"
                strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </nav>
      )}
    </section>
  );
}