import { ParserRole } from '../enums/parser-role';

export type WorkAddressUserDto = {
  id: string;
  fullName: string;
  riesId: number;
  lastLoginAt: null | string;
  avatarUrl: string;
  isBlocked: boolean;
  role: {
    id: string;
    name: ParserRole;
    isDefault: boolean;
  };
  manager: {
    id: string;
    riesId: number;
    fullName: string;
    avatarUrl: string;
  } | null;
  crmFlatCount: number;
  crmFlatCommissionSum: number;
  crmHouseCount: number;
  crmHouseCommission: number;
  crmLandCount: number;
  crmLandCommission: number;
  crmRealEstateCount: number;
  crmRealEstateCommission: number;
  flatCallsCount: number;
  houseCallsCount: number;
  landCallsCount: number;
  realEstateCallsCount: number;
};
