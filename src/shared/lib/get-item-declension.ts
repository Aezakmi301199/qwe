export const getItemDeclension = (number: number | null, words: string[]) => {
  if (number === 0) {
    return 'Студия';
  }

  if (!number) {
    return 'Не указано';
  }

  const wordIndex =
    number % 100 > 4 && number % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5];

  const declension = words[wordIndex];

  return `${number} ${declension}`;
};
