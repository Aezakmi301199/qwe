export const getPercentage = (partCount: number, totalCount: number) => {
  const totalPercentage = 100;

  return Math.round((partCount / totalCount) * totalPercentage);
};
