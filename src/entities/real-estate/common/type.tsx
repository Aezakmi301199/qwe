import { z } from 'zod';
import { Author } from '../../../shared/enums/author.enum';
import { Currency } from '../../../shared/enums/currency.enum';
import { Domain } from '../../../shared/enums/domain.enum';
import { TypeOrderBy } from '../../../shared/enums/type-order-by';
import { isCompareDateBetweenInZod, isCompareNumberBetweenInZod } from '../../../shared/lib/zod-lib';
import { DealType } from '../../../shared/enums/deal-type.enum';
import { FlatFilters } from '../flat';
import { MetroStationCity } from '../../city';
import type { GeoJsonGeometryType } from '../../../shared/types/geo/geo-json-geometry-type';
import { Grade } from '../../../shared/enums/grade';
import { SaveSource } from '../../../shared/enums/save-source.enum';
import { CrmStatusObject } from '../../../shared/enums/object-status.enum';

type image = {
  id: string;
  url: string;
};

export type RealEstate = {
  dealType: DealType;
  id: string;
  publishedAt: string;
  isActive: boolean;
  address: string;
  images: image[];
  price: string;
  domain: Domain;
  latitude: number;
  longitude: number;
  coincidence: string;
  author: Author;
  clientName: string;
  currency: Currency;
  metroStation: MetroStationCity | null;
  metroStationId: string[];
  phone: string | null;
  isFavourite: boolean;
  advertId: string;
  priceHistory: {
    price: string;
    createdAt: string;
    currency: Currency;
  }[];
  userStatus: {
    userId: string;
    statusId: string;
  } | null;
  _count: {
    comments: number;
  };
  url: string;
  callingUser: {
    id: string;
    fullName: string;
    avatarUrl: string;
  } | null;
  calls: {
    createdAt: string;
  }[];
  duplicates: {
    grade: Grade;
    saveSource: SaveSource;
  }[];
  isNew?: boolean;
  usersFavourites: [
    {
      userId: string;
    },
  ];
};

export type RealEstateFilterType = {
  statusId?: (string | null)[];
  city: string[];
  dealType: DealType;
  publishedAtFrom?: Date | null;
  publishedAtTo?: Date | null;
  author: Author;
  address?: string;
  priceFrom?: string;
  priceTo?: string;
  orderBy: TypeOrderBy;
  domain: string[];
  canSeePartMatches: boolean;
  areaFrom?: string;
  areaTo?: string;
  metroStationId?: string[];
  geometry?: GeoJsonGeometryType;
  zoom?: number;
};

export type RealEstateClusterType = {
  statusId: string[];
  city: string[];
  dealType: DealType;
  publishedAtFrom?: Date | null;
  publishedAtTo?: Date | null;
  author: Author;
  address?: string;
  priceFrom?: string;
  priceTo?: string;
  orderBy: TypeOrderBy;
  domain: string[];
  canSeePartMatches: boolean;
  areaFrom?: string;
  areaTo?: string;
  metroStationId?: string[];
  geometry?: GeoJsonGeometryType;
  zoom?: number;
  topLatitude?: number;
  topLongitude?: number;
  bottomLatitude?: number;
  bottomLongitude?: number;
};

export const RealEstateFilterTypeSchema = z.object({
  statusId: z.string().or(z.null()).array().nonempty().optional(),
  city: z.array(z.string()).nonempty(),
  dealType: z.nativeEnum(DealType),
  publishedAtFrom: z.coerce.date().nullable().optional(),
  publishedAtTo: z.coerce.date().nullable().optional(),
  author: z.nativeEnum(Author),
  address: z.string().optional(),
  priceFrom: z.string().optional(),
  priceTo: z.string().optional(),
  orderBy: z.nativeEnum(TypeOrderBy),
  domain: z.array(z.string()).nonempty(),
  canSeePartMatches: z.boolean(),
  areaFrom: z.string().optional(),
  areaTo: z.string().optional(),
  metroStationId: z.array(z.string()).optional(),
  geometry: z.custom<GeoJsonGeometryType>().optional(),
});

export const refineRealEstateTypeSchema = <O extends RealEstateFilterType, T extends z.ZodTypeDef, I>(
  schema: z.ZodType<O, T, I>,
) =>
  schema
    .superRefine((data, customError) => {
      const isCompareResponse = isCompareNumberBetweenInZod(data.priceFrom, data.priceTo);

      if (!isCompareResponse) {
        customError.addIssue({
          code: z.ZodIssueCode.custom,
          path: [FlatFilters.PRICE_FROM],
          message: RealEstateCustomErrorText.INCORRECT_RANGE_PRICE,
        });
        customError.addIssue({
          code: z.ZodIssueCode.custom,
          path: [FlatFilters.PRICE_TO],
          message: RealEstateCustomErrorText.INCORRECT_RANGE_PRICE,
        });
      }
    })
    .superRefine((data, customError) => {
      const isCompareResponse = isCompareDateBetweenInZod(data.publishedAtFrom, data.publishedAtTo);

      if (!isCompareResponse) {
        customError.addIssue({
          code: z.ZodIssueCode.custom,
          path: [FlatFilters.PUBLISHED_AT_FROM],
          message: RealEstateCustomErrorText.INCORRECT_RANGE_DATE,
        });
        customError.addIssue({
          code: z.ZodIssueCode.custom,
          path: [FlatFilters.PUBLISHED_AT_TO],
          message: RealEstateCustomErrorText.INCORRECT_RANGE_DATE,
        });
      }
    })
    .superRefine((data, customError) => {
      const isCompareResponse = isCompareNumberBetweenInZod(data.areaFrom, data.areaTo);

      if (!isCompareResponse) {
        customError.addIssue({
          code: z.ZodIssueCode.custom,
          path: [FlatFilters.AREA_FROM],
          message: RealEstateCustomErrorText.INCORRECT_RANGE_AREA,
        });
        customError.addIssue({
          code: z.ZodIssueCode.custom,
          path: [FlatFilters.AREA_TO],
          message: RealEstateCustomErrorText.INCORRECT_RANGE_AREA,
        });
      }
    });

export enum RealEstateCustomErrorText {
  INCORRECT_RANGE_AREA = 'Неверный диапазон площади',
  INCORRECT_RANGE_DATE = 'Неверный диапазон дат',
  INCORRECT_RANGE_PRICE = 'Неверный диапазон цен',
  INCORRECT_RANGE_FLOOR = 'Некорректный диапазон кол-ва этажей',
  INCORRECT_RANGE_LAND_AREA = 'Некорректный диапазон площади участка',
}

export type RealEstateByPublishingTime = {
  _avg: number;
  time: string;
  weekDay: number;
};

export type RealEstateStat = {
  statByPublishingTime: RealEstateByPublishingTime[];
};

export type CrmRealEstateFilter = {
  page: number;
  crmRealEstateStatus?: CrmStatusObject;
};
