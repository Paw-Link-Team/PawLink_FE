import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import PetForm from "./PetForm";
import type { PetFormValue } from "./PetForm";
import "./PetCreatePage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getToken() {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("로그인이 필요합니다.");
  return token;
}

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch(`${API_BASE_URL}pet/profile-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("이미지 업로드 실패:", text);
    throw new Error("이미지 업로드 실패");
  }

  const json = await res.json();
  return json.data as string;
}

export default function PetCreatePage() {
  const nav = useNavigate();

  const onSubmit = async (
    value: PetFormValue,
    imageFile: File | null
  ) => {
    try {
      const imageUrl = imageFile
        ? await uploadImage(imageFile)
        : null;

      const res = await fetch(`${API_BASE_URL}api/pet/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ...value,
          petProfileImageUrl: imageUrl,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("반려견 등록 실패:", text);
        throw new Error("반려견 등록 실패");
      }

      nav("/mypage/profile");
    } catch (e) {
      alert(
        e instanceof Error
          ? e.message
          : "알 수 없는 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="petc-layout">
      {/* 실제 스크롤 영역 */}
      <main className="petc-content">
        <header className="petc-top">
          <button onClick={() => nav(-1)}>←</button>
          <div className="petc-title">반려견 등록</div>
        </header>

        <PetForm
          submitText="등록 완료"
          initialValue={{
            petName: "",
            petAge: 1,
            petSex: "MALE",
            petType: "",
          }}
          onSubmit={onSubmit}
        />
      </main>

      {/* 하단 고정 네비 */}
      <NavBar active="mypage" />
    </div>
  );
}
