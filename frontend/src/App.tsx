// frontend/src/App.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import SplashPage from "./pages/splash/SplashPage";
import HomePage from "./pages/HomePage";

import NoticeBoardPage from "./pages/NoticeBoardpage";
import NoticeBoardDetailPage from "./pages/NoticeBoardDetailPage";

import WalkerProfile from "./pages/WalkerProfile";
import ParentProfile from "./pages/ParentProfile";

import WalkLivePage from "./pages/WalkLivePage";

import ChatPage from "./pages/Chat";
import ChatRoomPage from "./pages/Chatroom";

import Mypage from "./pages/Mypage";
import MyPostsPage from "./pages/Mypostspage";
import FavoritesPage from "./pages/Favoritespage";
import WalkHistoryDetailPage from "./pages/Walkhistorydetailpage";

import Myprofilepage from "./pages/Myprofilepage";
import UnNoticeBoardPage from "./pages/unNoticeBoardpage";

import Chargepage from "./pages/Chargepage";
import Auth from "./pages/Auth";
import Withdrawpage from "./pages/Withdrawpage";
import AppointmentPage from "./pages/Appointmentpage";

export default function App() {
  return (
    <div className="app-wrapper">
      <div className="app-phone">
        <Routes>
          {/* 기본 진입 */}
          <Route path="/" element={<Navigate to="/splash" replace />} />

          {/* 스플래시 / 홈 */}
          <Route path="/splash" element={<SplashPage />} />
          <Route path="/home" element={<HomePage />} />

          {/* 게시판 */}
          <Route path="/board" element={<NoticeBoardPage />} />
          <Route path="/board/:id" element={<NoticeBoardDetailPage />} />
          <Route path="/board/done" element={<UnNoticeBoardPage />} />

          {/* 프로필 */}
          <Route path="/walker-profile" element={<WalkerProfile />} />
          <Route path="/parent-profile" element={<ParentProfile />} />
          <Route path="/mypage/profile" element={<Myprofilepage />} />

          {/* 실시간 산책 */}
          <Route path="/walk/live" element={<WalkLivePage />} />

          {/* 채팅 */}
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:roomId" element={<ChatRoomPage />} />

          {/* 마이페이지 */}
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/mypage/posts" element={<MyPostsPage />} />
          <Route path="/mypage/favorites" element={<FavoritesPage />} />
          <Route path="/mypage/history/:id" element={<WalkHistoryDetailPage />} />

          {/* 결제 */}
          <Route path="/pay/charge" element={<Chargepage />} />
          {/* 출금 */}
          <Route path="/pay/withdraw" element={<Withdrawpage />} />


          {/* 인증 */}
          <Route path="/auth" element={<Auth />} />
          {/* 약속잡기 */}
          <Route path="/chat/:roomId/appointment" element={<AppointmentPage />} />


          {/* 없는 주소 */}
          <Route path="*" element={<Navigate to="/splash" replace />} />
        </Routes>
      </div>
    </div>
  );
}
