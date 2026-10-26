import { useEffect, useState } from "react";
import "./ChapterNav2.css";

import tillLogo from "../../../assets/images/Till.svg";
import bahad13 from "../../../assets/images/bahad13.svg";

import FileTluna from "./FileTluna/FileTluna";
import FormFillTluna from "./formFillTluna/FormFillTluna";
import FormViewer from "../FormViewer";
import { TlunaForm } from "../../../data/forms/TlunaForm.js";
import Questions from "../questions/Questions.jsx";
const STORAGE_KEY = "forms-course:chapter2";
const STEPS = ["file1", "form1","question"];

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

export default function ChapterNav2({
  onBack,
  onFinish,
  complaintForm,
}) {
  const [savedProgress] = useState(readProgress);

  const [step, setStep] = useState(() =>
    STEPS.includes(savedProgress.step)
      ? savedProgress.step
      : STEPS[0]
  );

  const [answers, setAnswers] = useState(() => {
    const savedAnswers = savedProgress.answers;

    return savedAnswers &&
      typeof savedAnswers === "object" &&
      !Array.isArray(savedAnswers)
      ? savedAnswers
      : {};
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          step,
          answers,
        })
      );
    } catch {
      // ממשיכים גם אם האחסון חסום.
    }
  }, [step, answers]);

  function updateAnswer(fieldId, value) {
    setAnswers((previous) => ({
      ...previous,
      [fieldId]: value,
    }));
  }

  function goNext() {
    const index = STEPS.indexOf(step);
    const nextStep = STEPS[index + 1];

    if (nextStep) {
      setStep(nextStep);
      return;
    }

    // Learning תציג את Questions.
    onFinish?.();
  }

  function goBack() {
    const index = STEPS.indexOf(step);

    if (index === 0) {
      onBack?.();
      return;
    }

    setStep(STEPS[index - 1]);
  }

  const backDisabled =
    step === STEPS[0] && typeof onBack !== "function";

  function renderStep() {
    switch (step) {
      case "file1":
        return <FileTluna onNext={goNext} />;

   case "form1":
  return (
    <FormFillTluna
      answers={answers}
      onAnswerChange={updateAnswer}
      onContinue={goNext}
    />
  );
   case "question":
  return (
    <Questions
      answers={answers}
      onAnswerChange={updateAnswer}
      onContinue={goNext}
    />
  );

      default:
        return null;
    }
  }

 return (
  <section className="chapter2" dir="rtl">
    <header className="chapter2-header">
      <div className="chapter2-logos">
        <img src={bahad13} alt='בה״ד 13' draggable={false} />
        <img src={tillLogo} alt='מדור טי״ל' draggable={false} />
      </div>
    </header>

    <main className="chapter2-content">
      <div className="chapter2-frame">
        {renderStep()}
      </div>
    </main>

    <nav className="chapter2-controls" aria-label="ניווט בפרק 2">
      <button
        type="button"
        className="chapter2-back"
        onClick={goBack}
        disabled={backDisabled}
        aria-label="חזור"
      >
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path
            d="M9 20H31M22 11L31 20L22 29"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  </section>
);
}