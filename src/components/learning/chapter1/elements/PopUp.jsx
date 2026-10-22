export default function PopUp({ onContinue, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {/* העיצוב והתוכן הקיימים שלך */}

        <button type="button" onClick={onClose}>
          סגירה
        </button>

        <button type="button" onClick={onContinue}>
          הבנתי, ממשיכים
        </button>
      </div>
    </div>
  );
}