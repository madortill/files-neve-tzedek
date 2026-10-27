import "./FileAsking.css";

import FileAskingIMG from "../../../../assets/images/files/file-askinging.svg";

const FileAsking = ({ onNext }) => {
  return (
    <div className="file-asking">
      <img
        className="file-asking__img"
        src={FileAskingIMG}
        alt="טופס בקשה"
        draggable={false}
      />
      {onNext && (
        <button type="button" className="file-asking__continue" onClick={onNext}>
          המשך
        </button>
      )}
    </div>
  );
};

export default FileAsking;