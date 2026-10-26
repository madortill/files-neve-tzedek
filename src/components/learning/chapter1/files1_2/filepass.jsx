import { useState } from "react";
import FormViewer from "../../FormViewer.jsx";
import { passForm } from "../../../../data/forms/PassForm1.js";
import folderIcon from "../../../../assets/images/folder.svg";

// import { passApproveForm } from "../../../../assets/images/file-pass-approve.svg";

export default function FilePass({ onComplete, onContinue }) {
    const [answers, setAnswers] = useState({});

  function updateAnswer(fieldId, value) {
    setAnswers((previous) => ({
      ...previous,
      [fieldId]: value,
    }));
  }

  return (
    <div>
     <div className="target-page-folder" aria-hidden="true">
    <img src={folderIcon} alt="" />
  </div>    
  <FormViewer
  form={passForm}
  answers={answers}
  onAnswerChange={updateAnswer}
  onComplete={onComplete}
  onContinue={onContinue}
/>
    </div>
  );
}