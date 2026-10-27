import { useEffect, useRef, useState } from "react";
import "./FileTluna.css";

import prisoner from "../../../../assets/images/prisoner.svg";
import solider from "../../../../assets/images/solider.svg";
import bubbleText from "../../../../assets/images/bubbleText.svg";
import block from "../../../../assets/images/block.svg";

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
    // כאן תוסיפי את הטקסטים של הדו־שיח השני.
    prisoner: "אני רוצה להירשם המפקד",
    soldier: "כל חייל שרוצה לראות רופא או חובשת זה הזמן להירשם! בנוסף אם למישהו יש מענות, תלונות, בעיות שהוא רוצה להציף זה הזמן",
    button: "לצפייה בטופס",
  },
};

// function readProgress(key) {
//   try {
//     const saved = JSON.parse(sessionStorage.getItem(key));

//     return {
//       stage: saved?.stage === "note" ? "note" : "intro",
//       introSeen: saved?.introSeen === true,
//     };
//   } catch {
//     return { stage: "intro", introSeen: false };
//   }
// }

// export default function FileTluna(props) {
//   return (
//     <FileTlunaContent
//       key={props.dialogueNumber ?? 1}
//       {...props}
//     />
//   );
// }

// function FileTlunaContent({
//   dialogueNumber = 1,
//   onNext,
//   onOpenNotes,
// }) {
//   const storageKey = `forms-course:chapter2:dialogue:${dialogueNumber}`;
//   const content = DIALOGUES[dialogueNumber] ?? DIALOGUES[1];
//   const isSecondDialogue = dialogueNumber === 2;

//   const [saved] = useState(() => readProgress(storageKey));

//   const [stage, setStage] = useState(() =>
//     isSecondDialogue ? "intro" : saved.stage
//   );

//   const [progress, setProgress] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [isTurned, setIsTurned] = useState(false);

//   const boardRef = useRef(null);
//   const dragRef = useRef(null);
//   const progressRef = useRef(0);
//   const frameRef = useRef(null);
//   const timerRef = useRef(null);
//   const busyRef = useRef(false);
//   const suppressClickRef = useRef(false);
//   const onNextRef = useRef(onNext);

//   useEffect(() => {
//     onNextRef.current = onNext;
//   }, [onNext]);

//   useEffect(() => {
//     try {
//       sessionStorage.setItem(
//         storageKey,
//         JSON.stringify({
//           stage,
//           introSeen: true,
//         })
//       );
//     } catch {
//       // ממשיכים גם כשהאחסון חסום.
//     }
//   }, [storageKey, stage]);

//   useEffect(() => {
//     return () => {
//       cancelAnimationFrame(frameRef.current);
//       clearTimeout(timerRef.current);
//     };
//   }, []);

//   function updateProgress(value) {
//     const next = Math.max(0, Math.min(1, value));

//     progressRef.current = next;
//     setProgress(next);
//   }

//   function animateTo(target) {
//     if (busyRef.current) return;

//     busyRef.current = true;
//     setIsAnimating(true);

//     const from = progressRef.current;

//     const reducedMotion = window.matchMedia(
//       "(prefers-reduced-motion: reduce)"
//     ).matches;

//     const duration = reducedMotion
//       ? 1
//       : Math.max(220, Math.abs(target - from) * 850);

//     const startTime = performance.now();

//     function tick(now) {
//       const elapsed = Math.min(
//         1,
//         (now - startTime) / duration
//       );

//       const eased = 1 - Math.pow(1 - elapsed, 3);

//       updateProgress(from + (target - from) * eased);

//       if (elapsed < 1) {
//         frameRef.current = requestAnimationFrame(tick);
//         return;
//       }

//       setIsAnimating(false);

//       if (target === 1) {
//         setIsTurned(true);

//         // משאירים רגע לראות את מצב הדף המקופל,
//         // ורק אז עוברים לשאלות.
//         timerRef.current = window.setTimeout(() => {
//           onNextRef.current?.();
//         }, 450);
//       } else {
//         busyRef.current = false;
//       }
//     }

//     frameRef.current = requestAnimationFrame(tick);
//   }

//   function handlePointerDown(event) {
//     if (
//       busyRef.current ||
//       dragRef.current ||
//       event.button !== 0 ||
//       !event.isPrimary
//     ) {
//       return;
//     }

//     suppressClickRef.current = false;

//     dragRef.current = {
//       pointerId: event.pointerId,
//       startX: event.clientX,
//       startY: event.clientY,
//       moved: false,
//     };

//     event.currentTarget.setPointerCapture(event.pointerId);
//   }

//   function handlePointerMove(event) {
//     const drag = dragRef.current;

//     if (!drag || drag.pointerId !== event.pointerId) return;

//     const dx = event.clientX - drag.startX;
//     const dy = drag.startY - event.clientY;

//     if (!drag.moved && Math.hypot(dx, dy) < 7) return;

//     drag.moved = true;
//     setIsDragging(true);

//     const height =
//       boardRef.current?.getBoundingClientRect().height || 500;

//     // גרירה כלפי מעלה הופכת את הדף.
//     updateProgress(dy / (height * 0.65));
//   }

//   function handlePointerUp(event) {
//     const drag = dragRef.current;

//     if (!drag || drag.pointerId !== event.pointerId) return;

//     dragRef.current = null;
//     setIsDragging(false);

//     if (event.currentTarget.hasPointerCapture(event.pointerId)) {
//       event.currentTarget.releasePointerCapture(event.pointerId);
//     }

//     if (drag.moved) {
//       suppressClickRef.current = true;
//       animateTo(progressRef.current >= 0.35 ? 1 : 0);
//     }

//     // לחיצה קצרה ללא גרירה מטופלת ב־onClick.
//   }

//   function cancelDrag() {
//     if (!dragRef.current) return;

//     dragRef.current = null;
//     suppressClickRef.current = true;
//     setIsDragging(false);
//     animateTo(0);
//   }

//   function handleFlipClick(event) {
//     if (suppressClickRef.current && event.detail !== 0) {
//       suppressClickRef.current = false;
//       return;
//     }

//     if (!busyRef.current) animateTo(1);
//   }

//   function openBlock() {
//     if (isSecondDialogue) {
//       onOpenNotes?.(2);
//       return;
//     }

//     setStage("note");
//   }
// function handlePageContinue() {
//   // כאן נוסיף בהמשך את אנימציית מעבר הדף.
//   // לאחר סיום האנימציה נקרא ל־onNext.
//   onNext?.();
//   const endOpacity = Math.max(0, (progress - 0.78) / 0.22);
//   const startOpacity = 1 - endOpacity;

// }return (
//   <div
//     className={`ft ${saved.introSeen ? "ft--visited" : ""}`}
//     dir="rtl"
//   >
//     <div
//       className="ft__scene"
//       inert={stage === "note" ? true : undefined}
//     >
//       <img
//         className="ft__char ft__char--prisoner"
//         src={prisoner}
//         alt="כלוא"
//         draggable={false}
//       />

//       <img
//         className="ft__char ft__char--soldier"
//         src={solider}
//         alt="מפקד"
//         draggable={false}
//       />

//       {content.prisoner && (
//         <div className="ft__bubble ft__bubble--prisoner">
//           <img src={bubbleText} alt="" draggable={false} />
//           <span>{content.prisoner}</span>
//         </div>
//       )}

//       {content.soldier && (
//         <div className="ft__bubble ft__bubble--soldier">
//           <img src={bubbleText} alt="" draggable={false} />
//           <span>{content.soldier}</span>
//         </div>
//       )}

//       <button
//         type="button"
//         className="ft__hand-block"
//         onClick={openBlock}
//         aria-label={content.button}
//         disabled={
//           isSecondDialogue &&
//           typeof onOpenNotes !== "function"
//         }
//       >
//         <img src={block} alt="" draggable={false} />
//       </button>

//       <button
//         type="button"
//         className="ft__how"
//         onClick={openBlock}
//         disabled={
//           isSecondDialogue &&
//           typeof onOpenNotes !== "function"
//         }
//       >
//         {content.button}
//       </button>
//     </div>

//     {stage === "note" && (
//       <>
//         <div
//           className="ft__note-backdrop"
//           aria-hidden="true"
//         />

//         <div className="ft__note">
//           <div className="ft__board">
//             <img
//               className="ft__board-start"
//               src={blockStart}
//               alt=""
//               draggable={false}
//             />

//             {/* בהמשך אפשר להוסיף לדף הזה אנימציית מעבר */}
//             <div className="ft__sheet">
//               <div className="ft__paper-content">
//                 <h2>
//                   את טופס התלונה נרשום כאשר אחד הכלואים
//                   יעבור על הגדרת הנהלים של הפלוגה
//                 </h2>

//                 <p>
//                   בעזרת הטופס נשלול לחיילנו דברים כגון:
//                   שיחת טלפון, ביקורים, קנטינה וסיגריות.
//                 </p>

//                 <p>
//                   *ניתן להוסיף גם ימים בפועל באמצעות טופס זה
//                 </p>

//                 <p>
//                   תחילה נמלא את פרטי הכלוא, תאריך ומס’ הבס״כ
//                 </p>

//                 <p>לאחר מכן פרטים יבשים על האירוע:</p>

//                 <div className="ft__details">
//                   <span>
//                     <img src={dateIcon} alt="" />
//                     תאריך
//                   </span>

//                   <span>
//                     <img src={timeIcon} alt="" />
//                     שעה
//                   </span>

//                   <span>
//                     <img src={locationIcon} alt="" />
//                     מיקום
//                   </span>
//                 </div>

//                 <p>
//                   נסכם בכמה משפטים את האירוע ונסיים במשפט
//                 </p>

//                 <mark className="ft__mark">
//                   ״ובכך פגע חמורות במשמעת הפלוגה!״
//                 </mark>
//               </div>

//               <footer className="ft__paper-footer">
//                 <button
//                   type="button"
//                   className="ft__pull"
//                   onClick={handlePageContinue}
//                   disabled={typeof onNext !== "function"}
//                   aria-label="המשך למסך הבא"
//                   title="המשך למסך הבא"
//                 >
//                   <img
//                     src={arrowIcon}
//                     alt=""
//                     draggable={false}
//                   />
//                 </button>
//               </footer>
//             </div>
//           </div>
//         </div>
//       </>
//     )}
//   </div>
// );
// }

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

function FileTlunaContent({ dialogueNumber = 1, onNext }) {
  const storageKey = `forms-course:chapter2:dialogue:${dialogueNumber}`;
  const content = DIALOGUES[dialogueNumber] ?? DIALOGUES[1];
  const isSecondDialogue = dialogueNumber === 2;

  // האם כבר ראינו את הדו-שיח: אם כן, בלי אנימציית כניסה
  const [visited] = useState(() => readSeen(storageKey));

  const [stage, setStage] = useState("intro"); // intro | note
  const [progress, setProgress] = useState(0); // 0..1 הפיכת הדף
  const [flipping, setFlipping] = useState(false);

  const frameRef = useRef(null);
  const timerRef = useRef(null);
  const busyRef = useRef(false);
  const onNextRef = useRef(onNext);

  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ introSeen: true }));
    } catch {
      // ממשיכים גם כשהאחסון חסום.
    }
  }, [storageKey]);

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

  return (
    <div className={`ft ${visited ? "ft--visited" : ""}`} dir="rtl">
      <div className="ft__scene" inert={stage === "note" ? true : undefined}>
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

        <button type="button" className="ft__hand-block" onClick={openBlock} aria-label={content.button}>
          <img src={block} alt="" draggable={false} />
        </button>

        <button type="button" className="ft__how" onClick={openBlock}>
          {content.button}
        </button>
      </div>

      {stage === "note" && (
        <>
          <div className="ft__note-backdrop" aria-hidden="true" />

          <div className="ft__note">
            <div className="ft__board" style={boardVars}>
              <img className="ft__board-start" src={blockStart} alt="" draggable={false} />
              <img className="ft__board-end" src={blockEnd} alt="" draggable={false} />

              <div className="ft__sheet">
                <div className="ft__paper-content">
                  {isSecondDialogue ? (
                    <p>{/* TODO: כאן יופיעו שני הטפסים */}מסדר חולים ובעיות </p>
                  ) : (
                    <>
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
                    </>
                  )}
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