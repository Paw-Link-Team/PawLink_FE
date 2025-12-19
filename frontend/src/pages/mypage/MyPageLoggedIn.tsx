export default function MyPageLoggedIn() {
  return (
    <section className="mypage-logged-in">
      {/* 프로필 */}
      <div className="profile">
        <div className="avatar">🐾</div>
        <span className="name">강형욱</span>
      </div>

      {/* 포인트 */}
      <div className="pay-box">
        <span>PawLink pay</span>
        <strong>0원</strong>
      </div>

      {/* 메뉴 */}
      <div className="menu">
        <button>나의 산책</button>
        <button>관심 목록</button>
      </div>

      {/* 산책 히스토리 */}
      <div className="history">
        <h3>산책 히스토리</h3>
        <ul>
          <li>2025.12.5 / 0.82km 산책 / 배변 O</li>
          <li>2025.11.23 / 1.5km 산책 / 배변 O</li>
          <li>2025.11.10 / 0.6km 산책 / 배변 X</li>
        </ul>
      </div>
    </section>
  );
}