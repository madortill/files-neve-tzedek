import { useState } from "react";
import FormViewer from "../../FormViewer.jsx";
import { passForm } from "../../../../data/forms/PassForm1.js";
import { passApproveForm } from "../../../../assets/images/file-pass-approve.svg";

export default function PassScreen() {
  const [answers, setAnswers] = useState({});

  function updateAnswer(fieldId, value) {
    setAnswers((previous) => ({
      ...previous,
      [fieldId]: value,
    }));
  }

  return (
    <div>
      {/* כאן נשארים יתר התכנים של המסך שלך */}

      <FormViewer
        form={passForm}
        answers={answers}
        onAnswerChange={updateAnswer}
      />
    </div>
  );
}