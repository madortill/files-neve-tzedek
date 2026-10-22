import { useEffect, useState } from "react";

import stampMouse from "../../../../assets/images/stamp.svg";
import tap from "../../../../assets/images/tap.svg";
import pencil from "../../../../assets/images/pencil.svg";
import folderIcon from "../../../../assets/images/folder.svg";

import "./TheThreeStampPage.css";

const STORAGE_KEY = "forms-course:chapter1:stamps";

// כאן מחליפים את הטקסטים
const content = {
  title: "אישור מעבר",
  label: "טופס אישור מעבר",
  introduction:
    "אישור מעבר הוא הטופס שנשתמש בו כאשר יש צורך בהוצאת כלוא ממתחם הפלוגה.",
  fields: [
    { label: "מי?", text: "נרשום את שם הפלוגה" },
    { label: "מתי?", text: "תאריך כתיבת האישור ולמתי האישור "},
    { label: "למה?", text: "לאיזה צורך הכלואים יוצאים מהפלוגה" },
  ],
  instruction: "על מנת שאישור מעבר יהיה תקני צריך להיות עליו 3 חתימות:",
  note: "דוגמאות לסיבות ליציאה מהפלוגה: בית דין, מטבח, שמירות, משיכות, קב”ן",
};

const stamps = [
  { id: "first", text: "מהכלא\nמפ תורן" },
  { id: "second", text: " רמן תורן" },
  { id: "third", text: " לפלוגה הרלוונטית\ קצין ששיך " },
];

function readProgress() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));

    return {
      entered: saved?.entered === true,
      signedIds: Array.isArray(saved?.signedIds)
        ? stamps
            .filter((stamp) => saved.signedIds.includes(stamp.id))
            .map((stamp) => stamp.id)
        : [],
    };
  } catch {
    return { entered: false, signedIds: [] };
  }
}

export default function TheThreeStampPage({
  onComplete,
  isCompleted = false,
}) {
  const [saved] = useState(readProgress);

  const [signedIds, setSignedIds] = useState(() =>
    isCompleted ? stamps.map((stamp) => stamp.id) : saved.signedIds
  );

  const [animateEntrance] = useState(
    () => !saved.entered && !isCompleted
  );

  const [cursor, setCursor] = useState(null);

  const allSigned = stamps.every((stamp) =>
    signedIds.includes(stamp.id)
  );

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          entered: true,
          signedIds,
        })
      );
    } catch {
      // הפעילות ממשיכה לעבוד גם כשהאחסון חסום.
    }
  }, [signedIds]);

  useEffect(() => {
    if (allSigned && !isCompleted) {
      onComplete?.();
    }
  }, [allSigned, isCompleted, onComplete]);

  function sign(id) {
    setSignedIds((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  }

  function moveCursor(event) {
    if (event.pointerType !== "mouse") return;

    setCursor({
      x: event.clientX,
      y: event.clientY,
    });
  }

  return (
    <div
      className={`three-stamps-page ${
        animateEntrance ? "three-stamps-page--entering" : ""
      }`}
      dir="rtl"
    >
      <header className="three-stamps-header">
        <h1>{content.title}</h1>
        <span className="three-stamps-label">{content.label}</span>
      </header>

      <div className="three-stamps-scene">
        {/* החלק האחורי של אותה תיקייה מעמוד המטרות */}
        <div className="three-stamps-folder" aria-hidden="true">
          <img src={folderIcon} alt="" draggable={false} />
        </div>

        <article
          className="three-stamps-paper"
          aria-label={content.title}
          onPointerMove={moveCursor}
          onPointerLeave={() => setCursor(null)}
        >
          <div className="three-stamps-paper-scroll">
            <p className="three-stamps-introduction">
              {content.introduction}
            </p>

            <section className="three-stamps-fields">
              <h2>
                <img src={pencil} alt="" draggable={false} />
                איך ממלאים?
              </h2>

              <dl>
                {content.fields.map((field) => (
                  <div
                    className="three-stamps-field"
                    key={field.label}
                  >
                    <dt>{field.label}</dt>
                    <dd>{field.text}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="three-stamps-instructions">
              <p>
                {allSigned && (
                  <span
                    className="three-stamps-check"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}

                {content.instruction} <strong>3 חתימות:</strong>
              </p>

              <p className="three-stamps-hint">
                <img src={tap} alt="" draggable={false} />
                לחצו על שלושת הקווים כדי לחתום
              </p>
            </div>

            <div className="three-stamps-signatures">
              {stamps.map((stamp) => {
                const signed = signedIds.includes(stamp.id);

                return (
                  <button
                    key={stamp.id}
                    type="button"
                    className={`three-stamps-signature ${
                      signed ? "is-signed" : ""
                    }`}
                    onClick={() => sign(stamp.id)}
                    aria-label={
                      signed
                        ? `${stamp.text} — נחתם`
                        : `הוספת ${stamp.text}`
                    }
                    aria-disabled={signed}
                  >
                    {signed && (
                      <span className="three-stamps-imprint">
                        {stamp.text}
                      </span>
                    )}

                    <span
                      className="three-stamps-signature-line"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            {/* מקום שמור להערה מונע קפיצה לאחר החתימה */}
            <div className="three-stamps-note-slot">
              <p
                className={`three-stamps-note ${
                  allSigned ? "is-visible" : ""
                }`}
                aria-hidden={!allSigned}
              >
                {content.note}
              </p>
            </div>

            <span className="three-stamps-sr-only" role="status">
              {allSigned
                ? "כל החתימות הושלמו. אפשר להמשיך."
                : `נוספו ${signedIds.length} מתוך 3 חתימות.`}
            </span>
          </div>
        </article>

        {/* אותו SVG בשכבה קדמית, עם חשיפה של החלק התחתון */}
        <div
          className="three-stamps-folder three-stamps-folder--front"
          aria-hidden="true"
        >
          <img src={folderIcon} alt="" draggable={false} />
        </div>
      </div>

      {cursor && (
        <img
          src={stampMouse}
          className="three-stamps-cursor"
          style={{
            left: cursor.x,
            top: cursor.y,
          }}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      )}
    </div>
  );
}