import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import SplashPage from "./pages/splash/SplashPage";
import HomePage from "./pages/HomePage";

import NoticeBoardPage from "./pages/NoticeBoardPage";
import NoticeBoardDetailPage from "./pages/NoticeBoardDetailPage";
import UnNoticeBoardPage from "./pages/UnNoticeBoardPage";
import NoticeBoardSearchPage from "./pages/NoticeBoardsearchPage";

import WalkerProfile from "./pages/WalkerProfile";
import ParentProfile from "./pages/ParentProfile";

import WalkLivePage from "./pages/WalkLivePage";

import ChatPage from "./pages/Chat";
import ChatRoomPage from "./pages/ChatRoom";

import MyPage from "./pages/mypage/MyPage";
import MyPostsPage from "./pages/MyPostsPage";
import FavoritesPage from "./pages/FavoritesPage";
import WalkHistoryDetailPage from "./pages/WalkHistoryDetailPage";

import LoginPage from "./pages/login/LoginPage";
import LoginScreenPage from "./pages/login/LoginScreenPage";

import OauthCallback from "./pages/oauth/OauthCallback";
import AuthProcessing from "./pages/auth/processing/AuthProcessing";

import SignupInfo from "./pages/signup/SignupInfo";
import SignupAgreementPage from "./pages/signup/SignupAgreementPage";
import SignupCompletePage from "./pages/signup/SignupCompletePage";

import NetworkErrorPage from "./pages/error/NetworkErrorPage";
import AppointmentPage from "./pages/AppointmentPage";

import ChargePage from "./pages/ChargePage";
import WithdrawPage from "./pages/WithdrawPage";
import ProfileEditPage from "./pages/ProfileEditPage";

import WritePostPage from "./pages/WritePostPage";

// ✅ 마이페이지 / 반려견
import MyProfilePage from "./pages/mypage/MyProfilePage";
import PetCreatePage from "./pages/mypage/PetCreatePage";
import PetEditPage from "./pages/mypage/PetEditPage";

export default function App() {
  return (
    <Routes>
      {/* 기본 진입 */}
      <Route path="/" element={<Navigate to="/splash" replace />} />

      {/* 로그인 */}
      <Route path="/login/screen" element={<LoginScreenPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth/callback" element={<OauthCallback />} />
      <Route path="/auth/processing" element={<AuthProcessing />} />

      {/* 회원가입 */}
      <Route path="/signup/agreement" element={<SignupAgreementPage />} />
      <Route path="/signup/info" element={<SignupInfo />} />
      <Route path="/signup/complete" element={<SignupCompletePage />} />

      {/* 에러 */}
      <Route path="/error/network" element={<NetworkErrorPage />} />

      {/* 스플래시 / 홈 */}
      <Route path="/splash" element={<SplashPage />} />
      <Route path="/home" element={<HomePage />} />

      {/* 게시판 */}
      <Route path="/board" element={<NoticeBoardPage />} />
      <Route path="/board/search" element={<NoticeBoardSearchPage />} />
      <Route path="/board/done" element={<UnNoticeBoardPage />} />
      <Route path="/board/write" element={<WritePostPage />} />
      <Route path="/board/:id" element={<NoticeBoardDetailPage />} />

      {/* 프로필 */}
      <Route path="/walker-profile" element={<WalkerProfile />} />
      <Route path="/parent-profile" element={<ParentProfile />} />

      {/* 실시간 산책 */}
      <Route path="/walk/live" element={<WalkLivePage />} />

      {/* 채팅 */}
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:roomId" element={<ChatRoomPage />} />
      <Route
        path="/chat/:roomId/appointment"
        element={<AppointmentPage />}
      />

      {/* 마이페이지 */}
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/posts" element={<MyPostsPage />} />
      <Route path="/mypage/favorites" element={<FavoritesPage />} />
      <Route path="/mypage/history" element={<WalkHistoryDetailPage />} />
      <Route path="/mypage/history/:id" element={<WalkHistoryDetailPage />} />

      {/* 내 프로필 */}
      <Route path="/mypage/profile" element={<MyProfilePage />} />
      <Route path="/mypage/profile/edit" element={<ProfileEditPage />} />

      {/* 결제 */}
      <Route path="/pay/charge" element={<ChargePage />} />
      <Route path="/pay/withdraw" element={<WithdrawPage />} />

      {/* 🐶 반려견 */}
      <Route path="/mypage/pet/create" element={<PetCreatePage />} />
      <Route path="/mypage/pet/:petId/edit" element={<PetEditPage />} />

      {/* 없는 주소 */}
      {/* <Route path="*" element={<Navigate to="/splash" replace />} /> */}
    </Routes>
  );
}
