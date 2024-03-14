import { ItemCount } from '../enums/item-count';

export const filterArrayByField = <T,>(array: T[], fieldKey: keyof T, fieldValue?: string | number) => {
  return array.filter((realEstateStat: T) => realEstateStat[fieldKey] === fieldValue);
};

type KeysWithNumberValue<T> = {
  [K in keyof T]: T[K] extends number | null | undefined ? K : never;
}[keyof T];

export const reduceAccumulatorByField = <T,>(arrayData: T[], fieldKey: KeysWithNumberValue<T>): number => {
  return arrayData.reduce((accumulator, objectData): number => {
    const val = objectData[fieldKey];

    if (typeof val === 'number') {
      return accumulator + val;
    }

    return accumulator;
  }, ItemCount.ZERO);
};
