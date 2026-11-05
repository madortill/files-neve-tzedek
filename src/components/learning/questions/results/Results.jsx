import { useMemo, useState } from "react";
// אותם ייבואים כמו ב-Questions.jsx (עדכני נתיבים לפי הפרויקט שלך)
import prisonBG from "../assets/prisonBG.png";
import { getFinalSummary } from "./Questions";
import "./results.css";

const CONFETTI_COLORS = ["#f5a623", "#4ec3c3", "#e86f9a", "#7e8be8", "#8fd36b", "#f2d33d"];

function Confetti() {
  // נוצר פעם אחת, כדי שהקונפטי לא "יקפוץ" בכל רינדור
  const pieces = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 0.8 + Math.random() * 1.1,
        delay: Math.random() * 1.2,
        duration: 2.4 + Math.random() * 2,
        rotate: Math.random() * 360,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        round: i % 4 === 0,
      })),
    []
  );

  return (
    <div className="r-confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`r-confetti-piece ${p.round ? "round" : ""}`}
          style={{
            left: `${p.left}%`,
            width: `${p.size}cqw`,
            height: `${p.round ? p.size : p.size * 2}cqw`,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * props:
 *  chapterNumber - המספר בתגית "שאלות פרק X"
 *  onContinue    - לחיצה על "להמשך"
 *  onPractice    - לחיצה על "לתרגול נוסף" (ההורה אמור להציג Questions עם part="practice")
 */
export default function Results({ chapterNumber = 1, onContinue, onPractice }) {
  const { correct, total, items, practiced } = useMemo(() => getFinalSummary(), []);
  const [showDetails, setShowDetails] = useState(false);

  const wrong = total - correct;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  const perfect = correct === total;

  // כמו בעיצוב: בציון מושלם "לתרגול נוסף" אפור; אחרת "להמשך" אפור
  // עד שמסיימים תרגול אחד לפחות.
  const canContinue = perfect || practiced;
  const canPractice = !perfect;

  return (
    <div className="q-wrap" dir="rtl">
      <div className="q-stage r-stage" style={{ backgroundImage: `url(${prisonBG})` }}>
        <div className="q-content">
          <div className="q-chapter-tag">שאלות פרק {chapterNumber}</div>

          <div className="q-fit">
            <div className="q-card r-card">
              {perfect && <Confetti />}

              <button
                type="button"
                className="q-back"
                onClick={() => (showDetails ? setShowDetails(false) : null)}
                disabled={!showDetails}
                aria-label="חזור"
              >
                <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                  <path
                    d="M9 20H31M22 11L31 20L22 29"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {!showDetails ? (
                <>
                  <h2 className="q-title r-title">ציונך הסופי הוא:</h2>

                  <div className="r-gauge" style={{ "--p": `${percent}%` }}>
                    <span className="r-gauge-text">{percent}/100</span>
                  </div>

                  <p className="r-msg">
                    {perfect ? "כל הכבוד!" : "לא נורא, תרגול נוסף מוביל לשלמות"}
                  </p>

                  <div className="r-stats">
                    <div className="r-stat">
                      <span>שאלות שענית נכון: {correct}</span>
                      <span className="r-ok" aria-hidden="true">✓</span>
                    </div>
                    <div className="r-stat">
                      <span>שאלות שטעית: {wrong}</span>
                      <span className="r-bad" aria-hidden="true">✕</span>
                    </div>
                    <button type="button" className="r-link" onClick={() => setShowDetails(true)}>
                      לפירוט השאלות
                    </button>
                  </div>

                  <div className="r-actions">
                    <button
                      type="button"
                      className="q-btn"
                      disabled={!canPractice}
                      onClick={onPractice}
                    >
                      <span aria-hidden="true">→</span> לתרגול נוסף
                    </button>
                    <button
                      type="button"
                      className="q-btn"
                      disabled={!canContinue}
                      onClick={onContinue}
                    >
                      להמשך <span aria-hidden="true">←</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="q-title r-title">פירוט השאלות</h2>

                  <ul className="r-details">
                    {items.map((item) => (
                      <li key={item.id} className={`r-detail ${item.correct ? "ok" : "bad"}`}>
                        <span className={item.correct ? "r-ok" : "r-bad"} aria-hidden="true">
                          {item.correct ? "✓" : "✕"}
                        </span>
                        <div className="r-detail-body">
                          <div className="r-detail-q">{item.title}</div>
                          {!item.correct && (
                            <>
                              <div className="r-detail-a">
                                התשובה שלך: <b>{item.chosen}</b>
                              </div>
                              <div className="r-detail-a">
                                התשובה הנכונה: <b>{item.rightAns}</b>
                              </div>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="q-btn r-close"
                    onClick={() => setShowDetails(false)}
                  >
                    חזרה לציון
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}