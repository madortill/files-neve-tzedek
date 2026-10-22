

import filePass from "../../assets/images/files/file-pass-approve.svg"



const PAGE_WIDTH = 1750;
const PAGE_HEIGHT = 2668;

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

    // נגדיר תשובות נכונות כשיהיה לנו מפתח תשובות.
    validation: null,

    ...extra,
  };
}

export const passForm = {
  id: "passApproval",
  title: "אישור מעבר",
  filePass,
  width: PAGE_WIDTH,
  height: PAGE_HEIGHT,

  fields: [
    // מספר האישור בראש הטופס
    field(
      "approvalNumber",
      "מספר אישור",
      1052, 356, 138, 44,
      { inputMode: "numeric" }
    ),

    // חתימת קצין — מימין לשמאל
    field(
      "officerPersonalNumber",
      "מספר אישי של הקצין",
      1380, 724, 302, 98,
      { inputMode: "numeric" }
    ),
    field(
      "officerRank",
      "דרגת הקצין",
      1164, 726, 198, 98
    ),
    field(
      "officerLastName",
      "שם משפחה של הקצין",
      842, 728, 306, 98
    ),
    field(
      "officerFirstName",
      "שם פרטי של הקצין",
      570, 728, 254, 98
    ),
    field(
      "officerSignature",
      "חתימת הקצין — הקלדת שם",
      234, 730, 320, 98
    ),

    // פירוט הכלואים — יתר התאים כבר מלאים בתמונה
    field(
      "detaineeNotes",
      "הערות לפירוט הכלואים",
      30, 1268, 508, 66
    ),

    // השורה שמתחת לפירוט הכלואים
    field(
      "escortRank",
      "דרגה בשורה שמתחת לפירוט הכלואים",
      1106, 1416, 248, 72
    ),
    field(
      "escortLastName",
      "שם משפחה בשורה שמתחת לפירוט הכלואים",
      766, 1418, 322, 74
    ),
    field(
      "escortFirstName",
      "שם פרטי בשורה שמתחת לפירוט הכלואים",
      454, 1420, 296, 74
    ),
    field(
      "escortSignature",
      "חתימה בשורה שמתחת לפירוט הכלואים",
      178, 1420, 258, 74
    ),

    // חתימת סמל
    field(
      "sergeantPersonalNumber",
      "מספר אישי של הסמל",
      1392, 1680, 280, 86,
      { inputMode: "numeric" }
    ),
    field(
      "sergeantRank",
      "דרגת הסמל",
      1112, 1682, 262, 86
    ),
    field(
      "sergeantLastName",
      "שם משפחה של הסמל",
      814, 1686, 280, 86
    ),
    field(
      "sergeantFirstName",
      "שם פרטי של הסמל",
      512, 1688, 284, 86
    ),
    field(
      "sergeantSignature",
      "חתימת הסמל — הקלדת שם",
      208, 1688, 286, 86
    ),

    // חתימת המ"מ — יתר הפרטים כבר מלאים
    field(
      "commanderSignature",
      'חתימת המ״מ — הקלדת שם',
      208, 2076, 286, 104
    ),

    // חתימת רכז מודיעין בתחתית
    field(
      "intelligenceSignature",
      "חתימת רכז מודיעין — הקלדת שם",
      408, 2456, 1282, 48
    ),
  ],
};