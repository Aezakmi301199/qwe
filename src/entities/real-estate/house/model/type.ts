import { RealEstate, RealEstateClusterType } from '../../common/type';

export type House = RealEstate & {
  area: number;
  landArea: number;
};

export type HouseClusterType = RealEstateClusterType & {
  landAreaFrom?: string;
  landAreaTo?: string;
};
