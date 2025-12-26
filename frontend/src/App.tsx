import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

/* ===== 공통 ===== */
import SplashPage from "./pages/splash/SplashPage";
import HomePage from "./pages/HomePage";
import HomeRedirect from "./pages/HomeRedirect";
import AdminHomePage from "./pages/admin/AdminHomePage";

/* ===== 게시판 ===== */
import NoticeBoardPage from "./pages/NoticeBoardPage";
import NoticeBoardDetailPage from "./pages/NoticeBoardDetailPage";
import UnNoticeBoardPage from "./pages/UnNoticeBoardPage";
import NoticeBoardSearchPage from "./pages/NoticeBoardsearchPage";
import WritePostPage from "./pages/WritePostPage";

/* ===== 프로필 ===== */
import WalkerProfile from "./pages/WalkerProfile";
import ParentProfile from "./pages/ParentProfile";

/* ===== 산책 ===== */
import WalkLivePage from "./pages/WalkLivePage";

/* ===== 채팅 ===== */
import ChatPage from "./pages/Chat";
import ChatRoomPage from "./pages/ChatRoomPage";
import AppointmentPage from "./pages/AppointmentPage";

/* ===== 마이페이지 ===== */
import MyPage from "./pages/mypage/MyPage";
import MyPostsPage from "./pages/MyPostsPage";
import FavoritesPage from "./pages/FavoritesPage";
import WalkHistoryDetailPage from "./pages/WalkHistoryDetailPage";
import MyProfilePage from "./pages/mypage/MyProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";

/* ===== 반려견 ===== */
import PetCreatePage from "./pages/mypage/PetCreatePage";
import PetEditPage from "./pages/mypage/PetEditPage";

/* ===== 인증 ===== */
import LoginPage from "./pages/login/LoginPage";
import LoginScreenPage from "./pages/login/LoginScreenPage";
import OauthCallback from "./pages/oauth/OauthCallback";
import AuthProcessing from "./pages/auth/processing/AuthProcessing";

/* ===== 회원가입 ===== */
import SignupInfo from "./pages/signup/SignupInfo";
import SignupAgreementPage from "./pages/signup/SignupAgreementPage";
import SignupCompletePage from "./pages/signup/SignupCompletePage";

/* ===== 기타 ===== */
import NetworkErrorPage from "./pages/error/NetworkErrorPage";
import ChargePage from "./pages/ChargePage";
import WithdrawPage from "./pages/WithdrawPage";

import WalkPage from "./pages/walk/WalkPage";
import WalkResultPage from "./pages/walk/WalkResultPage";

import BoardEditPage from "./pages/BoardEditPage";

export default function App() {
  return (
    <Routes>
      {/* ===== 기본 ===== */}
      <Route path="/" element={<Navigate to="/splash" replace />} />

      {/* ===== 관리자 ===== */}
      <Route path="/admin" element={<AdminHomePage />} />

      {/* ===== 스플래시 / 홈 ===== */}
      <Route path="/splash" element={<SplashPage />} />

      {/* 🔥 홈은 역할 분기 */}<Route path="/home" element={<HomeRedirect />} />
      <Route path="/home/main" element={<HomePage />} />
      <Route path="/admin" element={<AdminHomePage />} />


      {/* ===== 인증 ===== */}
      <Route path="/login/screen" element={<LoginScreenPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth/callback" element={<OauthCallback />} />
      <Route path="/auth/processing" element={<AuthProcessing />} />

      {/* ===== 회원가입 ===== */}
      <Route path="/signup/agreement" element={<SignupAgreementPage />} />
      <Route path="/signup/info" element={<SignupInfo />} />
      <Route path="/signup/complete" element={<SignupCompletePage />} />

      {/* ===== 에러 ===== */}
      <Route path="/error/network" element={<NetworkErrorPage />} />

      {/* ===== 게시판 ===== */}
      <Route path="/board" element={<NoticeBoardPage />} />
      <Route path="/board/search" element={<NoticeBoardSearchPage />} />
      <Route path="/board/done" element={<UnNoticeBoardPage />} />
      <Route path="/board/write" element={<WritePostPage />} />
      <Route path="/board/:id" element={<NoticeBoardDetailPage />} />
      <Route path="/board/edit/:id" element={<BoardEditPage />} />

      {/* ===== 프로필 ===== */}
      <Route path="/walkers/:userId" element={<WalkerProfile />} />
      <Route path="/owners/:userId" element={<ParentProfile />} />

      {/* ===== 실시간 산책 ===== */}
      <Route path="/walk/live" element={<WalkLivePage />} />

      {/* ===== 채팅 ===== */}
      <Route path="/chat" element={<ChatPage />} />
      
      {/* 1. 채팅방 ID로 직접 접근 (목록에서 클릭 시) */}
      <Route path="/chat/:roomId" element={<ChatRoomPage />} />
      
      {/* 2. 게시글 ID로 접근 (게시글에서 '채팅하기' 클릭 시) */}
      <Route path="/chat/board/:boardId" element={<ChatRoomPage />} />
      
      <Route
        path="/chat/:roomId/appointment"
        element={<AppointmentPage />}
      />

      {/* ===== 마이페이지 ===== */}
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/posts" element={<MyPostsPage />} />
      <Route path="/mypage/favorites" element={<FavoritesPage />} />
      <Route path="/mypage/history" element={<WalkHistoryDetailPage />} />
      <Route path="/mypage/history/:id" element={<WalkHistoryDetailPage />} />

      {/* ===== 내 프로필 ===== */}
      <Route path="/mypage/profile" element={<MyProfilePage />} />
      <Route path="/mypage/profile/edit" element={<ProfileEditPage />} />

      {/* ===== 결제 ===== */}
      <Route path="/pay/charge" element={<ChargePage />} />
      <Route path="/pay/withdraw" element={<WithdrawPage />} />

      {/* ===== 반려견 ===== */}
      <Route path="/mypage/pet/create" element={<PetCreatePage />} />
      <Route path="/mypage/pet/:petId/edit" element={<PetEditPage />} />

      {/* ===== 산책 ===== */}
      <Route path="/walk" element={<WalkPage />} />
      <Route path="/walk/result" element={<WalkResultPage />} />


      {/* ===== 없는 주소 ===== */}
      {/* <Route path="*" element={<Navigate to="/splash" replace />} /> */}
    </Routes>
  );
}
