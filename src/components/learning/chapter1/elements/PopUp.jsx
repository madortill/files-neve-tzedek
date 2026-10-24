
import { useState } from "react";
import marker from "../../../../assets/images/marker.svg";
import "./PopUp.css";

export default function PopUp({ onContinue, onClose }) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const title = "דגשים:";

  const instructions = [
    "באישור המעבר נרשום את השם המלא של החייל ומספרו האישי",
    "בחלק של ההערות נציין את רמ״ס הכלוא",
    "ברגע שסיימנו לרשום את כל השמות, נחתום את האישור מעבר בצורת האות Z ונרשום כמה חיילים בטופס",
  ];

  return (
    <div className="popup-overlay">
      <div
        className="popup-content"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        <h2 id="popup-title" className="popup-title">
          {title}
        </h2>

        <ul className="popup-instructions">
          <li>{instructions[0]}</li>
          <li>{instructions[1]}</li>
        </ul>

        <div className="popup-highlight-area">
          <p className="popup-highlight-paragraph">
            <span
              className={`popup-highlight-text ${
                isHighlighted ? "is-highlighted" : ""
              }`}
            >
              {instructions[2]}
            </span>
          </p>

          <button
            type="button"
            className="popup-marker-button"
            onClick={() => setIsHighlighted((prev) => !prev)}
            aria-label={
              isHighlighted ? "הסרת ההדגשה" : "הדגשת הטקסט במרקר"
            }
            aria-pressed={isHighlighted}
          >
            <img
              src={marker}
              alt=""
              className="popup-marker"
              draggable="false"
            />
          </button>
        </div>

        <button
          type="button"
          className="popup-continue"
          onClick={onContinue}
        >
          לטופס!
        </button>
      </div>
    </div>
  );
}
