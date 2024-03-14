import { FlatFilterType } from '../../real-estate/flat';
import { HouseFilterType } from '../../real-estate/house';
import { LandFilterType } from '../../real-estate/land';
import { RealEstateTypeUpperCase } from '../../../shared/enums/real-estate-type-upper-case.enum';
import { ParserRole } from '../../../shared/enums/parser-role';

type Role = {
  id: string;
  name: ParserRole;
  isDefault: boolean;
};

type City = {
  name: string;
  latitude: number;
  longitude: number;
  ries: {
    internalId: number;
  };
};

type WorkAddress = {
  id: number;
  cityId: string;
  city: City;
};

type SubscriptionPlan = {
  id: string;
  name: string;
  isDefault: boolean;
};

export type UserData = {
  id: string;
  token: string;
};

export type User = {
  id: string;
  fullName: string;
  riesId: string;
  createdAt: string;
  lastLoginAt: string | null;
  roleId: string;
  managerId: string | null;
  workAddressId: number;
  avatarUrl: string;
  isBlocked: boolean;
  blockInitiatorId: string | null;
  hasStaticRole: boolean;
  telegramId: string | null;
  subscriptionPlanId: string;
  subscriptionPlanExpiresAt: string | null;
  role: Role;
  workAddress: WorkAddress;
  subscriptionPlan: SubscriptionPlan;
};

export type UserStatDto = {
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

export type UserStat = Pick<UserStatDto, 'realEstateCallsCount' | 'crmRealEstateCount' | 'crmRealEstateCommission'>;

export interface RealEstateFilters<T extends FlatFilterType | HouseFilterType | LandFilterType> {
  isNotificationEnabled: boolean;
  id: string;
  name: string;
  params: T;
  realEstateType: RealEstateTypeUpperCase;
}
