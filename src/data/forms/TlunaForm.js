
import fileTluna from "./../../assets/images/files/file-panishment.svg"
import successPopup from "../../assets/images/popup.svg";


import filePunishment from "../../assets/images/files/file-panishment.svg";

const PAGE_WIDTH = 1735;
const PAGE_HEIGHT = 2792;

function field(id, label, x, y, width, height, extra = {}) {
  return {
    id,
    label,
    type: "text",

    position: {
      left: (x / PAGE_WIDTH) * 100,
      top: (y / PAGE_HEIGHT) * 100,
      width: (width / PAGE_WIDTH) * 100,
      height: (height / PAGE_HEIGHT) * 100,
    },

    validation: null,

    ...extra,
  };
}

export const TlunaForm = {
  id: "disciplinaryMeasures",
  title: 'דו״ח הטלת אמצעים משמעתיים',
  image: filePunishment,
  width: PAGE_WIDTH,
  height: PAGE_HEIGHT,
  successImage: successPopup,

  successMessage: "מילאתם את טופס הטלת האמצעים המשמעתיים בהצלחה",

  helpText:
    "מלאו את השדות בטופס בהתאם לפרטי התרגיל. ניתן להגדיל את הטופס באמצעות כפתור ההגדלה.",

  // בשלב זה לא מתבצעת בדיקת תשובות.
  answerKey: null,

  fields: [
    // תאריך הגשת הדיווח
    field(
      "reportDate",
      "תאריך הגשת הדיווח",
      1064, 153, 236, 47
    ),

    // א. פרטי הכלוא — מימין לשמאל
    field(
      "detaineePersonalNumber",
      "מספר אישי של הכלוא",
      1351, 338, 292, 60,
      { inputMode: "numeric" }
    ),
    field(
      "detaineeLastName",
      "שם משפחה של הכלוא",
      1045, 337, 292, 60
    ),
    field(
      "detaineeFirstName",
      "שם פרטי של הכלוא",
      741, 335, 291, 61
    ),
    field(
      "detaineeType",
      "סוג כלוא",
      437, 334, 289, 61
    ),
    field(
      "detaineeCompany",
      "פלוגה",
      132, 332, 289, 61
    ),

    // פרטי האירוע
    field(
      "incidentDate",
      "תאריך האירוע",
      1146, 543, 268, 47
    ),
    field(
      "incidentTime",
      "שעת האירוע",
      899, 543, 132, 47
    ),
    field(
      "incidentLocation",
      "מקום האירוע",
      506, 541, 245, 47
    ),

    // תיאור העבירה — שדה לכל שורה מודפסת
    field(
      "incidentDescriptionLine1",
      "תיאור העבירה — שורה ראשונה",
      95, 698, 938, 42
    ),
    field(
      "incidentDescriptionLine2",
      "תיאור העבירה — שורה שנייה",
      95, 753, 1496, 42
    ),
    field(
      "incidentDescriptionLine3",
      "תיאור העבירה — שורה שלישית",
      95, 807, 1496, 42
    ),

    // פרטי המתלונן
    field(
      "complainantPersonalNumber",
      "מספר אישי של המתלונן",
      1155, 982, 263, 60,
      { inputMode: "numeric" }
    ),
    field(
      "complainantRank",
      "דרגת המתלונן",
      1001, 982, 138, 60
    ),
    field(
      "complainantLastName",
      "שם משפחה של המתלונן",
      708, 982, 281, 60
    ),
    field(
      "complainantFirstName",
      "שם פרטי של המתלונן",
      507, 982, 186, 60
    ),
    field(
      "complainantCorps",
      "חיל המתלונן",
      341, 982, 152, 60
    ),
    field(
      "complainantSignature",
      "חתימת המתלונן — הקלדת שם",
      118, 982, 207, 60
    ),

    // פרטי העד — שורת העדים בטבלה
    field(
      "witnessPersonalNumber",
      "מספר אישי של העד",
      1155, 1057, 263, 60,
      { inputMode: "numeric" }
    ),
    field(
      "witnessRank",
      "דרגת העד",
      1001, 1057, 138, 60
    ),
    field(
      "witnessLastName",
      "שם משפחה של העד",
      708, 1057, 281, 60
    ),
    field(
      "witnessFirstName",
      "שם פרטי של העד",
      507, 1057, 186, 60
    ),
    field(
      "witnessCorps",
      "חיל העד",
      341, 1057, 152, 60
    ),
    field(
      "witnessSignature",
      "חתימת העד — הקלדת שם",
      118, 1057, 207, 60
    ),

    // ב. בירור העובדות
    field(
      "inquiryDate",
      "תאריך בירור העובדות",
      68, 1171, 792, 43
    ),

    // דברי הכלוא
    field(
      "detaineeStatementLine1",
      "דברי הכלוא — שורה ראשונה",
      70, 1223, 1260, 43
    ),
    field(
      "detaineeStatementLine2",
      "דברי הכלוא — שורה שנייה",
      70, 1284, 1478, 38
    ),
    field(
      "detaineeStatementLine3",
      "דברי הכלוא — שורה שלישית",
      70, 1333, 1478, 38
    ),
    field(
      "detaineeStatementLine4",
      "דברי הכלוא — שורה רביעית",
      70, 1377, 1478, 38
    ),
    field(
      "detaineeStatementLine5",
      "דברי הכלוא — שורה חמישית",
      70, 1420, 1478, 38
    ),

    // דברי העד / העדים
    field(
      "witnessStatementLine1",
      "דברי העדים — שורה ראשונה",
      65, 1630, 1515, 54
    ),
    field(
      "witnessStatementLine2",
      "דברי העדים — שורה שנייה",
      68, 1703, 1507, 47
    ),

    // ג. ההחלטה
    field(
      "disciplinaryMeasures",
      "פירוט האמצעים המשמעתיים",
      68, 1961, 1493, 77
    ),

    // פרטי הקצין וחתימתו
    field(
      "officerPersonalNumber",
      "מספר אישי של הקצין",
      1144, 2145, 213, 58,
      { inputMode: "numeric" }
    ),
    field(
      "officerRank",
      "דרגת הקצין",
      955, 2145, 177, 58
    ),
    field(
      "officerFullName",
      "שם פרטי ושם משפחה של הקצין",
      620, 2145, 324, 58
    ),
    field(
      "officerRole",
      "תפקיד הקצין",
      361, 2145, 246, 58
    ),
    field(
      "officerSignature",
      "חתימת הקצין — הקלדת שם",
      86, 2145, 263, 58
    ),

    // טבלת רישום וביצוע — ההחלטה בוצעה
    field(
      "executionDate",
      "תאריך ביצוע ההחלטה",
      614, 2475, 519, 51
    ),
    field(
      "executionSignature",
      "חתימה על ביצוע ההחלטה",
      79, 2475, 519, 51
    ),

    // נרשמה בגיליון המשמעתי
    field(
      "disciplinaryRecordDate",
      "תאריך הרישום בגיליון המשמעתי",
      614, 2542, 519, 51
    ),
    field(
      "disciplinaryRecordSignature",
      "חתימה על הרישום בגיליון המשמעתי",
      79, 2542, 519, 51
    ),

    // הוזנה במערכת הממוחשבת
    field(
      "computerEntryDate",
      "תאריך ההזנה במערכת הממוחשבת",
      614, 2608, 519, 51
    ),
    field(
      "computerEntrySignature",
      "חתימה על ההזנה במערכת הממוחשבת",
      79, 2608, 519, 51
    ),

    // תוקן חישוב תקופת הכליאה
    field(
      "confinementCalculationDate",
      "תאריך תיקון חישוב תקופת הכליאה",
      614, 2675, 519, 51
    ),
    field(
      "confinementCalculationSignature",
      "חתימה על תיקון חישוב תקופת הכליאה",
      79, 2675, 519, 51
    ),
  ],
};