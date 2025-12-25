import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "./NoticeBoardDetailPage.css";

/* =====================
 * 타입 정의
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
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState(true);

  /* =====================
   * 상세 조회
   * ===================== */
  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await api.get(`/boards/${id}`);
        setData(res.data.data);
      } catch (e) {
        console.error("게시글 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  /* =====================
   * 관심 토글
   * ===================== */
  const toggleInterest = async () => {
    if (!data) return;

    try {
      if (data.interested) {
        await api.delete(`/boards/${data.id}/interest`);
        setData({
          ...data,
          interested: false,
          interestCount: data.interestCount - 1,
        });
      } else {
        await api.post(`/boards/${data.id}/interest`);
        setData({
          ...data,
          interested: true,
          interestCount: data.interestCount + 1,
        });
      }
    } catch (e) {
      console.error("관심 처리 실패", e);
    }
  };

  /* =====================
   * 모집 완료 처리 (작성자만)
   * ===================== */
  const handleComplete = async () => {
    if (!data) return;

    if (!confirm("모집을 완료하시겠어요?")) return;

    try {
      await api.post(`/boards/${data.id}/complete`);
      setData({ ...data, status: "COMPLETED" });
    } catch (e) {
      alert("완료 처리에 실패했어요.");
    }
  };

  /* =====================
   * 파생 데이터
   * ===================== */
  const metaLine = useMemo(() => {
    if (!data) return "";

    const timeText =
      data.walkTimeType === "FIXED"
        ? "고정"
        : data.walkTimeType === "FLEXIBLE"
        ? "협의 가능"
        : "미정";

    return `산책시간 ${timeText} · 산책장소 ${data.location}`;
  }, [data]);

  if (loading || !data) {
    return <div className="nbd-loading">로딩중...</div>;
  }

  const pet = data.petProfileDto;
  const isCompleted = data.status === "COMPLETED";

  return (
    <div className="nbd-wrapper">
      <div className="nbd-screen">
        <div className="nbd-status" />

        {/* 상단 헤더 */}
        <header className="nbd-top">
          <button className="nbd-icon-btn" onClick={() => nav(-1)}>
            ←
          </button>
        </header>

        {/* =====================
         * 반려견 히어로
         * ===================== */}
        <section className="nbd-hero">
          {pet && (
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
          )}
        </section>

        {/* =====================
         * 작성자 + 상태
         * ===================== */}
        <section className="nbd-author">
          <img
            className="nbd-avatar"
            src={data.userProfileImageUrl || "/default-profile.png"}
            alt="profile"
          />

          <div className="nbd-author-text">
            <div className="nbd-author-top">
              <span className="nbd-author-name">
                {data.userNickname}
              </span>

              <span
                className={`nbd-board-status ${
                  isCompleted ? "completed" : "open"
                }`}
              >
                {isCompleted ? "완료" : "모집 중"}
              </span>
            </div>

            <div className="nbd-author-meta">
              {data.location}
            </div>
          </div>

          {data.myBoard && !isCompleted && (
            <button
              className="nbd-complete-btn"
              onClick={handleComplete}
            >
              모집 완료
            </button>
          )}
        </section>

        {/* =====================
         * 본문
         * ===================== */}
        <main className="nbd-content">
          <div className="nbd-title">{data.title}</div>
          <div className="nbd-meta">{metaLine}</div>

          <div className="nbd-body">
            <div className="nbd-body-head">상세 내용</div>
            <div className="nbd-body-line">{data.description}</div>
          </div>

          <div className="nbd-stats">
            관심 {data.interestCount} · 조회 {data.viewCount}
          </div>

          <div className="nbd-safe" />
        </main>

        {/* =====================
         * 하단 액션
         * ===================== */}
        <footer className="nbd-bottom">
          <button
            className={`nbd-heart ${data.interested ? "on" : ""}`}
            onClick={toggleInterest}
          >
            {data.interested ? "♥" : "♡"}
          </button>

          <button
            className="nbd-chat"
            disabled={isCompleted}
            onClick={() => nav(`/chat/board/${data.id}`)}
          >
            {isCompleted ? "완료된 게시글" : "채팅하기"}
          </button>
        </footer>
      </div>
    </div>
  );
}
