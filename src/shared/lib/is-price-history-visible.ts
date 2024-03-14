export const isPriceHistoryVisible = (price: string, priceHistory: { price: string }[]) => {
  if (priceHistory.every((priceRecord) => priceRecord.price === price)) {
    return false;
  }

  return priceHistory.length > 1;
};
