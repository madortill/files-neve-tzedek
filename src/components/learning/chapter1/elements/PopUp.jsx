import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import marker from "../../../../assets/images/marker.svg";
import "./PopUp.css";

const POPUP_CONTENT = {
  1: {
    items: [
      "באישור המעבר נרשום את השם המלא של החייל ומספרו האישי",
      "בחלק של ההערות נציין את רמ״ס הכלוא",
    ],
    highlight:
      "ברגע שסיימנו לרשום את כל השמות, נחתום את האישור מעבר בצורת האות Z ונרשום כמה חיילים בטופס",
  },
  2: {
    items: [
      "תצפו בעוד רגע בטופס של מסדר חולים - המסדר הינו מסדר",
      "יומי לרישום החיילים שרוצים לראות גורם רפואי.",
    ],
    highlight:
      "״מסדר בעיות״ הוא הליך רשמי שנועד לאפשר לכלואים להציג בעיות אישיות, רפואיות, נפשיות או ת״ש לגורם עליון",
  },
};

export default function PopUp({ num = 1, onContinue, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const [highlighted, setHighlighted] = useState(false);

  const { items, highlight } = POPUP_CONTENT[num];

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="notes-popup"
      dir="rtl"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <button
        type="button"
        className="notes-popup-back"
        onClick={onClose}
        aria-label="חזרה למסך הקודם"
      >
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path
            d="M9 20H31M22 11L31 20L22 29"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <h2 id={titleId} className="notes-popup-title">
        דגשים:
      </h2>

      <ul className="notes-popup-list">
        {items.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>

      <div className="notes-popup-highlight">
        <button
          type="button"
          className="notes-popup-marker-button"
          onClick={() => setHighlighted(true)}
          aria-label="סמן את הטקסט"
        >
          <img
            src={marker}
            className="notes-popup-marker"
            alt=""
            draggable={false}
          />
        </button>

        <p>
          <span
            className={`notes-popup-highlight-text ${
              highlighted ? "is-highlighted" : ""
            }`}
          >
            {highlight}
          </span>
        </p>
      </div>

      <button
        type="button"
        className="notes-popup-continue"
        onClick={onContinue}
        autoFocus
      >
        לטופס!
      </button>
    </dialog>,
    document.body
  );
}