import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "./NoticeBoardDetailPage.css";

/* =====================
 * 타입
 * ===================== */
type WalkTimeType = "FIXED" | "FLEXIBLE" | "UNDECIDED";
type BoardStatus = "OPEN" | "COMPLETED";

type PetProfile = {
  id: number;
  name: string;
  type: string;
  age: string;
  profileImageUrl: string | null;
};

type BoardDetail = {
  id: number;
  title: string;
  description: string;
  location: string;
  walkTime: string | null;
  walkTimeType: WalkTimeType;
  viewCount: number;
  userId: number;
  userNickname: string;
  userProfileImageUrl: string | null;
  interested: boolean;
  interestCount: number;
  status: BoardStatus;
  myBoard: boolean;
  petProfileDto: PetProfile | null;
};

export default function NoticeBoardDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState(true);

  /* =====================
   * 데이터 조회
   * ===================== */
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await api.get(`/boards/${id}`);
        setBoard(res.data.data);
      } catch (e) {
        console.error("게시글 조회 실패", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* =====================
   * 파생 상태
   * ===================== */
  const isCompleted = board?.status === "COMPLETED";
  const isMine = board?.myBoard === true;
  const pet = board?.petProfileDto;

  const metaLine = useMemo(() => {
    if (!board) return "";

    const timeText =
      board.walkTimeType === "FIXED"
        ? "고정"
        : board.walkTimeType === "FLEXIBLE"
        ? "협의 가능"
        : "미정";

    return `산책시간 ${timeText} · 산책장소 ${board.location}`;
  }, [board]);

  /* =====================
   * 액션
   * ===================== */

  const handleToggleInterest = useCallback(async () => {
    if (!board) return;

    try {
      if (board.interested) {
        await api.delete(`/boards/${board.id}/interest`);
        setBoard(prev =>
          prev
            ? {
                ...prev,
                interested: false,
                interestCount: prev.interestCount - 1,
              }
            : prev
        );
      } else {
        await api.post(`/boards/${board.id}/interest`);
        setBoard(prev =>
          prev
            ? {
                ...prev,
                interested: true,
                interestCount: prev.interestCount + 1,
              }
            : prev
        );
      }
    } catch (e) {
      console.error("관심 처리 실패", e);
    }
  }, [board]);

  /** 모집 상태 토글 */
  const handleToggleStatus = useCallback(async () => {
    if (!board) return;

    const nextStatus =
      board.status === "OPEN" ? "COMPLETED" : "OPEN";

    const confirmText =
      nextStatus === "COMPLETED"
        ? "모집을 완료하시겠어요?"
        : "모집을 다시 시작할까요?";

    if (!confirm(confirmText)) return;

    try {
      await api.post(
        `/boards/${board.id}/${nextStatus === "COMPLETED" ? "complete" : "reopen"}`
      );

      setBoard(prev =>
        prev ? { ...prev, status: nextStatus } : prev
      );
    } catch (e) {
      alert("상태 변경에 실패했어요.");
    }
  }, [board]);

  /* =====================
   * 로딩
   * ===================== */
  if (loading || !board) {
    return <div className="nbd-loading">로딩중...</div>;
  }

  /* =====================
   * 렌더
   * ===================== */
  return (
    <div className="nbd-wrapper">
      <div className="nbd-screen">
        <div className="nbd-status" />

        {/* 헤더 */}
        <header className="nbd-top">
          <button className="nbd-icon-btn" onClick={() => navigate(-1)}>
            ←
          </button>
        </header>

        {/* 반려견 히어로 */}
        {pet && (
          <section className="nbd-hero">
            <div className="nbd-pet-profile">
              <div className="nbd-pet-image-wrap">
                <img
                  className="nbd-pet-avatar"
                  src={pet.profileImageUrl || "/default-dog.png"}
                  alt="pet"
                />
              </div>

              <div className="nbd-pet-info">
                <div className="nbd-pet-label">반려견 이름</div>
                <div className="nbd-pet-name">{pet.name}</div>

                <div className="nbd-pet-meta">
                  <span>견종 {pet.type}</span>
                  <span className="dot">·</span>
                  <span>나이 {pet.age}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 작성자 */}
        <section className="nbd-author">
          <img
            className="nbd-avatar"
            src={board.userProfileImageUrl || "/default-profile.png"}
            alt="profile"
          />

          <div className="nbd-author-text">
            <div className="nbd-author-top">
              <span className="nbd-author-name">{board.userNickname}</span>
              <span
                className={`nbd-board-status ${isCompleted ? "completed" : "open"}`}
              >
                {isCompleted ? "완료" : "모집 중"}
              </span>
            </div>

            <div className="nbd-author-meta">{board.location}</div>
          </div>

          {isMine && (
            <button
              className={`nbd-complete-btn ${isCompleted ? "reopen" : ""}`}
              onClick={handleToggleStatus}
            >
              {isCompleted ? "모집 중" : "모집 완료"}
            </button>
          )}
        </section>

        {/* 본문 */}
        <main className="nbd-content">
          <div className="nbd-title">{board.title}</div>
          <div className="nbd-meta">{metaLine}</div>

          <div className="nbd-body">
            <div className="nbd-body-head">상세 내용</div>
            <div className="nbd-body-line">{board.description}</div>
          </div>

          <div className="nbd-stats">
            관심 {board.interestCount} · 조회 {board.viewCount}
          </div>

          <div className="nbd-safe" />
        </main>

        {/* 하단 액션 */}
        <footer className="nbd-bottom">
          <button
            className={`nbd-heart ${board.interested ? "on" : ""}`}
            onClick={handleToggleInterest}
          >
            {board.interested ? "♥" : "♡"}
          </button>

          <button
            className="nbd-chat"
            disabled={isCompleted}
            onClick={() => navigate(`/chat/board/${board.id}`)}
          >
            {isCompleted ? "완료된 게시글" : "채팅하기"}
          </button>
        </footer>
      </div>
    </div>
  );
}
