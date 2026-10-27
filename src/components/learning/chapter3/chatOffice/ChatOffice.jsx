import "./ChatOffice.css";

import flatFile from "../../../../assets/images/fileOnDeskFlat.svg";
import officBG from "../../../../assets/images/officeBG.svg";

const TEXT_1 = [
  "טופס הבקשה הינו טופס שהכלואים מגישים בכל פעם שהם מעוניינים לבקש משהו מהסגל הבכיר.",
  "אתם בתור מפקדים תעזרו לחיילים שלכם לכתוב את טפסי הבקשה!",
  "את טפסי הבקשה ניתן להגיש בכל מיני נושאים כגון: קב”ן, שיחה עם איש קשר בכיר, חופשה מוצמדת, תורנות ועוד....",
];

const TEXT_BOLD = "איך נמלא?";
const TEXT_2 = [
  "יש לרשום בצורה מסודרת: אל מי מגישים את הטופס (מ”פ, מב”ס, אלוף פיקוד..), דרך המפקדים ואת פרטיו.",
  "החייל יכתוב “כותרת” לבקשתו וימלא את פרטי הכליאה שלו.",
  "החייל יפרט את בקשתו באופן ברור ומפורט ולבסוף יכתוב “בהצדעה ובדום מתוח!”",
];

/**
 * dialogueNumber:
 *  1 - טקסט ראשון
 *  2 - "איך נמלא?"
 *  3 - החלונית יורדת, נשאר נייר זוהר שאפשר ללחוץ עליו
 */
const ChatOffice = ({ dialogueNumber = 1, onNext }) => {
  const isDesk = dialogueNumber === 3;
  const showSecond = dialogueNumber >= 2; // ב-3 נשאר הטקסט השני בזמן שהחלונית יורדת

  function handlePanelKey(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onNext?.();
    }
  }

  return (
    <div className="chat-office">
        <div className="blur">

      <div className="chat-office__stage">
        <img className="chat-office__bg" src={officBG} alt="" draggable={false} />

        <button
          type="button"
          className={`chat-office__paper ${isDesk ? "is-active" : ""}`}
          onClick={isDesk ? onNext : undefined}
          disabled={!isDesk}
          tabIndex={isDesk ? 0 : -1}
          aria-label="פתיחת טופס הבקשה"
          >
          <img src={flatFile} alt="" draggable={false} />
        </button>

        <div
          className={`chat-office__panel ${isDesk ? "is-hidden" : ""}`}
          role="button"
          tabIndex={isDesk ? -1 : 0}
          aria-hidden={isDesk}
          aria-label="המשך"
          onClick={isDesk ? undefined : onNext}
          onKeyDown={isDesk ? undefined : handlePanelKey}
          >
          <div className="chat-office__text" key={showSecond ? "second" : "first"}>
            {showSecond ? (
                <>
                <p>
                  <strong>{TEXT_BOLD}</strong> {TEXT_2[0]}
                </p>
                <p>{TEXT_2[1]}</p>
                <p>{TEXT_2[2]}</p>
              </>
            ) : (
                TEXT_1.map((line) => <p key={line}>{line}</p>)
            )}
          </div>
        </div>
            </div>
      </div>
    </div>
  );
};

export default ChatOffice;