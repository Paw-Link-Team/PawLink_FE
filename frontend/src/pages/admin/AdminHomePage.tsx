import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import NavBar from "../../components/NavBar";
import "./AdminHomePage.css";

/* =====================
 * 타입
 * ===================== */

type ViewMode = "OWNER" | "WALKER";

type WalkerRankItem = {
  rank: number;
  userId: number;
  nickname: string;
  totalDistanceKm: number;
  walkCount: number;
};

type OwnerRankItem = {
  rank: number;
  userId: number;
  nickname: string;
  petCount: number;
  reviewCount: number;
};

type MeResponse = {
  userId: number;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
};

export default function AdminHomePage() {
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [view, setView] = useState<ViewMode>("OWNER");
  const [userId, setUserId] = useState("");

  const [walkerRanks, setWalkerRanks] = useState<WalkerRankItem[]>([]);
  const [ownerRanks, setOwnerRanks] = useState<OwnerRankItem[]>([]);

  /* =====================
   * 관리자 권한 체크
   * ===================== */
  useEffect(() => {
    api.get("/mypage/info")
      .then((res) => {
        const me = res.data.data;
        if (me.role === "USER") {
          navigate("/home", { replace: true });
        } else {
          setChecked(true);
        }
      })
      .catch(() => navigate("/login/screen", { replace: true }));
  }, [navigate]);

  useEffect(() => {
    if (!checked) return;

    api
      .get("/api/rank/walkers?size=5")
      .then((res) => setWalkerRanks(res.data.data));

    api
      .get("/api/rank/owners?size=5")
      .then((res) => setOwnerRanks(res.data.data));
  }, [checked]);


  /* =====================
   * 랭킹 로드
   * ===================== */
  useEffect(() => {
    if (!checked) return;

    api
      .get<WalkerRankItem[]>("/api/rank/walkers?size=5")
      .then((res) => setWalkerRanks(res.data));

    api
      .get<OwnerRankItem[]>("/api/rank/owners?size=5")
      .then((res) => setOwnerRanks(res.data));
  }, [checked]);

  if (!checked) return null;

  const goProfile = (mode: ViewMode, id: number) => {
    if (!id) return;

    if (mode === "OWNER") {
      navigate(`/owners/${id}`);
    } else {
      navigate(`/walkers/${id}`);
    }
  };

  /* =====================
   * 렌더
   * ===================== */

  return (
    <div className="ah-wrapper">
      <div className="ah-screen">
        <div className="ah-status" />

        {/* ===== 헤더 ===== */}
        <header className="ah-header">
          <div className="ah-logo">PawLink Admin</div>
        </header>

        {/* ===== 본문 ===== */}
        <main className="ah-content">
          {/* 빠른 조회 */}
          <section className="ah-section">
            <h3 className="ah-section-title">유저 프로필 바로 조회</h3>

            <div className="ah-toggle">
              <button
                className={view === "OWNER" ? "on" : ""}
                onClick={() => setView("OWNER")}
              >
                보호자
              </button>
              <button
                className={view === "WALKER" ? "on" : ""}
                onClick={() => setView("WALKER")}
              >
                산책가
              </button>
            </div>

            <input
              type="number"
              placeholder="유저 ID 입력"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="ah-input"
            />

            <button
              className="ah-btn"
              onClick={() => goProfile(view, Number(userId))}
            >
              조회
            </button>
          </section>

          {/* 산책가 랭킹 */}
          <section className="ah-section">
            <h3 className="ah-section-title">🏃 산책가 주간 랭킹</h3>

            {walkerRanks.map((r) => (
              <div
                key={r.userId}
                className="ah-rank-row"
                onClick={() => goProfile("WALKER", r.userId)}
              >
                <strong>
                  {r.rank}. {r.nickname}
                </strong>
                <span>
                  {r.totalDistanceKm}km · {r.walkCount}마리
                </span>
              </div>
            ))}
          </section>

          {/* 보호자 랭킹 */}
          <section className="ah-section">
            <h3 className="ah-section-title">🐶 보호자 주간 랭킹</h3>

            {ownerRanks.map((r) => (
              <div
                key={r.userId}
                className="ah-rank-row"
                onClick={() => goProfile("OWNER", r.userId)}
              >
                <strong>
                  {r.rank}. {r.nickname}
                </strong>
                <span>
                  반려견 {r.petCount} · 리뷰 {r.reviewCount}
                </span>
              </div>
            ))}
          </section>
        </main>

        {/* ===== 하단 네비 ===== */}
        <NavBar active="home" />
        <div className="ah-safe" />
      </div>
    </div>
  );
}
