import { CrmStatusObject } from '../../../../shared/enums/object-status.enum';
import { Flat } from '../../flat';
import { House } from '../../house';
import { Land } from '../../land';

export interface CrmFlat {
  id: string;
  internalId: number;
  userId: string;
  address: string;
  price: string;
  area: number;
  roomCount: number;
  floor: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  crmName: string;
  status: keyof typeof CrmStatusObject;
  saleCommission: number;
  flats: { flat: Flat; createdAt: string }[];
}

export interface CrmHouse {
  id: string;
  internalId: number;
  userId: string;
  address: string;
  price: string;
  area: number;
  landArea: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  crmName: string;
  status: keyof typeof CrmStatusObject;
  saleCommission: number;
  houses: { house: House; createdAt: string }[];
}

export interface CrmLand {
  id: string;
  internalId: number;
  userId: string;
  address: string;
  price: string;
  area: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  crmName: string;
  status: keyof typeof CrmStatusObject;
  saleCommission: number;
  lands: { land: Land; createdAt: string }[];
}
