import { useEffect, useState } from "react";

import targetIcon from "../../../../assets/images/targetIcon.svg";
import folderIcon from "../../../../assets/images/folder.svg";

import "./TargetPage.css";

// כאן משנים את הכותרות ומדביקים את הטקסטים
const cards = [
  {
    id: "pass",
    title: "אישור מעבר",
    text: "נסביר מהו אישור מעבר וכיצד רושמים טופס תלונה ",
  },
  {
    id: "medical",
    title: "מסדר חולים ומסדר בעיות",
    text: "נלמד לציין מה ההבדל בין מסדר חולים למסדר בעיות",
  },
  {
    id: "deposit",
    title: "טופס בקשה והפקדה",
    text: "נפרט מהו טופס בקשה והפקדה ונסביר אותם",
  }
];

export default function TargetPage({
  onComplete,
  isCompleted = false,
  openCards = [],
  onOpenCardsChange,
  visitedCards = [],
  onVisitedCardsChange,
}) {
  useEffect(() => {
    const allVisited = cards.every((card) =>
      visitedCards.includes(card.id)
    );

    if (!isCompleted && allVisited) {
      onComplete?.();
    }
  }, [visitedCards, isCompleted, onComplete]);

  function toggleCard(id) {
    onOpenCardsChange?.((previous) =>
      previous.includes(id)
        ? previous.filter((cardId) => cardId !== id)
        : [...previous, id]
    );

    onVisitedCardsChange?.((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  }

  // כאן ממשיך ה-return הקיים שלך
  // כאן ממשיך ה-return הקיים שלך
  return (
    <div className="target-page" dir="rtl">
  <div className="target-page-main">
    <h1 className="target-page-title">
      נלמד על מספר סוגי טפסים:
    </h1>

      <div className="target-page-cards">
        {cards.map((card) => {
          const isOpen = openCards.includes(card.id);

          return (
            <section className="target-card" key={card.id}>
              <h2 className="target-card-heading">
                <button
                  id={`target-trigger-${card.id}`}
                  type="button"
                  className="target-card-trigger"
                  onClick={() => toggleCard(card.id)}
                  aria-expanded={isOpen}
                  aria-controls={`target-panel-${card.id}`}
                >
                  <img
                    className="target-card-icon"
                    src={targetIcon}
                    alt=""
                  />

                  <span className="target-card-label">
                    {card.title}
                  </span>

                  <svg
                    className={`target-card-chevron ${
                      isOpen ? "is-open" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12.5L10 7.5L15 12.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </h2>

                    <div
            id={`target-panel-${card.id}`}
            role="region"
            aria-labelledby={`target-trigger-${card.id}`}
            className={`target-card-panel ${isOpen ? "is-open" : ""}`}
            aria-hidden={!isOpen}
            inert={!isOpen}
            >
            <div className="target-card-panel-inner">
                <div className="target-card-panel-content">
                <p>{card.text}</p>
                </div>
            </div>
            </div>
            </section>
          );
        })}
      </div>
        </div>


        <div className="target-page-folder" aria-hidden="true">
    <img src={folderIcon} alt="" />
  </div>
</div>
  );
}