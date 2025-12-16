import { RANKING_DATA } from "./rankingData";
import RankingItem from "./RankingItem";

export default function RankingSection() {
  return (
    <section className="home-ranking">
      <div className="home-ranking-header">우리동네 주간 산책랭크</div>

      <ul className="home-ranking-list">
        {RANKING_DATA.map((item) => (
          <RankingItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
