import React, { use, useEffect, useState } from "react";
import "./WalkRank.css";

interface WalkRankItem {
    rank: number;
    name: string;
    distance: number;
    dogs: number;
}

const WalkRank: React.FC = () => {
    const [rankList, setRankList] = useState<WalkRankItem[]>([]);

    useEffect(() => {
        fetch("https://api-pawlink.duckdns.org/??") // 백엔드 api uri 사용
        .then(response => response.json())
        .then(data => setRankList(data))
        .catch(error => console.error("Error fetching walk rank data:", error));
    }, []);

    return (
    <section className="rank-container">
      <div className="rank-title">🐾 산책시 리드줄은 필수예요!</div>
      <div className="rank-subtitle">우리동네 주간 산책랭크</div>

      <ul className="rank-list">
        {rankList.map((item) => (
          <li key={item.rank} className="rank-item">
            <div className="rank-number">{item.rank}</div>
            <div className="rank-info">
              <div className="rank-name">{item.name}</div>
              <div className="rank-detail">
                산책거리 {item.distance}km | 함께 걷은 강아지 {item.dogs}마리
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WalkRank;