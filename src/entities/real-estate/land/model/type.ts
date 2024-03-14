import { RealEstate, RealEstateClusterType } from '../../common/type';

export type Land = RealEstate & {
  area: number;
};

export type LandClusterType = RealEstateClusterType;
