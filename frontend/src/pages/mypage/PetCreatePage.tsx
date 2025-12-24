import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import PetForm from "./PetForm";
import type { PetFormValue } from "./PetForm";


export default function PetCreatePage() {
  const nav = useNavigate();

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
    let imageUrl: string | null = null;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    await fetch("https://api-pawlink.duckdns.org/pet/create", {
      method: "POST",
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

        <NavBar active="mypage" />
      </div>
    </div>
  );
}
