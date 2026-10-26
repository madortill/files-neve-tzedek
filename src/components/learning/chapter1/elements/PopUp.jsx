import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import marker from "../../../../assets/images/marker.svg";
import "./PopUp.css";

export default function PopUp({ onContinue, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();

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
        <svg
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
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
        <li>
          באישור המעבר נרשום את השם המלא של החייל ומספרו האישי
        </li>

        <li>
          בחלק של ההערות נציין את רמ״ס הכלוא
        </li>
      </ul>

      <div className="notes-popup-highlight">
        <img
          src={marker}
          className="notes-popup-marker"
          alt=""
          draggable={false}
        />

        <p>
          <span>
            ברגע שסיימנו לרשום את כל השמות, נחתום את האישור
            מעבר בצורת האות Z ונרשום כמה חיילים בטופס
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