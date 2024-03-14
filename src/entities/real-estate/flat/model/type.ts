import { RealEstate, RealEstateClusterType } from '../../common/type';

export type Flat = RealEstate & {
  area: number;
  floor: number;
  floorCount: number;
  roomCount: number;
};

export type FlatClusterType = RealEstateClusterType & {
  floorFrom?: string;
  floorTo?: string;
  roomCount?: number[];
  floorAdditionalFilter: string[];
};
