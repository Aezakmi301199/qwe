import { separateThousand } from './separate-thousand';

export const formatPrice = (number: number | null | string): string => {
  if (number === '0' || !number) {
    return 'Договорная';
  }

  return separateThousand(number);
};
