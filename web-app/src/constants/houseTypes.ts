export interface HouseTypesType {
  id: number;
  title: string;
  value: string;
}

export const HouseTypes: HouseTypesType[] = [
  { id: 1, title: '다세대 주택', value: '다세대 주택' },
  { id: 2, title: '오피스텔', value: '오피스텔' },
  { id: 3, title: '도시형 생활주택', value: '도시형생활주택' },
  { id: 4, title: '아파트', value: '아파트' },
  { id: 5, title: '근린 생활시설', value: '근린생활시설' },
  { id: 6, title: '업무시설', value: '업무시설' },
  { id: 7, title: '임대형 기숙사', value: '임대형 기숙사' },
  { id: 8, title: '나대지', value: '나대지' },
];
