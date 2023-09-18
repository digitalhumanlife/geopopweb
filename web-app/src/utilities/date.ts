import moment from 'moment';

// 예정, 진행중, 완료 구분 함수
export const isBeforeCurrentDate = (date: Date) => {
  // 입력한 시간이 현재일자 시간 이전이면 false
  if (moment(date).diff(moment.now()) < 0) {
    return false;
  } else {
    return true;
  }
};

// 현재시간 몇분 전 구하는 함수
export const diffDate = (date: Date) => {
  const diff = moment(date).diff(moment.now());
  return {
    diff: diff,
    diffDay: Math.floor(diff / (1000 * 60 * 60 * 24)),
    diffHour: Math.floor((diff / (1000 * 60 * 60)) % 24),
    diffMin: Math.floor((diff / (1000 * 60)) % 60),
  };
};
