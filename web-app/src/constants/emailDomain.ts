export interface DomainOptionType {
  id: number;
  title: string;
  value: undefined | string;
}

export const domainOption: DomainOptionType[] = [
  { id: 1, title: '직접입력', value: undefined },
  { id: 2, title: 'naver.com', value: 'naver.com' },
  { id: 3, title: 'google.com', value: 'google.com' },
  { id: 4, title: 'hanmail.net', value: 'hanmail.net' },
  { id: 5, title: 'nate.com', value: 'nate.com' },
  { id: 6, title: 'kakao.com', value: 'kakao.com' },
];
