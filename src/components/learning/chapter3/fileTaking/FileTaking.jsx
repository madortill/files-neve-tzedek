import { useEffect, useRef, useState } from "react";
import "./FileTaking.css";

import FormIMG from "../../../../assets/images/files/file-takinging.svg";

const pad = (n) => String(n).padStart(2, "0");
const now = new Date();
const DAY = pad(now.getDate());
const MONTH = pad(now.getMonth() + 1);
const YEAR = String(now.getFullYear());
const TODAY = `${DAY}/${MONTH}/${YEAR}`;

const ROW_H = 2.6; // גובה ברירת מחדל לשדה (באחוזים מגובה הדף)

// כל המיקומים באחוזים מגודל הדף: right / width / top / height
const COLS = [
    { key: "date", right: 77.88, width: 14.54, top: 10.94 },
    { key: "d1", right: 15.86, width: 5.53, top: 17.79 },
    { key: "m1", right: 22.11, width: 5.53, top: 17.79 },
    { key: "y1", right: 28.24, width: 5.53, top: 17.79 },
    { key: "name1", right: 12.37, width: 21.88, top: 19.96 },
    { key: "id1", right: 38.69, width: 14.3, top: 19.96 },
    { key: "d2", right: 66.82, width: 5.53, top: 19.96 },
    { key: "m2", right: 73.07, width: 5.53, top: 19.96 },
    { key: "y2", right: 79.32, width: 5.53, top: 19.96 },
    { key: "searcherName", right: 21.75, width: 23.08, top: 24.39 },
    { key: "searcherId", right: 49.15, width: 23.32, top: 24.39 },
    { key: "itemA", right: 11.17, width: 20.91, top: 31.24 },
    { key: "itemB", right: 34.13, width: 20.91, top: 31.24 },
    { key: "itemC", right: 56.72, width: 22.12, top: 31.24 },
    { key: "itemD", right: 11.41, width: 20.91, top: 33.5 },
    { key: "itemE", right: 35.09, width: 19.71, top: 33.5 },
    { key: "itemF", right: 56.96, width: 22.12, top: 33.5 },
    { key: "decision", right: 8.88, width: 84.98, top: 40.18, align: "start" },
    { key: "commanderSign", right: 67.54, width: 25.72, top: 42.44 },
    { key: "bagBig", right: 25.11, width: 8.77, top: 54.2 },
    { key: "bagSmall", right: 37.85, width: 8.77, top: 54.2 },
    { key: "depositDate", right: 16.94, width: 18.75, top: 56.37 },
    { key: "depositorSign", right: 16.94, width: 26.32, top: 58.63 },
    { key: "soldierName", right: 12.13, width: 18.75, top: 63.06 },
    { key: "soldierId", right: 35.33, width: 14.06, top: 63.06 },
    { key: "soldierSign", right: 70.91, width: 22.36, top: 67.73 },
    { key: "handName", right: 11.77, width: 25.36, top: 76.51 },
    { key: "handId", right: 40.74, width: 18.63, top: 76.51 },
    { key: "duringName", right: 26.31, width: 15.87, top: 78.85 },
    { key: "duringId", right: 47.11, width: 17.43, top: 78.85 },
    { key: "bItemA", right: 5.16, width: 24.16, top: 83.44 },
    { key: "bItemB", right: 31.96, width: 24.16, top: 83.44 },
    { key: "bItemC", right: 58.89, width: 23.32, top: 83.44 },
    { key: "bItemD", right: 4.92, width: 24.16, top: 85.69 },
    { key: "bItemE", right: 31.84, width: 24.28, top: 85.69 },
    { key: "bItemF", right: 58.77, width: 23.32, top: 85.69 },
    { key: "bBagBig", right: 40.26, width: 10.94, top: 87.95 },
    { key: "bBagSmall", right: 56.24, width: 11.18, top: 87.95 },
    { key: "sSign", right: 13.93, width: 24.28, top: 90.2 },
    { key: "bd", right: 53.96, width: 5.65, top: 90.2 },
    { key: "bm", right: 60.33, width: 5.53, top: 90.2 },
    { key: "by", right: 66.58, width: 5.65, top: 90.2 },
];

const ROW = {
  date: TODAY,
  d1: DAY, m1: MONTH, y1: YEAR,
  name1: "ישראל ישראלי",
  id1: "1234567",
  d2: "01", m2: "09", y2: YEAR,
  searcherName: "דנה לוי",
  searcherId: "7654321",
  itemA: "מכשיר סלולרי",
  itemB: "מטען",
  itemC: "אוזניות",
  itemD: "ארנק",
  itemE: "שעון",
  itemF: "מפתחות",
  decision: "החפצים הוחרמו והופקדו בפיקדון החייל.",
  commanderSign: "סגן ישראלי",
  bagBig: "12",
  bagSmall: "3",
  depositDate: TODAY,
  depositorSign: "סגן ישראלי",
  soldierName: "ישראל ישראלי",
  soldierId: "1234567",
  soldierSign: "ישראל ישראלי",
  handName: "ישראל ישראלי",
  handId: "1234567",
  duringName: "דנה לוי",
  duringId: "7654321",
  bItemA: "מכשיר סלולרי",
  bItemB: "מטען",
  bItemC: "אוזניות",
  bItemD: "ארנק",
  bItemE: "שעון",
  bItemF: "מפתחות",
  bBagBig: "12",
  bBagSmall: "3",
  sSign: "ישראל ישראלי",
  bd: DAY, bm: MONTH, by: YEAR,
};

const FileTaking = ({ onNext }) => {
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
    <div className="take-form">
      <div className="take-form__stage">
        <div className="take-form__paper" ref={paperRef}>
          <img
            className="take-form__img"
            src={FormIMG}
            alt="טופס הפקדה"
            draggable={false}
          />

          {filled && (
            <div className="take-form__row">
              {COLS.map((col, i) => (
                <div
                  key={col.key}
                  className={`take-form__cell ${
                    col.align === "start" ? "take-form__cell--start" : ""
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

      <button type="button" className="take-form__continue" onClick={handleClick}>
        {filled ? "המשך" : "מילוי"}
      </button>
    </div>
  );
};

export default FileTaking;