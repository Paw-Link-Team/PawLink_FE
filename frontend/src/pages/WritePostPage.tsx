import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./WritePostPage.css";

type WalkTimeType = "FIXED" | "FLEXIBLE" | "UNDECIDED";

type Pet = {
  id: number;
  petName: string;
};

export default function WritePostPage() {
  const nav = useNavigate();

  /* =====================
   * 게시글 상태
   * ===================== */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [walkTime, setWalkTime] = useState("");
  const [walkTimeType, setWalkTimeType] =
    useState<WalkTimeType>("FIXED");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================
   * 반려견 상태
   * ===================== */
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] =
    useState<number | "">("");
  const [petLoading, setPetLoading] = useState(true);

  /* =====================
   * 반려견 목록 조회
   * ===================== */
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await api.get("/api/pet/info");
        setPets(res.data.data ?? []);
      } catch (e) {
        console.error("반려견 조회 실패", e);
        setPets([]);
      } finally {
        setPetLoading(false);
      }
    };

    fetchPets();
  }, []);

  /* =====================
   * 작성 가능 여부
   * ===================== */
  const isComplete = useMemo(() => {
    if (!selectedPetId) return false;

    if (walkTimeType === "UNDECIDED") {
      return (
        title.trim() &&
        description.trim() &&
        location.trim()
      );
    }

    return (
      title.trim() &&
      description.trim() &&
      location.trim() &&
      walkTime
    );
  }, [
    title,
    description,
    walkTime,
    walkTimeType,
    location,
    selectedPetId,
  ]);

  /* =====================
   * 제출
   * ===================== */
  const submit = async () => {
    if (!isComplete || loading) return;

    try {
      setLoading(true);

      await api.post("/boards", {
        title,
        description,
        location,
        walkTime:
          walkTimeType === "UNDECIDED"
            ? null
            : walkTime,
        walkTimeType,
        petId: Number(selectedPetId),
      });

      nav("/board", { replace: true });
    } catch (e) {
      console.error("게시글 작성 실패", e);
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wp-wrapper">
      <div className="wp-screen">
        {/* =====================
         * Header
         * ===================== */}
        <header className="wp-header">
          <button
            type="button"
            className="wp-close"
            onClick={() => nav(-1)}
          >
            ×
          </button>
          <div className="wp-title">글쓰기</div>
          <div className="wp-right" />
        </header>

        <main className="wp-body">
          {/* =====================
           * 반려견 선택 (번호 + 이름)
           * ===================== */}
          <div className="wp-field">
            <div className="wp-label">반려견 선택</div>

            {petLoading ? (
              <div className="wp-helper">불러오는 중...</div>
            ) : pets.length === 0 ? (
              <div className="wp-helper">
                반려견이 없습니다.
                <button
                  type="button"
                  className="wp-link"
                  onClick={() =>
                    nav("/mypage/pet/create")
                  }
                >
                  반려견 등록하기
                </button>
              </div>
            ) : (
              <select
                className="wp-input"
                value={selectedPetId}
                onChange={(e) =>
                  setSelectedPetId(
                    e.target.value
                      ? Number(e.target.value)
                      : ""
                  )
                }
              >
                {/* 안내용 placeholder */}
                <option value="" disabled>
                  반려견을 선택해주세요.
                </option>

                {/* 🔥 번호 + 이름 표시 */}
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    [{pet.id}] {pet.petName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 제목 */}
          <div className="wp-field">
            <div className="wp-label">제목</div>
            <input
              className="wp-input"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="제목을 입력해주세요."
            />
          </div>

          {/* 내용 */}
          <div className="wp-field">
            <div className="wp-label">산책 글 작성</div>
            <textarea
              className="wp-textarea"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="산책 내용을 작성해주세요."
            />
          </div>

          {/* 시간 유형 */}
          <div className="wp-field">
            <div className="wp-label">
              희망 산책 시간 유형
            </div>
            <select
              className="wp-input"
              value={walkTimeType}
              onChange={(e) =>
                setWalkTimeType(
                  e.target.value as WalkTimeType
                )
              }
            >
              <option value="FIXED">시간 지정</option>
              <option value="FLEXIBLE">조율 가능</option>
              <option value="UNDECIDED">미정</option>
            </select>
          </div>

          {walkTimeType !== "UNDECIDED" && (
            <div className="wp-field">
              <div className="wp-label">
                희망 산책 시간
              </div>
              <input
                type="datetime-local"
                className="wp-input"
                value={walkTime}
                onChange={(e) =>
                  setWalkTime(e.target.value)
                }
              />
            </div>
          )}

          {/* 장소 */}
          <div className="wp-field">
            <div className="wp-label">
              희망 산책 장소
            </div>
            <input
              className="wp-input"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="예: 강남구 대치동"
            />
          </div>

          <div className="wp-safe" />
        </main>

        {/* =====================
         * Footer
         * ===================== */}
        <footer className="wp-footer">
          <button
            type="button"
            className={`wp-btn ${
              isComplete ? "active" : "disabled"
            }`}
            disabled={!isComplete || loading}
            onClick={submit}
          >
            {loading ? "작성 중..." : "작성 완료"}
          </button>
        </footer>
      </div>
    </div>
  );
}
