import { useEffect, useState } from "react";

import ChapterNav1 from "./chapter1/ChapterNav1.jsx";
import ChapterNav2 from "./chapter2/ChapterNav2.jsx";
import ChapterNav3 from "./chapter3/ChapterNav3.jsx";

// כשפרק 3 יהיה מוכן, הוסיפי כאן את ה-import שלו.

const chapters = [ChapterNav1, ChapterNav2, ChapterNav3];

const STORAGE_KEY = "forms-course:learning";

function readChapterIndex() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    const index = saved?.chapterIndex;

    return Number.isInteger(index) &&
      index >= 0 &&
      index < chapters.length
      ? index
      : 0;
  } catch {
    return 0;
  }
}

export default function Learning({ onBack, onFinish }) {
  const [chapterIndex, setChapterIndex] = useState(readChapterIndex);

  const CurrentChapter = chapters[chapterIndex];

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ chapterIndex })
      );
    } catch {
      // הניווט ממשיך לעבוד גם אם האחסון חסום.
    }
  }, [chapterIndex]);

  function handleNextChapter() {
    if (chapterIndex === chapters.length - 1) {
      onFinish?.();
      return;
    }

    setChapterIndex((previous) => previous + 1);
  }

  function handlePreviousChapter() {
    if (chapterIndex === 0) {
      onBack?.();
      return;
    }

    setChapterIndex((previous) => previous - 1);
  }

  return (
    <CurrentChapter
      key={chapterIndex}
      onBack={
        chapterIndex > 0 || typeof onBack === "function"
          ? handlePreviousChapter
          : undefined
      }
      onFinish={
        chapterIndex < chapters.length - 1 ||
        typeof onFinish === "function"
          ? handleNextChapter
          : undefined
      }
    />
  );
}