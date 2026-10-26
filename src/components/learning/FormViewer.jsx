import { useEffect, useId, useRef, useState } from "react";
import "./FormVeiwer.css";
import large from "./../../assets/images/large.svg"
function FormField({ formId, field, value, onChange }) {
  const inputId = `${formId}-${field.id}`;

  const sharedProps = {
    id: inputId,
    name: inputId,
    "aria-label": field.label,
    title: field.label,
    className: "training-form-field",
    style: {
      left: `${field.position.left}%`,
      top: `${field.position.top}%`,
      width: `${field.position.width}%`,
      height: `${field.position.height}%`,
    },
  };

  if (field.type === "checkbox") {
    return (
      <input
        {...sharedProps}
        type="checkbox"
        checked={Boolean(value)}
        onChange={(event) => onChange(event.target.checked)}
      />
    );
  }

  if (field.type === "select") {
    return ( 
      <select
        {...sharedProps}
        dir="rtl"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">בחרו</option>

        {(field.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        {...sharedProps}
        dir="rtl"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <input
      {...sharedProps}
      type={field.type === "date" ? "date" : "text"}
      dir={field.type === "date" ? "ltr" : "rtl"}
      inputMode={field.inputMode}
      maxLength={field.maxLength}
      autoComplete="off"
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default function FormViewer(props) {
  return <FormViewerContent key={props.form.id} {...props} />;
}

function FormViewerContent({
  form,
  answers,
  onAnswerChange,
  onComplete,
  onContinue,
}) {
  const instanceId = useId();
  const [localAnswers, setLocalAnswers] = useState({});
  const [modal, setModal] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);

  const stageRef = useRef(null);
  const dialogRef = useRef(null);

  // עובד גם עם תשובות שמנוהלות בקומפוננטה חיצונית,
  // וגם כשהקומפוננטה מנהלת את התשובות בעצמה.
  const isControlled =
    answers !== undefined && typeof onAnswerChange === "function";

  const currentAnswers = isControlled ? answers : localAnswers;

  function updateAnswer(fieldId, value) {
    if (isControlled) {
      onAnswerChange(fieldId, value);
      return;
    }

    setLocalAnswers((previous) => ({
      ...previous,
      [fieldId]: value,
    }));
  }

  // התאמת הטופס לשטח הזמין, תוך שמירת יחס הממדים.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    function measure() {
      const width = Math.min(
        stage.clientWidth,
        window.innerWidth * 0.6,
        stage.clientHeight * (form.width / form.height)
      );

      setPageWidth(Math.max(0, width));
    }

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [form.width, form.height]);

  // חלון משותף להגדלה, לעזרה ולהודעת הסיום.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!modal || !dialog) return;

    const previousOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [modal]);

  function closeModal() {
    setModal(null);
  }

  function checkForm() {
    /*
      כאן נוסיף בהמשך:
      1. השוואה מול form.answerKey
      2. ספירת תשובות נכונות, שגויות וחסרות
      3. פתיחת הפופ־אפ רק כשהכול נכון

      כרגע: פתיחה ישירה לצורך בניית המסך.
    */
    setModal("success");
  }
function continueToNextChapter() {
  closeModal();
  onComplete?.();
  onContinue?.();
}
  function renderPage(version) {
    return (
      <div
        className="training-form-page"
        style={{
          aspectRatio: `${form.width} / ${form.height}`,
          ...(version === "initial"
            ? {
                width: `${pageWidth}px`,
                visibility: pageWidth > 0 ? "visible" : "hidden",
              }
            : {}),
        }}
      >
        <img
          className="training-form-image"
          src={form.image}
          alt={form.title}
          width={form.width}
          height={form.height}
          draggable={false}
        />

        {form.fields.map((field) => (
          <FormField
            key={field.id}
            formId={`${instanceId}-${form.id}-${version}`}
            field={field}
            value={currentAnswers[field.id]}
            onChange={(value) => updateAnswer(field.id, value)}
          />
        ))}
      </div>
    );
  }

  const modalTitle =
    modal === "help"
      ? "עזרה למילוי הטופס"
      : modal === "success"
        ? "הודעת סיום"
        : form.title;

  return (
    <section className="training-form-screen" dir="rtl">
      <header className="training-form-heading">
        <h2>{form.title}</h2>
        <p>מלאו את הפרטים בשדות המתאימים</p>
      </header>

      <div className="training-form-body">
        <div ref={stageRef} className="training-form-stage">
          <div className="training-form-entrance">
            {renderPage("initial")}
          </div>
        </div>

        <button
          type="button"
          className="training-form-enlarge"
          onClick={() => setModal("enlarged")}
          aria-haspopup="dialog"
        >
          <span aria-hidden="true">
            <img src={large} className="large-icon"></img>
          </span>
          לחצו כדי להגדיל את הטופס
        </button>

        <div className="training-form-help">
          <button
            type="button"
            className="training-form-help-button"
            aria-label="עזרה למילוי הטופס"
            aria-haspopup="dialog"
            onClick={() => setModal("help")}
          >
            ?
          </button>

          <span className="training-form-tooltip" aria-hidden="true">
            עזרה למילוי הטופס
          </span>
        </div>
      </div>

            <footer className="training-form-actions">
        <button
          type="button"
          className="training-form-check"
          onClick={checkForm}
        >
          בדיקת הטופס
        </button>
      </footer>

      <dialog
        ref={dialogRef}
        className={`training-form-dialog ${
          modal === "enlarged"
            ? "training-form-dialog-large"
            : "training-form-dialog-small"
        } ${
          modal === "success"
            ? "training-form-dialog-success"
            : ""
        }`}
        aria-label={modal === "success" ? "כל הכבוד!" : modalTitle}
        onCancel={(event) => {
          event.preventDefault();
          closeModal();
        }}
      >
        {modal && (
          <div className="training-form-dialog-layout">
            {modal !== "success" && (
              <header className="training-form-dialog-header">
                <strong>{modalTitle}</strong>

                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="סגירה"
                  autoFocus
                >
                  ✕
                </button>
              </header>
            )}

            {modal === "enlarged" && (
              <>
                <div className="training-form-scroll">
                  {renderPage("enlarged")}
                </div>

                <div className="training-form-modal-actions">
                  <button
                    type="button"
                    className="training-form-check"
                    onClick={checkForm}
                  >
                    בדיקת הטופס
                  </button>
                </div>
              </>
            )}

            {modal === "help" && (
              <div className="training-form-help-content">
                {form.helpText || "כאן יופיע הסבר למילוי הטופס."}
              </div>
            )}

            {modal === "success" && (
              <div className="training-form-success">
                <h2 className="training-form-success-title">
                  כל הכבוד!
                </h2>

                <p className="training-form-success-message">
                  מילאתם את אישור המעבר בהצלחה
                  <br />
                  והוצאתם את הכלוא מהפלוגה
                </p>

                <button
                  type="button"
                  className="training-form-success-confirm"
                  onClick={continueToNextChapter}
                  disabled={typeof onContinue !== "function"}
                  autoFocus
                >
                  הבנתי!
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}