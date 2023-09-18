export const getPercentage = (num: number, total: number) => {
  const temp = +((num / total) * 100).toFixed(1);

  if (temp === 100) return 100;
  else if (temp === 0) return 0;
  else return temp;
};
