import { InitialState } from '../enums/pagination.enum';

export const calculateOffset = (showSubscriptionModal: boolean, activeUserFiltersCount: number) => {
  let def = 316;

  if (showSubscriptionModal) {
    def = def + 65 + 16;
  }

  if (activeUserFiltersCount >= InitialState.FIVE) {
    def = def + 50;
  }

  return def;
};
