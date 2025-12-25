import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "./NoticeBoardDetailPage.css";

/* =====================
 * 타입 정의 (백엔드 DTO 기준)
 * ===================== */

type WalkTimeType = "FIXED" | "FLEXIBLE" | "UNDECIDED";

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

  return (
    <div className="nbd-wrapper">
      <div className="nbd-screen">
        <div className="nbd-status" />

        {/* =====================
         * 상단 헤더
         * ===================== */}
        <header className="nbd-top">
          <button
            className="nbd-icon-btn"
            onClick={() => nav(-1)}
            aria-label="back"
          >
            ←
          </button>
          <button className="nbd-icon-btn" />
        </header>

        {/* =====================
         * 강아지 히어로
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
                {/* 이름 */}
                <div className="nbd-pet-name-group">
                  <span className="nbd-pet-name-label">반려견 이름: </span>
                  <span className="nbd-pet-name">{pet.name}</span>
                </div>

                {/* 기본 정보 */}
                <div className="nbd-pet-meta">
                  <div className="nbd-pet-meta-item">
                    <span className="nbd-pet-meta-label">견종: </span>
                    <span className="nbd-pet-meta-value">{pet.type}</span>
                  </div>

                  <div className="nbd-pet-meta-divider" />

                  <div className="nbd-pet-meta-item">
                    <span className="nbd-pet-meta-label">나이: </span>
                    <span className="nbd-pet-meta-value">{pet.age}</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </section>

        {/* =====================
         * 작성자
         * ===================== */}
        <section className="nbd-author">
          <img
            className="nbd-avatar"
            src={data.userProfileImageUrl || "/default-profile.png"}
            alt="profile"
          />
          <div className="nbd-author-text">
            <div className="nbd-author-name">{data.userNickname}</div>
            <div className="nbd-author-meta">{data.location}</div>
          </div>
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
            aria-label="like"
            type="button"
          >
            {data.interested ? "♥" : "♡"}
          </button>

          <button
            className="nbd-chat"
            onClick={() => nav(`/chat/board/${data.id}`)}
          >
            채팅하기
          </button>
        </footer>
      </div>
    </div>
  );
}
