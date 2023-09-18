export interface ProjectTabOption {
  label: string;
  value: string;
}

export const PROJECT_TAB_OPTIONS: ProjectTabOption[] = [
  { label: '나의 프로젝트', value: '나의 프로젝트' },
  { label: '관심 프로젝트', value: '관심 프로젝트' },
  { label: '회원정보', value: '회원정보' },
];

export interface MyTabValueType {
  id: string;
  sbj: string;
}

export const myTabValues: MyTabValueType[] = [
  {
    id: 'boardAll',
    sbj: '전체',
  },
  {
    id: 'boardNotice',
    sbj: '공지사항',
  },
  {
    id: 'boardVote',
    sbj: '투표',
  },
  {
    id: 'boardData',
    sbj: '관련서류',
  },
];
