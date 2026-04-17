import { useState, useEffect } from "react";
import UploadPage from "./pages/UploadPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

export default function App() {
  const [session, setSession] = useState(null);

  // ── Restore session from storage on refresh ────────────────────────────
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("ai_analyst_session");
      if (saved) setSession(JSON.parse(saved));
    } catch {
      sessionStorage.removeItem("ai_analyst_session");
    }
  }, []);

  // ── Save session when it changes ───────────────────────────────────────
  const handleUploadSuccess = (data) => {
    sessionStorage.setItem("ai_analyst_session", JSON.stringify(data));
    setSession(data);
  };

  // ── Clear session on exit ──────────────────────────────────────────────
  const handleReset = () => {
    sessionStorage.removeItem("ai_analyst_session");
    setSession(null);
  };

  return session ? (
    <DashboardPage session={session} onReset={handleReset} />
  ) : (
    <UploadPage onUploadSuccess={handleUploadSuccess} />
  );
}
