import { formatPrice } from './format-price-number';

interface ICalculateCostSquareMeter {
  price: string | null;
  square: number | null;
  textError?: string;
  isFormatPrice?: boolean;
}

export const calculateCostSquareMeter = ({
  price,
  square,
  textError = 'Нет данных',
  isFormatPrice = false,
}: ICalculateCostSquareMeter): number | string => {
  const incorrectPriceOrSquare = !Number(price) || !Number(square) || !price || !square;

  if (incorrectPriceOrSquare) {
    return textError;
  }

  const priceNumber = Number((Number(price) / square).toFixed(0));

  return isFormatPrice ? formatPrice(priceNumber) : priceNumber;
};
