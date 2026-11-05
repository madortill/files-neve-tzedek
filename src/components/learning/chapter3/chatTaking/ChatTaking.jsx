import { useEffect, useState } from "react";
import "./ChatTaking.css";

import explainBG from "../../../../assets/images/explainBG.svg"; // screen2
import yellimgBG from "../../../../assets/images/yellimgBG.svg"; // screen1
import scissors from "../../../../assets/images/scissors.svg";
import notebook from "../../../../assets/images/notebook.svg";

const textscreen1 = "החפץ הזה לא אמור להימצא עליך";
const textscreen2 = "אני ממלא עליך טופס החרמה, תוכל לצרף אותו כנספח לפיקדון.";

const textnotbook = `טופס זה נועד במקרים בהם מוצאים על חייל פריט או חפץ שאסור להימצא עליו.
כמוצאים פריט מסוג זה בחיפוש, לוקחים מספר אישי ושם מלא מהחייל כדי לזכור למלא את זה בטופס.
מכניסים למערכת כחול אדום את מספר שקיות הפיקדון (גדול וקטן)

לאחר שממלאים את הטופס ומביאים ולקבלה ומפקידים, מקבלים את הטופס`;
const lastword = "מוחתם";

// הטקסט שמופיע על הדף התחתון אחרי הגזירה (לפי העיצוב)
const textCut = `את החלק התחתון גודרים ומביאים לחייל, שיצרף כנספח לטופס הפיקדון שלו והשאר מביאים למ"פ שיתייק`;

const NOTEBOOK_LINES = textnotbook.split("\n");

/**
 * stage: 1 = דיבור ראשון | 2 = דיבור שני | 3 = מחברת + גזירה
 * onComplete: נקרא כשהגזירה הסתיימה (אפשר להשתמש בו כדי לפתוח את החץ הבא)
 *
 * הקומפוננטה נשארת מורכבת באותו מקום בין השלבים, לכן המעברים
 * (רקע, בועה, ירידת המחברת) מונפשים ב-CSS ולא "קופצים".
 */
const ChatTaking = ({ stage = 1, onComplete }) => {
  const [cutState, setCutState] = useState("idle"); // idle | cutting | cut

  // חזרה אחורה מהמחברת – מאפסים את הגזירה
  useEffect(() => {
    if (stage !== 3) setCutState("idle");
  }, [stage]);  

  function startCut() {
    if (cutState !== "idle") return;
    setCutState("cutting");
  }

  function handleScissorsEnd(e) {
    // סיום תנועת המספריים (ימין -> שמאל) => הדף נחתך
    if (e.propertyName !== "left" || cutState !== "cutting") return;
    setCutState("cut");
    onComplete?.();
  }

  const lastIndex = NOTEBOOK_LINES.length - 1;

  return (
    <div className={`ct ct--stage${stage}`}>
      {/* רקעים */}
      <img className="ct-bg ct-bg--1" src={yellimgBG} alt="" draggable={false} />
      <img className="ct-bg ct-bg--2" src={explainBG} alt="" draggable={false} />

      {/* בועת דיבור – key גורם לאנימציית הופעה בכל החלפת טקסט */}
      {stage < 3 && (
        <div className="ct-bubble" key={stage} role="status">
          {stage === 1 ? textscreen1 : textscreen2}
        </div>
      )}

      {/* מחברת */}
      <div className={`ct-notebook ct-notebook--${cutState}`}>
        {/* חלק עליון */}
        <div className="ct-piece ct-piece--top">
          <img src={notebook} alt="" draggable={false} />
          <div className="ct-text ct-text--top">
            {NOTEBOOK_LINES.map((line, i) => (
              <p key={i}>
                {line || "\u00A0"}
                {i === lastIndex && <span className="ct-sign">{lastword}</span>}
              </p>
            ))}
          </div>
          <div
            className="ct-dash"
            style={{ opacity: cutState === "cut" ? 0.6 : 1 }}
          />
        </div>

        {/* חלק תחתון (אותה תמונה, חתוכה מהקו ומטה) */}
        <div className="ct-piece ct-piece--bottom" aria-hidden={cutState !== "cut"}>
          <img src={notebook} alt="" draggable={false} />
          <div className="ct-text ct-text--bottom">
            <p>{textCut}</p>
          </div>
        </div>

        {/* מספריים על הקו המקווקו */}
        <button
          type="button"
          className="ct-scissors"
          onClick={startCut}
          onTransitionEnd={handleScissorsEnd}
          aria-label="גזור את הטופס"
          disabled={cutState !== "idle"}
        >
          <img src={scissors} alt="" draggable={false} />
        </button>
      </div>
    </div>
  );
};

export default ChatTaking;