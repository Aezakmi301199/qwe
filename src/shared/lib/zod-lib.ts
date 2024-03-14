import { parseStringNumber } from './transform-to-correct-value';

export const isCompareNumberBetweenInZod = (
  numberFrom: string | null | undefined,
  numberTo: string | null | undefined,
) => {
  return numberFrom && numberTo ? parseStringNumber(numberFrom) <= parseStringNumber(numberTo) : true;
};

export const isCompareDateBetweenInZod = (dateFrom: Date | null | undefined, dateTo: Date | null | undefined) => {
  if (!dateFrom || !dateTo) {
    return true;
  }

  return dateFrom <= dateTo;
};
