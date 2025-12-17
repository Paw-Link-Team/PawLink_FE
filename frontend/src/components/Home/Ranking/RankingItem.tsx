import type { RankingItemType } from "./rankingData";


interface RankingItemProps {
  item: RankingItemType;
}

const UserIcon: React.FC = () => (
  <svg
   className="home-ranking-avatar-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle cx="12" cy="9" r="4" />
    <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
  </svg>
);

export default function RankingItem({ item }: RankingItemProps) {
  return (
    <li className="home-ranking-item">
      <div className="home-ranking-left">
        <span className="home-ranking-number">{item.id}</span>

        <div className="home-ranking-texts">
          <p className="home-ranking-name">{item.name}</p>
          <p className="home-ranking-meta">
            {item.distance} | {item.dogs}
          </p>
        </div>
      </div>

      <div className="home-ranking-avatar">
        <UserIcon />
      </div>
    </li>
  );
}
