import { useState } from "react";
import "./FilesProSick.css";

import sickFile from "../../../../assets/images/files/file-sick.svg";
import problemsFile from "../../../../assets/images/files/file-problems.svg";
import Popup from "../../chapter1/elements/PopUp.jsx";
import FileTluna from "../FileTluna/FileTluna";
function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return ` ${year}  .${month}  .${day}`;
}
/*
  הטפסים לפי הסדר שבו הם מוצגים, כולל הגדרות המיקום (ROW ו-COLS) לכל טופס.
  כדי להחליף סדר מספיק להחליף בין שני האובייקטים.
*/
const FORMS = [
  {
    key: "problems",
    src: problemsFile,
    alt: "טופס מסדר בעיות",
    rowConfig: { top: 27.1, height: 2.6 },
    cols: [
      { key: "name", right: 15.6, width: 16 },
      { key: "id", right: 29.2, width: 30.5 },
      { key: "extra", right: 57.8, width: 18.8 },
      { key: "note", right: 75.8, width: 14.8 },
      // ה-date נמצא כאן עם שאר העמודות ומקבל עיצוב זהה, אבל עם top משלו (10)
      { key: "date", right: 55.8, width: 14.8, top: 15 },
           { key: "extraFillMame", right: 34.6, width: 14.8, top: 51.5 },
        { key: "extraFillMI", right: 20.6, width: 14.8, top: 51.5 },
        { key: "extraFillRank", right: 50.6, width: 14.8, top: 51.5 },
             { key: "extraFillMame2", right: 34.6, width: 14.8, top: 61.5 },
        { key: "extraFillMI2", right: 20.6, width: 14.8, top: 61.5 },
        { key: "extraFillRank2", right: 50.6, width: 14.8, top: 61.5 },
    ],
    row: {
      id: "חוסר בציוד לוגיסטי",
      name: "ישראל ישראלי",
      note: "בטיפול",
      extra: "לאפסנאות",
      date: getCurrentDate(),
      extraFillMame:"ישראלי ישראל",
      extraFillMI:"1234567",
      extraFillRank:"סגן",
      extraFillMame2 :"ישראלי ישראל",
      extraFillMI2:"1234567",
      extraFillRank2 :"סגן"
    },
  },
  {
    key: "sick",
    src: sickFile,
    alt: "טופס מסדר חולים",
    rowConfig: { top: 26.4, height: 2.6 },
    cols: [
      { key: "name", right: 20.6, width: 16 },
      { key: "id", right: 29.2, width: 30.5 },
      { key: "extra", right: 50.8, width: 14.8 },
      { key: "note", right: 70.8, width: 14.8 },
        { key: "date", right: 60.6, width: 14.8, top: 10 },
        { key: "extraFillMI", right: 20.6, width: 14.8, top: 78 },
        { key: "extraFillMame", right: 36.6, width: 14.8, top: 78 },
        { key: "extraFillRank", right: 51.6, width: 14.8, top: 78 },

    ],
    row: {
      id: "7654",
      name: "טוראי דוד כהן",
      extra: "בוצע",
      note: "כאבי בטן",
        date: getCurrentDate(),
            extraFillMame:"ישראלי ישראל",
      extraFillMI:"1234567",
      extraFillRank:"סגן",
    },
  },
];

/*
  סדר השלבים: פופ-אפ, ואז לכל טופס מצב ריק ומצב ממולא.
  חץ קדימה עובר שלב, חץ אחורה חוזר שלב.
*/const STEPS = [
  { type: "popup" },
  ...FORMS.flatMap((_, form) => [
    { type: "form", form, filled: false },
    { type: "form", form, filled: true },
  ]),
];

export default function FileProSick({ onNext, onBack }) {
  const [index, setIndex] = useState(0);

  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  function goNext() {
    if (isLast) {
      onNext?.();
      return;
    }
    setIndex(index + 1);
  }

  function goBack() {
    // מהפופ-אפ חוזרים לדיאלוג 2
    if (index === 0) {
      onBack?.();
      return;
    }
    setIndex(index - 1);
  }

  const form = step.type === "form" ? FORMS[step.form] : null;

  return (
    <div className="fps" dir="rtl">
      {/* אותה סצנה של דיאלוג 2, מטושטשת ולא ניתנת ללחיצה */}
      <div className="fps__scene" inert={true} aria-hidden="true">
        <FileTluna dialogueNumber={2} still />
      </div>
      <div className="fps__backdrop" aria-hidden="true" />

      {form && (
        <>
          <div className="fps__form" key={form.key}>
            <div className="fps__paper">
              <img src={form.src} alt={form.alt} draggable={false} />

              {/* הוספת הסלוטייפ בפינה */}
              <div className="fps__tape" aria-hidden="true" />
              <div className="fps__tape2" aria-hidden="true" />

              {step.filled && (
                <div
                  className="fps__row"
                  style={{
                    "--row-top": form.rowConfig.top,
                    "--row-h": form.rowConfig.height,
                  }}
                >
                  {form.cols.map((col) => (
                    <span
                      key={col.key}
                      className="fps__cell"
                      style={{
                        "--right": col.right,
                        "--width": col.width,
                        ...(col.top !== undefined && { top: `${col.top}%` }),
                      }}
                    >
                      {form.row[col.key]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="fps__arrow fps__arrow--back"
            onClick={goBack}
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

          <button
            type="button"
            className="fps__arrow fps__arrow--next"
            onClick={goNext}
            aria-label="הבא"
          >
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path
                d="M31 20H9M18 11L9 20L18 29"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {step.type === "popup" && (
        <Popup num={2} onContinue={goNext} onClose={goBack} />
      )}
    </div>
  );
}