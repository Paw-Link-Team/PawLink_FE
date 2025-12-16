// frontend/src/App.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import NoticeBoardPage from "./pages/NoticeBoardPage";
import NoticeBoardDetailPage from "./pages/NoticeBoardDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/splash" replace />} />

      <Route path="/splash" element={<SplashPage />} />
      <Route path="/home" element={<HomePage />} />

      {/* 게시판 */}
      <Route path="/board" element={<NoticeBoardPage />} />
      <Route path="/board/:id" element={<NoticeBoardDetailPage />} />

      <Route path="*" element={<Navigate to="/splash" replace />} />
    </Routes>
  );
}
