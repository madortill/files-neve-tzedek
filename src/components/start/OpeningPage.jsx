import { useRef} from "react";

import tillStickerStart from "../../assets/images/tillStickerStart.svg";
import bahad13StickerStart from "../../assets/images/bahad13StickerStart.svg";
import filesOpenPageBG from "../../assets/images/filesOpenPageBG.svg";
import titleStart from "../../assets/images/titleStart.svg";
import startBtn from "../../assets/images/letstart.svg";
import about from "../../assets/images/about.svg";
import BGChapter1 from "../../assets/images/BGChapter1.svg";
import reut from "../../assets/images/reut.svg";

import "./OpeningPage.css";
import { useNavigate } from "react-router-dom";

const aboutDetails = [
  { title: "גרפיקה:", text: "רבט דינה ליפשיץ" },
  { title: "מומחי תוכן:", text: "סגם מאיה אסידו" },
  { title: 'רמ״ד טי״ל:', text: "סמר קטיה מדבדב" },
  { title: "גרסה:", text: "אוקטובר 2026" },
];

export default function OpeningPage({ onStart}) {
  const aboutDialogRef = useRef(null);
    const navigate=useNavigate();
  function openAbout() {
    aboutDialogRef.current?.showModal();
  }

  function closeAbout() {
    aboutDialogRef.current?.close();
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeAbout();
    }
  }

  return (
    <div className="opening-page" dir="rtl">
      {/* שכבה ראשונה — הרקע המשרדי */}
      <img
        src={BGChapter1}
        className="opening-background"
        alt=""
        draggable={false}
      />

      {/* שכבה שנייה — גוון כחול מעל הרקע בלבד */}
      <div className="opening-tint" aria-hidden="true" />

      {/* כל האלמנטים נמדדים ביחס לאותה במה */}
      <main className="opening-stage">
        <img
          src={filesOpenPageBG}
          className="opening-papers"
          alt=""
          draggable={false}
        />

        <img
          src={tillStickerStart}
          className="opening-sticker opening-sticker-till"
          alt='מדור טי״ל'
          draggable={false}
        />

        <img
          src={bahad13StickerStart}
          className="opening-sticker opening-sticker-bahad"
          alt='בה״ד 13'
          draggable={false}
        />

        <h1 className="opening-title">
          <img
            src={titleStart}
            alt="לומדת טפסולוגיה נווה צדק"
            draggable={false}
          />
        </h1>

        <button
          type="button"
          className="opening-image-button opening-start"
          onClick={onStart}
          aria-label="בואו נתחיל"
        >
          <img src={startBtn} alt="" draggable={false} />
        </button>
      </main>

      <button
        type="button"
        className="opening-image-button opening-about"
        onClick={openAbout}
        aria-label="אודות"
        aria-haspopup="dialog"
      >
        <img src={about} alt="" draggable={false} />
      </button>

      <dialog
        ref={aboutDialogRef}
        className="opening-about-dialog"
        aria-labelledby="opening-about-heading"
        onClick={handleBackdropClick}
      >
        <div className="opening-about-card" dir="rtl">
          <button
            type="button"
            className="opening-about-close"
            onClick={closeAbout}
            aria-label="סגירת אודות"
            autoFocus
          >
            ×
          </button>

          <h2 id="opening-about-heading">מפתחת ראשית:</h2>

            <img
              src={reut}
              className="opening-about-character"
              alt="reut"
              draggable={false}
            />
          

          <p>רב"ט רעות מנה</p>

          {aboutDetails.map(({ title, text }) => (
            <div className="opening-about-detail" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}

          <p className="opening-about-handwriting">
            {`בלומדה יש שימוש בכתב ידה של סרן עדן נימרי ז”ל, שנפלה בקרב גבורה ב-7.10 תוך הגנה על החיילות שלה והצלתן.
https://edennimri.co.il/`}
          </p>
        </div>
      </dialog>
    </div>
  );
}