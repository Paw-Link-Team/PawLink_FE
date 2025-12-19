export interface RankingItemType {
  id: number;
  name: string;
  distance: string;
  dogs: string;
}

export const RANKING_DATA: RankingItemType[] = [
  {
    id: 1,
    name: "강정욱",
    distance: "산책거리 15km",
    dogs: "함께 걷은 강아지 25마리",
  },
  {
    id: 2,
    name: "우리초코가계에빠",
    distance: "산책거리 12km",
    dogs: "함께 걷은 강아지 21마리",
  },
  {
    id: 3,
    name: "모르는개산책",
    distance: "산책거리 9km",
    dogs: "함께 걷은 강아지 18마리",
  },
];
