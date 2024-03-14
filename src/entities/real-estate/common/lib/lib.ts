import { RealEstateFilterType } from '../type';

export const trimFilters = <T extends RealEstateFilterType>(filter: T): T => {
  if (filter.address) {
    filter.address.trim();
  }

  return filter;
};
