
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import tillStickerStart from "../../assets/images/tillStickerStart.svg";
import bahad13StickerStart from "../../assets/images/bahad13StickerStart.svg";
import filesOpenPageBG from "../../assets/images/filesOpenPageBG.svg";
import titleEnd from "../../assets/images/endTitle.svg";
import startBtn from "../../assets/images/letstart.svg";
import backtoLomda from "../../assets/images/backtoLomda.svg";
import BGChapter1 from "../../assets/images/BGChapter1.svg";
import arrowIcon from "../../assets/images/arrowIcon.svg";
import "./End.css";

export default function End() {
     
      const navigate = useNavigate();
    const [playEntranceAnimations] = useState(() => {
      const key = "EndingPageAnimationsPlayed";
  
      if (sessionStorage.getItem(key) === "true") {
        return false;
      }    
      sessionStorage.setItem(key, "true");
      return true;
    });
    const onStart =()=>{
      navigate("/")
    }

      return (
        
        <div className="opening-page" dir="rtl">
          {/* רקע */}
          <img
            src={BGChapter1}
            className="opening-background"
            alt=""
            draggable={false}
            />
    
          {/* גוון כחול מעל הרקע */}
          <div className="opening-tint" aria-hidden="true" />
    
          {/* במה */}
          <main className="opening-stage">
            <img
              src={filesOpenPageBG}
              className="opening-papers"
              alt=""
              draggable={false}
              />
    
            {/* סטיקר מדור טי"ל */}
            <img
              src={tillStickerStart}
              className="opening-sticker opening-sticker-till"
              alt='מדור טי״ל'
              draggable={false}
              />
    
            {/* סטיקר בה"ד 13 */}
            <img
              src={bahad13StickerStart}
              className="opening-sticker opening-sticker-bahad"
              alt='בה״ד 13'
              draggable={false}
              />
    
            {/* כותרת */}
            <h1 className="opening-title">
              <img
                src={titleEnd}
                alt="לומדת טפסולוגיה נווה צדק"
                draggable={false}
                />
            </h1>
    
            {/* כפתור התחלה */}
            <button
              type="button"
              className="opening-image-button opening-start"
              onClick={onStart}
              aria-label="להתחלה "
              >
              <img src={startBtn} alt="" draggable={false} />
    
              {/* כיסוי החץ המקורי כדי להנפיש רק את החץ */}
              {/* <img src={arrowIcon} className="arrow-icon" aria-hidden="true" /> */}
    
              <span className="opening-start-arrow" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="opening-image-button opening-start"
              onClick={onStart}
              aria-label="סיום"
              >
              <img src={startBtn} alt="" draggable={false} />
    
              {/* כיסוי החץ המקורי כדי להנפיש רק את החץ */}
              {/* <img src={arrowIcon} className="arrow-icon" aria-hidden="true" /> */}
    
              <span className="opening-start-arrow" aria-hidden="true" />
            </button>
          </main>
        </div>
  );
}