import { useEffect, useRef, useState } from "react";
import "./FileAsking.css";

import FormIMG from "../../../../assets/images/files/file-askinging.svg";

const pad = (n) => String(n).padStart(2, "0");
const now = new Date();
const DAY = pad(now.getDate());
const MONTH = pad(now.getMonth() + 1);
const YEAR = String(now.getFullYear());
const TODAY = `${DAY}/${MONTH}/${YEAR}`;

const ROW_H = 2.6; // גובה ברירת מחדל לשדה (באחוזים מגובה הדף)

// כל המיקומים באחוזים מגודל הדף: right / width / top / height
const COLS = [
    { key: "date", right: 74.17, width: 21.01, top: 6.44 },
    { key: "to", right: 6.93, width: 14.41, top: 12.28 },
    { key: "via", right: 7.65, width: 13.69, top: 15.29 },
    { key: "personalId", right: 8.49, width: 12.97, top: 18.29 },
    { key: "fullName", right: 23.74, width: 13.69, top: 18.29 },
    { key: "subject", right: 12.81, width: 54.04, top: 24.14, align: "start" },
    { key: "punishment", right: 27.34, width: 11.05, top: 26.5 },
    { key: "days", right: 42.47, width: 11.05, top: 26.5 },
    { key: "startDate", right: 14.01, width: 26.54, top: 28.69 },
    { key: "releaseDate", right: 55.56, width: 17.65, top: 28.69 },
    { key: "line1", right: 5.6, width: 88.02, top: 35.91, height: 2.2, align: "start" },
    { key: "line2", right: 5.6, width: 88.02, top: 38.18, height: 2.2, align: "start" },
    { key: "line3", right: 5.6, width: 88.02, top: 40.54, height: 2.2, align: "start" },
    { key: "page", right: 9.09, width: 7.69, top: 87.65 },
    { key: "pageTotal", right: 21.94, width: 7.81, top: 87.65 },
    { key: "signature", right: 73.33, width: 18.85, top: 87.65 },
];

const ROW = {
  date: TODAY,
  to: "מפקד הכלא",
  via: "קצין הכלא",
  personalId: "1234567",
  fullName: "ישראל ישראלי",
  subject: "קיצור תקופת מאסר",
  punishment: "מחבוש",
  days: "14",
  startDate: TODAY,
  releaseDate: "20/11/2026",
  line1: "אני מבקש לקצר את תקופת המאסר בשל צורך משפחתי דחוף שהתעורר",
  line2: "בשבוע האחרון. מצורפים אישורים רלוונטיים והמלצת המפקד הישיר.",
  line3: "אודה לטיפולכם המהיר בבקשה.",
  page: "1",
  pageTotal: "1",
  signature: "ישראל ישראלי",
};

const FileAsking = ({ onNext }) => {
  const [filled, setFilled] = useState(false);
  const paperRef = useRef(null);

  // גודל הטקסט יחסי לגובה הדף בפועל
  useEffect(() => {
    const el = paperRef.current;
    if (!el) return;
    const update = () =>
      el.style.setProperty("--paper-h", `${el.clientHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleClick = () => {
    if (!filled) setFilled(true); // לחיצה ראשונה – מילוי
    else onNext?.(); // לחיצה שנייה – הלאה
  };

  return (
    <div className="ask-form">
      <div className="ask-form__stage">
        <div className="ask-form__paper" ref={paperRef}>
          <img
            className="ask-form__img"
            src={FormIMG}
            alt="טופס בקשה לכלוא"
            draggable={false}
          />

          {filled && (
            <div className="ask-form__row">
              {COLS.map((col, i) => (
                <div
                  key={col.key}
                  className={`ask-form__cell ${
                    col.align === "start" ? "ask-form__cell--start" : ""
                  }`}
                  style={{
                    "--row-top": col.top,
                    "--row-h": col.height ?? ROW_H,
                    "--right": col.right,
                    "--width": col.width,
                    animationDelay: `${i * 90}ms`,
                  }}
                >
                  {ROW[col.key]}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button type="button" className="ask-form__continue" onClick={handleClick}>
        {filled ? "המשך" : "מילוי"}
      </button>
    </div>
  );
};

export default FileAsking;