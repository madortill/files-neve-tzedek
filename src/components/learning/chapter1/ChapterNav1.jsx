import { useCallback, useEffect, useState } from "react";
import TargetPage from "./targets/TargetPage.jsx";
import TheThreeStampPage from "./TheTreestampPage/TheThreeStampPage.jsx";
import FilePass from "./files1_2/filepass";
import PopUp from "./elements/PopUp";

import BGChapter1 from "../../../assets/images/BGChapter1.svg";
import tillLogo from "../../../assets/images/Till.svg";
import bahad13 from "../../../assets/images/bahad13.svg";

import "./ChapterNav.css";

const pages = [TargetPage, TheThreeStampPage, FilePass];
const STORAGE_KEY = "forms-course:chapter1";

function readSavedProgress() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));

    if (!saved || saved.version !== 1) return {};

    return saved;
  } catch {
    return {};
  }
}

function validCardIds(value) {
  const allowed = ["pass", "medical", "deposit"];

  return Array.isArray(value)
    ? [...new Set(value.filter((id) => allowed.includes(id)))]
    : [];
}
export default function ChapterNav({ onFinish, onBack }) {
  const [savedProgress] = useState(readSavedProgress);

const [pageIndex, setPageIndex] = useState(() => {
  const index = savedProgress.pageIndex;

  return Number.isInteger(index) && index >= 0 && index < pages.length
    ? index
    : 0;
});

const [completedPages, setCompletedPages] = useState(() => {
  const saved = savedProgress.completedPages;

  return Object.fromEntries(
    pages.map((_, index) => [index, saved?.[index] === true])
  );
});

const [showPopup, setShowPopup] = useState(false);

const [popupConfirmed, setPopupConfirmed] = useState(
  savedProgress.popupConfirmed === true
);

const [targetOpenCards, setTargetOpenCards] = useState(() =>
  validCardIds(savedProgress.targetOpenCards)
);

const [targetVisitedCards, setTargetVisitedCards] = useState(() =>
  validCardIds(savedProgress.targetVisitedCards)
);

useEffect(() => {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        pageIndex,
        completedPages,
        popupConfirmed,
        targetOpenCards,
        targetVisitedCards,
      })
    );
  } catch {
    // אם הדפדפן חוסם אחסון, הלומדה עדיין פועלת.
  }
}, [
  pageIndex,
  completedPages,
  popupConfirmed,
  targetOpenCards,
  targetVisitedCards,
]);
  const CurrentPage = pages[pageIndex];
  const isTargetPage = pageIndex === 0;
  const isCompleted = Boolean(completedPages[pageIndex]);
  const isLastPage = pageIndex === pages.length - 1;

  const handleComplete = useCallback(() => {
    setCompletedPages((previous) => {
      if (previous[pageIndex]) return previous;

      return {
        ...previous,
        [pageIndex]: true,
      };
    });
  }, [pageIndex]);

  function handleNext() {
    if (!isCompleted || showPopup) return;

    if (pageIndex === 1 && !popupConfirmed) {
      setShowPopup(true);
      return;
    }

    if (isLastPage) {
      onFinish?.();
      return;
    }

    setPageIndex((previous) => previous + 1);
  }

  function handleBack() {
    if (showPopup) return;

    if (pageIndex === 0) {
      onBack?.();
      return;
    }

    setPageIndex((previous) => previous - 1);
  }

  function handlePopupContinue() {
    setPopupConfirmed(true);
    setShowPopup(false);
    setPageIndex(2);
  }

  function handlePopupClose() {
    setShowPopup(false);
  }

  const backDisabled =
    showPopup || (pageIndex === 0 && typeof onBack !== "function");

  const nextDisabled =
    showPopup ||
    !isCompleted ||
    (isLastPage && typeof onFinish !== "function");

  return (
    <section
      className={`chapter-nav ${
        isTargetPage ? "chapter-nav--targets" : ""
      }`}
      dir="rtl"
    >
      <img
        src={BGChapter1}
        className="chapter-nav-background"
        alt=""
        draggable={false}
      />

      <div className="chapter-nav-tint" aria-hidden="true" />

      <div className="chapter-nav-layout">
        <div className="chapter-nav-logos">
          <img src={bahad13} alt='בה״ד 13' draggable={false} />
          <img src={tillLogo} alt='מדור טי״ל' draggable={false} />
        </div>

        <main className="chapter-nav-content">
       <CurrentPage
  key={pageIndex}
  onComplete={handleComplete}
  isCompleted={isCompleted}
  {...(isTargetPage
    ? {
        openCards: targetOpenCards,
        onOpenCardsChange: setTargetOpenCards,
        visitedCards: targetVisitedCards,
        onVisitedCardsChange: setTargetVisitedCards,
      }
    : {})}
/>
        </main>

        <nav className="chapter-nav-controls" aria-label="ניווט בפרק">
          <div className="chapter-nav-control">
            <button
              type="button"
              className="chapter-nav-button chapter-nav-back"
              onClick={handleBack}
              disabled={backDisabled}
              aria-label="חזור"
            >
              <Arrow direction="right" />
            </button>

            {isTargetPage && (
              <span className="chapter-nav-tooltip" aria-hidden="true">
                חזור
              </span>
            )}
          </div>

          <div className="chapter-nav-control">
            <button
              type="button"
              className="chapter-nav-button chapter-nav-next"
              onClick={handleNext}
              disabled={nextDisabled}
              aria-label={isLastPage ? "סיום הפרק והמשך" : "הבא"}
            >
              <Arrow direction="left" />
            </button>

            {isTargetPage && (
              <span className="chapter-nav-tooltip" aria-hidden="true">
                הבא
              </span>
            )}
          </div>
        </nav>
      </div>

      {showPopup && (
        <div className="chapter-nav-popup-layer">
          <PopUp
            onContinue={handlePopupContinue}
            onClose={handlePopupClose}
          />
        </div>
      )}
    </section>
  );
}

function Arrow({ direction }) {
  return (
    <svg
      viewBox="0 0 71 71"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M35.5 23.5L23.5 35.5L35.5 47.5M23.5 35.5H47.5"
        transform={
          direction === "right"
            ? "rotate(180 35.5 35.5)"
            : undefined
        }
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}