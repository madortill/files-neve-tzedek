import "./css/App.css";

import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import OpeningPage from "./components/start/OpeningPage.jsx";
import ChapterNav1 from "./components/learning/chapter1/ChapterNav1.jsx";
import EndPage from "./components/end/End";

import { preloadAssets } from "./preloadAssets";
function clearCourseSession() {
  const prefix = "forms-course:";

  const courseKeys = Array.from(
    { length: sessionStorage.length },
    (_, index) => sessionStorage.key(index)
  ).filter((key) => key?.startsWith(prefix));

  courseKeys.forEach((key) => sessionStorage.removeItem(key));
}
function App() {
  const navigate = useNavigate();

  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadAssets() {
      try {
        await preloadAssets();

        if (active) {
          setAssetsLoaded(true);
        }
      } catch (error) {
        console.error("טעינת הקבצים נכשלה:", error);

        if (active) {
          setLoadingError(true);
        }
      }
    }

    loadAssets();

    return () => {
      active = false;
    };
  }, []);

  if (loadingError) {
    return (
      <div className="app-loading">
        <p>טעינת הקבצים נכשלה. נסו לרענן את העמוד.</p>
      </div>
    );
  }

  if (!assetsLoaded) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>טוענים בשבילך את הלומדה...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <OpeningPage
              onStart={() => navigate("/learning")}
            />
          }
        />

        <Route
          path="/learning"
          element={
            <ChapterNav1
              onBack={() => navigate("/")}
              onFinish={() => navigate("/end")}
            />
          }
        />

        <Route path="/end" element={<EndPage />} />
      </Routes>
    </div>
  );
}

export default App;

//בפעולה שמייצגת יציאה אמיתית מהלומדה, השתמשי ב:
// function handleExitCourse() {
//   clearCourseSession();
//   navigate("/");
// }