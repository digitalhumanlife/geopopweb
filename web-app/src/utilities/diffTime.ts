export const getDDay = (endDate: string) => {
  const setDate = new Date(endDate);
  const now = new Date();

  const distance = setDate.getTime() - now.getTime();

  const day = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  const dDay = `D - ${day}일 `;
  const time = `
      ${hours < 10 ? `0${hours}` : hours}시간 
      ${minutes < 10 ? `0${minutes}` : minutes}분 `;

  return { dDay, time };
};

// const init = () => {
//   getDDay('2023-12-25');
//   setInterval(getDDay, 1000);
// };

// init();
