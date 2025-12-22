import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import SplashPage from "./pages/splash/SplashPage";
import HomePage from "./pages/HomePage";

import NoticeBoardPage from "./pages/NoticeBoardpage";
import NoticeBoardDetailPage from "./pages/NoticeBoardDetailPage";

import WalkerProfile from "./pages/WalkerProfile";
import ParentProfile from "./pages/ParentProfile";

import WalkLivePage from "./pages/WalkLivePage";

import ChatPage from "./pages/Chat";
import ChatRoomPage from "./pages/Chatroom";

// ✅ 마이페이지 + 서브페이지
import Mypage from "./pages/Mypage";
import MyPostsPage from "./pages/MyPostsPage";
import FavoritesPage from "./pages/Favoritespage";
import WalkHistoryDetailPage from "./pages/Walkhistorydetailpage";

import Myprofilepage from "./pages/Myprofilepage";

import UnNoticeBoardPage from "./pages/unNoticeBoardpage";

import LoginPage from "./pages/login/LoginPage";
import OauthCallback from "./pages/oauth/OauthCallback";
import AuthProcessing from "./pages/auth/processing/AuthProcessing";
import SignupNickname from "./pages/signup/SignupAgreementPage";

import AppointmentPage from "./pages/Appointmentpage";

import ChargePage from "./pages/Chargepage";
import WithdrawPage from "./pages/Withdrawpage";

// ✅ ✅ 추가: 글쓰기 페이지
import Writepostpage from "./pages/Writepostpage";

export default function App() {
  return (
    <Routes>
      {/* 기본 진입 */}
      <Route path="/" element={<Navigate to="/splash" replace />} />

      {/* 로그인 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth/callback" element={<OauthCallback />} />
      <Route path="/auth/processing" element={<AuthProcessing />} />

      {/* 회원가입 */}
      <Route path="/signup/nickname" element={<SignupNickname />} />

      {/* 스플래시 / 홈 */}
      <Route path="/splash" element={<SplashPage />} />
      <Route path="/home" element={<HomePage />} />

      {/* 게시판 */}
      <Route path="/board" element={<NoticeBoardPage />} />
      <Route path="/board/:id" element={<NoticeBoardDetailPage />} />
      <Route path="/board/done" element={<UnNoticeBoardPage />} />

      {/* ✅ ✅ 추가: 글쓰기 라우트 */}
      <Route path="/board/write" element={<Writepostpage />} />

      {/* 프로필 */}
      <Route path="/walker-profile" element={<WalkerProfile />} />
      <Route path="/parent-profile" element={<ParentProfile />} />

      {/* 실시간 산책 */}
      <Route path="/walk/live" element={<WalkLivePage />} />

      {/* 채팅 */}
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:roomId" element={<ChatRoomPage />} />
      <Route path="/chat/:roomId/appointment" element={<AppointmentPage />} />

      {/* 마이페이지 */}
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/mypage/posts" element={<MyPostsPage />} />
      <Route path="/mypage/favorites" element={<FavoritesPage />} />
      <Route path="/mypage/history/:id" element={<WalkHistoryDetailPage />} />
      <Route path="/mypage/profile" element={<Myprofilepage />} />

      {/* 결제 */}
      <Route path="/pay/charge" element={<ChargePage />} />
      <Route path="/pay/withdraw" element={<WithdrawPage />} />

      {/* 없는 주소 */}
      {/* <Route path="*" element={<Navigate to="/splash" replace />} /> */}
    </Routes>
  );
}