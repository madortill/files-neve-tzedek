import { useEffect, useState } from "react";
// משתמשים באותם סגנונות של פרק 2 (header / controls / nav).
// אם תרצי קובץ CSS נפרד לפרק 3 - תעתיקי אותו ותחליפי את ה-import ואת שמות המחלקות.
import "../chapter2/ChapterNav2.css";

import tillLogo from "../../../assets/images/Till.svg";
import bahad13 from "../../../assets/images/bahad13.svg";

import ChatOffice from "./chatOffice/ChatOffice.jsx";
import FileAsking from "./fileAsking/FileAsking.jsx";

const STORAGE_KEY = "forms-course:chapter3";

// chat1 - טקסט ראשון | chat2 - "איך נמלא?" | desk - חלונית יורדת + נייר זוהר | fileAsking - הטופס
const STEPS = ["chat1", "chat2", "desk", "fileAsking"];

function readProgress() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (!saved || saved.version !== 1) return {};
    return saved;
  } catch {
    return {};
  }
}

export default function ChapterNav3({ onBack, onFinish }) {
  const [savedProgress] = useState(readProgress);

  const [step, setStep] = useState(() =>
    STEPS.includes(savedProgress.step) ? savedProgress.step : STEPS[0]
  );
  const stepIndex = STEPS.indexOf(step);

  const [maxIndex, setMaxIndex] = useState(() =>
    Math.max(
      Number.isInteger(savedProgress.maxIndex) ? savedProgress.maxIndex : 0,
      stepIndex
    )
  );

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, step, maxIndex })
      );
    } catch {
      // ממשיכים גם אם האחסון חסום.
    }
  }, [step, maxIndex]);

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

  function goForward() {
    if (stepIndex < maxIndex) setStep(STEPS[stepIndex + 1]);
  }

  const backDisabled = stepIndex === 0 && typeof onBack !== "function";
  const forwardDisabled = stepIndex >= maxIndex;

  function renderStep() {
    switch (step) {
      case "chat1":
        return <ChatOffice dialogueNumber={1} onNext={goNext} />;
      case "chat2":
        return <ChatOffice dialogueNumber={2} onNext={goNext} />;
      case "desk":
        // אותו קומפוננטה באותו מיקום => React לא מרנדר מחדש והחלונית יורדת באנימציה
        return <ChatOffice dialogueNumber={3} onNext={goNext} />;
      case "fileAsking":
        return <FileAsking onNext={goNext} />;
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

      <nav className="chapter2-controls" aria-label="ניווט בפרק 3">
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
    </section>
  );
}