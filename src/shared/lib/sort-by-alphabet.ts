export const sortByAlphabet = (array: string[]) => {
  return [...array].sort(function (a, b) {
    return a.localeCompare(b);
  });
};
