// התאימי את נתיב הייבוא למיקום הקובץ.
import { TlunaForm } from "../../../../data/forms/TlunaForm.js";
import FormViewer from "../../FormViewer.jsx";



// export default function FormFillTluna({ onComplete, onContinue }) {
//     const [answers, setAnswers] = useState({});

//   function updateAnswer(fieldId, value) {
//     setAnswers((previous) => ({
//       ...previous,
//       [fieldId]: value,
//     }));
//   }

//   return (
//     <div>  
//   <FormViewer
//   form={TlunaForm}
//   answers={answers}
//   onAnswerChange={updateAnswer}
//   onComplete={onComplete}
//   onContinue={onContinue}
// />
//     </div>
//   );
// }

export default function FormFillTluna({
  answers,
  onAnswerChange,
  onContinue,
}) {
  return (
    <FormViewer
      form={TlunaForm}
      answers={answers}
      onAnswerChange={onAnswerChange}
      onContinue={onContinue}
    />
  );
}