import { useEffect, useRef } from "react";
import "./FormVeiwer.css";

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

export default function FormViewer({
  form,
  answers,
  onAnswerChange,
}) {
  const dialogRef = useRef(null);
  const scrollRef = useRef(null);
  const previousOverflow = useRef(null);

  function restoreScroll() {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  }

  function openForm() {
    const dialog = dialogRef.current;

    if (!dialog || dialog.open) return;

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    dialog.showModal();

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }

  function closeForm() {
    dialogRef.current?.close();
    restoreScroll();
  }

  useEffect(() => {
    return () => {
      if (previousOverflow.current !== null) {
        document.body.style.overflow = previousOverflow.current;
      }
    };
  }, []);

  return (
    <div className="training-form">
      <button
        type="button"
        className="training-form-preview"
        onClick={openForm}
        aria-label={`פתיחת ${form.title} למילוי`}
      >
        <img
          src={form.image}
          alt={form.title}
          width={form.width}
          height={form.height}
        />

        <span>לחצו להגדלה ולמילוי</span>
      </button>

      <dialog
        ref={dialogRef}
        className="training-form-dialog"
        aria-label={form.title}
        onClose={restoreScroll}
      >
        <div className="training-form-dialog-layout">
          <header className="training-form-header" dir="rtl">
            <strong>{form.title}</strong>

            <button
              type="button"
              onClick={closeForm}
              aria-label="סגירת הטופס"
              autoFocus
            >
              ✕
            </button>
          </header>

          <div
            ref={scrollRef}
            className="training-form-scroll"
          >
            <div
              className="training-form-page"
              style={{
                aspectRatio: `${form.width} / ${form.height}`,
              }}
            >
              <img
                className="training-form-image"
                src={form.image}
                alt={form.title}
                width={form.width}
                height={form.height}
                draggable="false"
              />

              {form.fields.map((field) => (
                <FormField
                  key={field.id}
                  formId={form.id}
                  field={field}
                  value={answers[field.id]}
                  onChange={(value) =>
                    onAnswerChange(field.id, value)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}