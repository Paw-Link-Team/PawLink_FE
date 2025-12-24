import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import PetForm from "./PetForm";
import type { PetFormValue } from "./PetForm";


export default function PetEditPage() {
  const { petId } = useParams();
  const nav = useNavigate();

  // 👉 실제로는 pet 조회 API로 받아야 함
  const pet = {
    petName: "코코",
    petAge: 3,
    petSex: "MALE" as const,
    petType: "푸들",
    petProfileImageUrl: "https://.../pet/profile/default.png",
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(
      "https://api-pawlink.duckdns.org/pet/profile-image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: fd,
      }
    );

    const json = await res.json();
    return json.data;
  };

  const onSubmit = async (value: PetFormValue, imageFile: File | null) => {
    let imageUrl = value.petProfileImageUrl ?? null;

    // 🔥 새 이미지 선택 시 교체
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    await fetch(`https://api-pawlink.duckdns.org/pet/${petId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        ...value,
        petProfileImageUrl: imageUrl,
      }),
    });

    nav("/mypage");
  };

  return (
    <div className="petc-wrapper">
      <div className="petc-screen">
        <header className="petc-top">
          <button onClick={() => nav(-1)}>←</button>
          <div className="petc-title">반려견 수정</div>
        </header>

        <PetForm
          submitText="수정 완료"
          initialValue={pet}
          onSubmit={onSubmit}
        />

        <NavBar active="mypage" />
      </div>
    </div>
  );
}
