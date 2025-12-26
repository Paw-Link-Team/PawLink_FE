import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "./WritePostPage.css";

type WalkTimeType = "FIXED" | "FLEXIBLE" | "UNDECIDED";

type BoardDetail = {
  id: number;
  title: string;
  description: string;
  location: string;
  walkTime: string | null;
  walkTimeType: WalkTimeType;
  petId: number | null;
};

export default function BoardEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* =====================
   * 상태
   * ===================== */
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [walkTime, setWalkTime] = useState<string | null>(null);
  const [walkTimeType, setWalkTimeType] =
    useState<WalkTimeType>("FIXED");
  const [petId, setPetId] = useState<number | null>(null);

  /* =====================
   * 원본 값 (변경 감지용)
   * ===================== */
  const [origin, setOrigin] = useState<BoardDetail | null>(null);

  /* =====================
   * 게시글 조회
   * ===================== */
  const fetchBoard = useCallback(async () => {
    if (!id) return;

    try {
      const res = await api.get(`/boards/${id}`);
      const data: BoardDetail = res.data.data;

      setTitle(data.title);
      setDescription(data.description);
      setLocation(data.location);
      setWalkTime(data.walkTime);
      setWalkTimeType(data.walkTimeType);
      setPetId(data.petId);

      setOrigin(data);
    } catch (e) {
      alert("게시글을 불러올 수 없습니다.");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  /* =====================
   * 변경 여부 판단
   * ===================== */
  const isChanged = useMemo(() => {
    if (!origin) return false;

    return (
      title !== origin.title ||
      description !== origin.description ||
      location !== origin.location ||
      walkTime !== origin.walkTime ||
      walkTimeType !== origin.walkTimeType ||
      petId !== origin.petId
    );
  }, [
    origin,
    title,
    description,
    location,
    walkTime,
    walkTimeType,
    petId,
  ]);

  /* =====================
   * 제출
   * ===================== */
  const submit = useCallback(async () => {
    if (!id || !isChanged || submitting) return;

    try {
      setSubmitting(true);

      await api.put(`/boards/${id}`, {
        title,
        description,
        location,
        walkTime:
          walkTimeType === "UNDECIDED"
            ? null
            : walkTime,
        walkTimeType,
        petId,
      });

      navigate(`/board/${id}`, { replace: true });
    } catch (e) {
      alert("게시글 수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }, [
    id,
    title,
    description,
    location,
    walkTime,
    walkTimeType,
    petId,
    isChanged,
    submitting,
    navigate,
  ]);

  if (loading) return null;

  /* =====================
   * 렌더
   * ===================== */
  return (
    <div className="write-root">
      <div className="wp-wrapper">
        <div className="wp-screen">
          {/* ===== Header ===== */}
          <header className="wp-header">
            <button
              type="button"
              className="wp-close"
              onClick={() => navigate(-1)}
            >
              ←
            </button>
            <div className="wp-title">게시글 수정</div>
            <div className="wp-right" />
          </header>

          {/* ===== Body ===== */}
          <main className="wp-body">
            {/* 제목 */}
            <div className="wp-field">
              <div className="wp-label">제목</div>
              <input
                className="wp-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                <option value="FIXED">
                  시간 지정
                </option>
                <option value="FLEXIBLE">
                  조율 가능
                </option>
                <option value="UNDECIDED">
                  미정
                </option>
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
                  value={walkTime ?? ""}
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
              />
            </div>
          </main>

          {/* ===== Footer ===== */}
          <footer className="wp-footer">
            <button
              type="button"
              className={`wp-btn ${
                isChanged ? "active" : "disabled"
              }`}
              disabled={!isChanged || submitting}
              onClick={submit}
            >
              {submitting
                ? "저장 중..."
                : "변경사항 저장"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
