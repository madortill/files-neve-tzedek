// import { useEffect, useRef, useState } from "react";
// import "./FileTluna.css";

// import prisoner from "../../../../assets/images/prisoner.svg";
// import solider from "../../../../assets/images/solider.svg";
// import bubbleText from "../../../../assets/images/bubbleText.svg";
// import block from "../../../../assets/images/block.svg";

// import blockStart from "../../../../assets/images/bolockStart.png";
// import blockEnd from "../../../../assets/images/blockEnd.png";

// import locationIcon from "../../../../assets/images/location.svg";
// import dateIcon from "../../../../assets/images/date.svg";
// import timeIcon from "../../../../assets/images/time.svg";
// import arrowIcon from "../../../../assets/images/arrowFlip.svg";

// const DIALOGUES = {
//   1: {
//     soldier:
//       "אני ממלא עליך טופס תלונה על פגיעה במשמעת הפלוגה והפרת הסדר",
//     prisoner: "#!@$#$!!",
//     button: "איך נמלא?",
//   },

//   2: {
//     // כאן תוסיפי את הטקסטים של הדו־שיח השני.
//     prisoner: "אני רוצה להירשם המפקד",
//     soldier: "כל חייל שרוצה לראות רופא או חובשת זה הזמן להירשם! בנוסף אם למישהו יש מענות, תלונות, בעיות שהוא רוצה להציף זה הזמן",
//     button: "לצפייה בטופס",
//   },
// };

// function readSeen(key) {
//   try {
//     return JSON.parse(sessionStorage.getItem(key))?.introSeen === true;
//   } catch {
//     return false;
//   }
// }

// export default function FileTluna(props) {
//   return <FileTlunaContent key={props.dialogueNumber ?? 1} {...props} />;
// }

// const clamp01 = (v) => Math.max(0, Math.min(1, v));

// function FileTlunaContent({ dialogueNumber = 1, onNext }) {
//   const storageKey = `forms-course:chapter2:dialogue:${dialogueNumber}`;
//   const content = DIALOGUES[dialogueNumber] ?? DIALOGUES[1];
//   const isSecondDialogue = dialogueNumber === 2;

//   // האם כבר ראינו את הדו-שיח: אם כן, בלי אנימציית כניסה
//   const [visited] = useState(() => readSeen(storageKey));

//   const [stage, setStage] = useState("intro"); // intro | note
//   const [progress, setProgress] = useState(0); // 0..1 הפיכת הדף
//   const [flipping, setFlipping] = useState(false);

//   const frameRef = useRef(null);
//   const timerRef = useRef(null);
//   const busyRef = useRef(false);
//   const onNextRef = useRef(onNext);

//   useEffect(() => {
//     onNextRef.current = onNext;
//   }, [onNext]);

//   useEffect(() => {
//     try {
//       sessionStorage.setItem(storageKey, JSON.stringify({ introSeen: true }));
//     } catch {
//       // ממשיכים גם כשהאחסון חסום.
//     }
//   }, [storageKey]);

//   useEffect(() => {
//     return () => {
//       cancelAnimationFrame(frameRef.current);
//       clearTimeout(timerRef.current);
//     };
//   }, []);

//   function openBlock() {
//     setStage("note");
//   }

//   function flipPage() {
//     if (busyRef.current) return;
//     busyRef.current = true;
//     setFlipping(true);

//     const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     const duration = reduced ? 1 : 900;
//     const startTime = performance.now();

//     function tick(now) {
//       const t = Math.min(1, (now - startTime) / duration);
//       setProgress(1 - Math.pow(1 - t, 3));

//       if (t < 1) {
//         frameRef.current = requestAnimationFrame(tick);
//         return;
//       }
//       // רגע לראות את הדף ההפוך ואז מעבר
//       timerRef.current = window.setTimeout(() => onNextRef.current?.(), 350);
//     }
//     frameRef.current = requestAnimationFrame(tick);
//   }

//   // החלפה בין תמונת ההתחלה לתמונת הסיום לפי ההתקדמות
//   const endOpacity = clamp01((progress - 0.3) / 0.4);
//   const boardVars = {
//     "--p": progress,
//     "--start": 1 - endOpacity,
//     "--end": endOpacity,
//   };

//   return (
//     <div className={`ft ${visited ? "ft--visited" : ""}`} dir="rtl">
//       <div className="ft__scene" inert={stage === "note" ? true : undefined}>
//         <img className="ft__char ft__char--prisoner" src={prisoner} alt="כלוא" draggable={false} />
//         <img className="ft__char ft__char--soldier" src={solider} alt="מפקד" draggable={false} />

//         {content.prisoner && (
//           <div className="ft__bubble ft__bubble--prisoner">
//             <img className="bubble-tex" src={bubbleText} alt="" draggable={false} />
//             <span>{content.prisoner}</span>
//           </div>
//         )}

//         {content.soldier && (
//           <div className="ft__bubble ft__bubble--soldier">
//             <img src={bubbleText} alt="" draggable={false} />
//             <span>{content.soldier}</span>
//           </div>
//         )}

//         <button type="button" className="ft__hand-block" onClick={openBlock} aria-label={content.button}>
//           <img src={block} alt="" draggable={false} />
//         </button>

//         <button type="button" className="ft__how" onClick={openBlock}>
//           {content.button}
//         </button>
//       </div>

//       {stage === "note" && (
//         <>
//           <div className="ft__note-backdrop" aria-hidden="true" />

//           <div className="ft__note">
//             <div className="ft__board" style={boardVars}>
//               <img className="ft__board-start" src={blockStart} alt="" draggable={false} />
//               <img className="ft__board-end" src={blockEnd} alt="" draggable={false} />

//               <div className="ft__sheet">
//                 <div className="ft__paper-content">
//                   {isSecondDialogue ? (
//                     <p>{/* TODO: כאן יופיעו שני הטפסים */}מסדר חולים ובעיות </p>
//                   ) : (
//                     <>
//                       <h2>את טופס התלונה נרשום כאשר אחד הכלואים יעבור על הגדרת הנהלים של הפלוגה</h2>
//                       <p>בעזרת הטופס נשלול לחיילנו דברים כגון: שיחת טלפון, ביקורים, קנטינה וסיגריות.</p>
//                       <p>*ניתן להוסיף גם ימים בפועל באמצעות טופס זה</p>
//                       <p>תחילה נמלא את פרטי הכלוא, תאריך ומס’ הבס״כ</p>
//                       <p>לאחר מכן פרטים יבשים על האירוע:</p>
//                       <div className="ft__details">
//                         <span><img src={dateIcon} alt="" />תאריך</span>
//                         <span><img src={timeIcon} alt="" />שעה</span>
//                         <span><img src={locationIcon} alt="" />מיקום</span>
//                       </div>
//                       <p>נסכם בכמה משפטים את האירוע ונסיים במשפט</p>
//                       <mark className="ft__mark">״ובכך פגע חמורות במשמעת הפלוגה!״</mark>
//                     </>
//                   )}
//                 </div>

//                 <footer className="ft__paper-footer">
//                   <button
//                     type="button"
//                     className="ft__pull"
//                     onClick={flipPage}
//                     disabled={flipping || typeof onNext !== "function"}
//                     aria-label="המשך למסך הבא"
//                     title="המשך למסך הבא"
//                   >
//                     <img src={arrowIcon} alt="" draggable={false} />
//                   </button>
//                 </footer>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
import { useEffect, useRef, useState } from "react";
import "./FileTluna.css";

import prisoner from "../../../../assets/images/prisoner.svg";
import solider from "../../../../assets/images/solider.svg";
import bubbleText from "../../../../assets/images/bubbleText.svg";
import block from "../../../../assets/images/block.svg";
import outBg from "../../../../assets/images/out.svg";
import sidePoster from "../../../../assets/images/sidePoster.svg";

import blockStart from "../../../../assets/images/bolockStart.png";
import blockEnd from "../../../../assets/images/blockEnd.png";

import locationIcon from "../../../../assets/images/location.svg";
import dateIcon from "../../../../assets/images/date.svg";
import timeIcon from "../../../../assets/images/time.svg";
import arrowIcon from "../../../../assets/images/arrowFlip.svg";

const DIALOGUES = {
  1: {
    soldier:
      "אני ממלא עליך טופס תלונה על פגיעה במשמעת הפלוגה והפרת הסדר",
    prisoner: "#!@$#$!!",
    button: "איך נמלא?",
  },

  2: {
    prisoner: "אני רוצה להירשם המפקד",
    soldier:
      "חייל שרוצה לראות רופא / חובשת זה הזמן להירשם! ואם למישהו יש מענות, תלונות, בעיות שהוא רוצה להציף זה הזמן",
  },
};

// הבועות מסיימות להופיע אחרי כ-1200ms, והפוסטר מתחיל להבהב מיד אחרי
const POSTER_DELAY_MS = 1400;

function readSeen(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key))?.introSeen === true;
  } catch {
    return false;
  }
}

export default function FileTluna(props) {
  return <FileTlunaContent key={props.dialogueNumber ?? 1} {...props} />;
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));

/*
  still: משתמשים בסצנה רק כרקע (למשל מאחורי הטפסים).
  בלי אנימציות כניסה, בלי הבהוב ובלי אפשרות ללחוץ על הפוסטר.
*/
function FileTlunaContent({ dialogueNumber = 1, onNext, still = false }) {
  const storageKey = `forms-course:chapter2:dialogue:${dialogueNumber}`;
  const content = DIALOGUES[dialogueNumber] ?? DIALOGUES[1];
  const isSecondDialogue = dialogueNumber === 2;

  // האם כבר ראינו את הדו-שיח: אם כן, בלי אנימציית כניסה
  const [visited] = useState(() => still || readSeen(storageKey));

  const [stage, setStage] = useState("intro"); // intro | note
  const [progress, setProgress] = useState(0); // 0..1 הפיכת הדף
  const [flipping, setFlipping] = useState(false);
  const [posterReady, setPosterReady] = useState(visited);

  const frameRef = useRef(null);
  const timerRef = useRef(null);
  const busyRef = useRef(false);
  const onNextRef = useRef(onNext);

  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  useEffect(() => {
    if (still) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ introSeen: true }));
    } catch {
      // ממשיכים גם כשהאחסון חסום.
    }
  }, [storageKey, still]);

  // הפוסטר מתחיל להבהב רק אחרי שהדיאלוג הסתיים
  useEffect(() => {
    if (!isSecondDialogue || still || posterReady) return;
    const id = window.setTimeout(() => setPosterReady(true), POSTER_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [isSecondDialogue, still, posterReady]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(timerRef.current);
    };
  }, []);

  function openBlock() {
    setStage("note");
  }

  function flipPage() {
    if (busyRef.current) return;
    busyRef.current = true;
    setFlipping(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 1 : 900;
    const startTime = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - startTime) / duration);
      setProgress(1 - Math.pow(1 - t, 3));

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      // רגע לראות את הדף ההפוך ואז מעבר
      timerRef.current = window.setTimeout(() => onNextRef.current?.(), 350);
    }
    frameRef.current = requestAnimationFrame(tick);
  }

  // החלפה בין תמונת ההתחלה לתמונת הסיום לפי ההתקדמות
  const endOpacity = clamp01((progress - 0.3) / 0.4);
  const boardVars = {
    "--p": progress,
    "--start": 1 - endOpacity,
    "--end": endOpacity,
  };

  const posterDisabled = still || !posterReady || typeof onNext !== "function";

  return (
    <div className={`ft ${visited ? "ft--visited" : ""}`} dir="rtl">
      <div className="ft__scene" inert={stage === "note" ? true : undefined}>
        {/* הבמה: כל מה שבתוכה ממוקם באחוזים מהרקע, ולכן לא זז ביחס אליו */}
        <div className="ft__stage">
          <img className="ft__bg" src={outBg} alt="" draggable={false} />

          {isSecondDialogue && (
            <button
              type="button"
              className={`ft__poster ${
                posterReady && !still ? "ft__poster--glow" : ""
              }`}
              onClick={() => onNext?.()}
              disabled={posterDisabled}
              tabIndex={still ? -1 : undefined}
              aria-label="מסדר חולים ומסדר בעיות - לצפייה בטפסים"
            >
              <img src={sidePoster} alt="" draggable={false} />
              <span className="ft__poster-text">
                <span>מסדר חולים</span>
                <span>מסדר בעיות</span>
              </span>
            </button>
          )}

          <img className="ft__char ft__char--prisoner" src={prisoner} alt="כלוא" draggable={false} />
          <img className="ft__char ft__char--soldier" src={solider} alt="מפקד" draggable={false} />

          {content.prisoner && (
            <div className="ft__bubble ft__bubble--prisoner">
              <img className="bubble-tex" src={bubbleText} alt="" draggable={false} />
              <span>{content.prisoner}</span>
            </div>
          )}

          {content.soldier && (
            <div className="ft__bubble ft__bubble--soldier">
              <img src={bubbleText} alt="" draggable={false} />
              <span>{content.soldier}</span>
            </div>
          )}

          {isSecondDialogue ? (
            <img className="ft__hand-block" src={block} alt="" draggable={false} />
          ) : (
            <button type="button" className="ft__hand-block" onClick={openBlock} aria-label={content.button}>
              <img src={block} alt="" draggable={false} />
            </button>
          )}
        </div>

        {!isSecondDialogue && (
          <button type="button" className="ft__how" onClick={openBlock}>
            {content.button}
          </button>
        )}
      </div>

      {stage === "note" && !isSecondDialogue && (
        <>
          <div className="ft__note-backdrop" aria-hidden="true" />

          <div className="ft__note">
            <div className="ft__board" style={boardVars}>
              <img className="ft__board-start" src={blockStart} alt="" draggable={false} />
              <img className="ft__board-end" src={blockEnd} alt="" draggable={false} />

              <div className="ft__sheet">
                <div className="ft__paper-content">
                  <h2>את טופס התלונה נרשום כאשר אחד הכלואים יעבור על הגדרת הנהלים של הפלוגה</h2>
                  <p>בעזרת הטופס נשלול לחיילנו דברים כגון: שיחת טלפון, ביקורים, קנטינה וסיגריות.</p>
                  <p>*ניתן להוסיף גם ימים בפועל באמצעות טופס זה</p>
                  <p>תחילה נמלא את פרטי הכלוא, תאריך ומס’ הבס״כ</p>
                  <p>לאחר מכן פרטים יבשים על האירוע:</p>
                  <div className="ft__details">
                    <span><img src={dateIcon} alt="" />תאריך</span>
                    <span><img src={timeIcon} alt="" />שעה</span>
                    <span><img src={locationIcon} alt="" />מיקום</span>
                  </div>
                  <p>נסכם בכמה משפטים את האירוע ונסיים במשפט</p>
                  <mark className="ft__mark">״ובכך פגע חמורות במשמעת הפלוגה!״</mark>
                </div>

                <footer className="ft__paper-footer">
                  <button
                    type="button"
                    className="ft__pull"
                    onClick={flipPage}
                    disabled={flipping || typeof onNext !== "function"}
                    aria-label="המשך למסך הבא"
                    title="המשך למסך הבא"
                  >
                    <img src={arrowIcon} alt="" draggable={false} />
                  </button>
                </footer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}