import Header from "../Header/Header";
import MyPageGuest from "./MyPageGuest";
import MyPageLoggedIn from "./MyPageLoggedIn";
import NavBar from "../../components/NavBar";

export default function MyPage() {
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn = !!accessToken;

  return (
    <>
      <Header title="마이페이지" />
      {isLoggedIn ? <MyPageLoggedIn /> : <MyPageGuest />}
      <NavBar active="mypage" />
    </>
  );
}