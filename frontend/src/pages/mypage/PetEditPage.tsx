import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PetForm from "./PetForm";
import type { PetFormValue } from "./PetForm";
import "./PetEditPage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DEFAULT_IMAGE =
  "https://pawlink-profile-images.s3.ap-northeast-2.amazonaws.com/pet/profile/default.png";

function getToken() {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("로그인이 필요합니다.");
  return token;
}

export default function PetEditPage() {
  const { petId } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState<PetFormValue | null>(null);
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const [isRepresentative, setIsRepresentative] = useState(false);

  /* =====================
   * 기존 반려견 조회
   * ===================== */
  useEffect(() => {
    if (!petId) return;

    const fetchPet = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/pet/info/${petId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!res.ok) throw new Error("반려견 조회 실패");

        const { data } = await res.json();

        setPet({
          petName: data.petName,
          petAge: data.petAge,
          petSex: data.petSex,
          petType: data.petType,
        });
        setImageUrl(data.petProfileImageUrl ?? DEFAULT_IMAGE);
        setIsRepresentative(data.isRepresentative);
      } catch {
        alert("반려견 정보를 불러오지 못했습니다.");
        nav("/mypage");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId, nav]);

  /* =====================
   * 이미지 업로드
   * ===================== */
  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(`${API_BASE_URL}pet/profile-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: fd,
    });

    if (!res.ok) throw new Error("이미지 업로드 실패");

    const json = await res.json();
    return json.data;
  };

  /* =====================
   * 수정
   * ===================== */
  const onSubmit = async (value: PetFormValue, imageFile: File | null) => {
    if (!petId) return;

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const res = await fetch(`${API_BASE_URL}api/pet/update/${petId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ...value,
          petProfileImageUrl: finalImageUrl,
        }),
      });

      if (!res.ok) throw new Error();

      nav("/mypage");
    } catch {
      alert("반려견 수정에 실패했습니다.");
    }
  };

  /* =====================
   * 대표 반려견 설정
   * ===================== */
  const setRepresentative = async () => {
    if (!petId) return;

    const res = await fetch(
      `${API_BASE_URL}api/pet/${petId}/representative`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!res.ok) {
      alert("대표 반려견 설정 실패");
      return;
    }

    setIsRepresentative(true);
  };

  /* =====================
   * 삭제
   * ===================== */
  const deletePet = async () => {
    if (!petId) return;

    const ok = confirm("정말 반려견을 삭제할까요?");
    if (!ok) return;

    await fetch(`${API_BASE_URL}api/pet/delete/${petId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    nav("/mypage");
  };

  if (loading || !pet) return null;

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
          initialImageUrl={imageUrl}
          onSubmit={onSubmit}
        >
          {/* ===== 편집 액션 영역 ===== */}
          <div className="petc-action-group">
            {/* 대표 반려견 */}
            <div className="petc-representative-wrap">
              {isRepresentative ? (
                <div className="petc-representative-badge">
                  대표 반려견
                </div>
              ) : (
                <button
                  type="button"
                  className="petc-representative-btn"
                  onClick={setRepresentative}
                >
                  대표 반려견으로 설정
                </button>
              )}
            </div>

            {/* 삭제 */}
            <div className="petc-delete-wrap">
              <button
                type="button"
                className="petc-delete-btn"
                onClick={deletePet}
              >
                반려견 삭제
              </button>
            </div>
          </div>
        </PetForm>
      </div>
    </div>
  );
}
