import { useEffect, useState } from 'react';
import { TypeOrderBy } from '../../../../shared/enums/type-order-by';
import { Author } from '../../../../shared/enums/author.enum';
import { createStrictContext } from '../../../../shared/hooks/use-strict-context';
import {
  RealEstateCustomErrorText,
  RealEstateFilterType,
  RealEstateFilterTypeSchema,
  refineRealEstateTypeSchema,
} from '../../common/type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isCompareNumberBetweenInZod } from '../../../../shared/lib/zod-lib';
import { DealType } from '../../../../shared/enums/deal-type.enum';
import { useRootStore } from '../../../../root-store.context';
import { NumberConvert } from '../../../../shared/enums/number-convert.enum';
import { RealEstateTypeUpperCase } from '../../../../shared/enums/real-estate-type-upper-case.enum';
import { DomainSource } from '../../../domain';
import equal from 'fast-deep-equal';
import { sortByAlphabet } from '../../../../shared/lib/sort-by-alphabet';
import { useUser } from '../../../../user-context';

const tenThousandUnits = NumberConvert.THOUSAND * 10;
const tenBillionUnits = NumberConvert.BILLION * 10;

export enum NumericLimitsHouseFilter {
  PRICE = tenBillionUnits,
  AREA = tenThousandUnits,
  AREA_LAND = tenThousandUnits,
}

export enum HouseFilters {
  CITY = 'city',
  DEAL_TYPE = 'dealType',
  PUBLISHED_AT_FROM = 'publishedAtFrom',
  PUBLISHED_AT_TO = 'publishedAtTo',
  AUTHOR = 'author',
  ADDRESS = 'address',
  PRICE_FROM = 'priceFrom',
  PRICE_TO = 'priceTo',
  ORDER_BY = 'orderBy',
  DOMAIN = 'domain',
  CAN_SEE_PART_MATCHES = 'canSeePartMatches',
  LAND_AREA_FROM = 'landAreaFrom',
  LAND_AREA_TO = 'landAreaTo',
  AREA_FROM = 'areaFrom',
  AREA_TO = 'areaTo',
  METRO_STATION = 'metroStationId',
  STATUS = 'statusId',
}

export type HouseFilterType = RealEstateFilterType & {
  landAreaFrom?: string;
  landAreaTo?: string;
};

export type UseHouseFiltersDataReturnType = ReturnType<typeof useHouseFilters>;

export const UseHouseFiltersContext = createStrictContext<UseHouseFiltersDataReturnType>();

export const HouseFilterTypeSchema = RealEstateFilterTypeSchema.extend({
  landAreaFrom: z.string().optional(),
  landAreaTo: z.string().optional(),
});

const refineHouseFilterTypeSchema = refineRealEstateTypeSchema(HouseFilterTypeSchema).superRefine(
  (data, customError) => {
    const isCompareResponse = isCompareNumberBetweenInZod(data.landAreaFrom, data.landAreaTo);

    if (!isCompareResponse) {
      customError.addIssue({
        code: z.ZodIssueCode.custom,
        path: [HouseFilters.LAND_AREA_FROM],
        message: RealEstateCustomErrorText.INCORRECT_RANGE_LAND_AREA,
      });
      customError.addIssue({
        code: z.ZodIssueCode.custom,
        path: [HouseFilters.LAND_AREA_TO],
        message: RealEstateCustomErrorText.INCORRECT_RANGE_LAND_AREA,
      });
    }
  },
);

export const defaultHouseFilter = {
  city: [],
  dealType: DealType.SALE,
  publishedAtFrom: null,
  publishedAtTo: null,
  author: Author.OWNER,
  address: '',
  priceFrom: '',
  priceTo: '',
  orderBy: TypeOrderBy.PUBLISHED_AT_DESC,
  domain: [],
  statusId: [],
  canSeePartMatches: false,
  landAreaFrom: '',
  landAreaTo: '',
  areaFrom: '',
  areaTo: '',
  metroStationId: [],
};

export const getDefaultHouseFilter = (): HouseFilterType => {
  const { cityStore, catalogStore } = useRootStore();
  const user = useUser();

  return {
    ...defaultHouseFilter,
    city: [user.workAddress.cityId],
    statusId: catalogStore.findStatuses().map((status) => status.id),
    domain: cityStore
      .findConnectedDomainsByParams({
        city: [user.workAddress.cityId],
        domains: catalogStore.findDomains(),
        realEstateType: RealEstateTypeUpperCase.HOUSE,
      })
      .map((domain: DomainSource) => domain.value),
  };
};

export const trimNotPartialHouseFilter = (filter: HouseFilterType) => {
  try {
    return HouseFilterTypeSchema.pick({
      address: true,
      author: true,
      dealType: true,
      canSeePartMatches: true,
      floorAdditionalFilter: true,
      metroStationId: true,
      orderBy: true,
      publishedAtFrom: true,
      publishedAtTo: true,
      domain: true,
      city: true,
    }).parse(filter);
  } catch (error) {
    return false;
  }
};

const trimFullHouseFilter = (filter: HouseFilterType) => {
  try {
    return HouseFilterTypeSchema.pick({
      city: true,
      domain: true,
      publishedAtFrom: true,
      publishedAtTo: true,
      author: true,
      address: true,
      priceFrom: true,
      priceTo: true,
      orderBy: true,
      statusId: true,
      canSeePartMatches: true,
      landAreaFrom: true,
      landAreaTo: true,
      areaFrom: true,
      areaTo: true,
      metroStationId: true,
      dealType: true,
    }).parse(filter);
  } catch (error) {
    return false;
  }
};

export const compareFullHouseFilter = (firstFilter: HouseFilterType, secondFilter: HouseFilterType) => {
  if (!firstFilter) {
    return true;
  }

  const copyFirstFilters = {
    ...firstFilter,
    domain: sortByAlphabet(firstFilter.domain),
    statusId: firstFilter.statusId?.sort(),
  };
  const copySecondFilters = {
    ...secondFilter,
    domain: sortByAlphabet(secondFilter.domain),
    statusId: secondFilter.statusId?.sort(),
  };

  return equal(trimFullHouseFilter(copyFirstFilters), trimFullHouseFilter(copySecondFilters));
};

export const useHouseFilters = () => {
  const [isLoadingFilter, setIsLoadingFilter] = useState<boolean>(true);
  const { houseStore } = useRootStore();
  const [count, setCount] = useState<number>(0);
  const formMethods = useForm<HouseFilterType>({
    mode: 'all',
    defaultValues: getDefaultHouseFilter(),
    resolver: zodResolver(refineHouseFilterTypeSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, touchedFields, defaultValues },
    getValues,
    control,
    trigger,
    watch,
    setValue,
    reset,
  } = formMethods;

  const isDirtyForm = !!Object.keys(dirtyFields).length;
  const isTouchedForm = !!Object.keys(touchedFields).length;
  const isErrorForm = !!Object.keys(errors).length;
  const clearCityAndDomain = () => {
    setValue(HouseFilters.CITY, [], { shouldDirty: false });
    setValue(HouseFilters.DOMAIN, [], { shouldDirty: false });
  };
  const updateCityAndDomain = ({ city, domain }: { city: string[]; domain: string[] }) => {
    setValue(HouseFilters.DOMAIN, domain, { shouldDirty: false });
    setValue(HouseFilters.CITY, city, { shouldDirty: false });
    trigger();
    setIsLoadingFilter(false);

    return getValues();
  };
  const resetToCurrentFilter = () => {
    reset(houseStore.currentFilter as HouseFilterType, { keepDefaultValues: true });
  };

  useEffect(() => {
    resetToCurrentFilter();
  }, [houseStore.currentFilter]);

  return {
    filters: getValues(),
    getValues,
    isDirtyForm,
    isErrorForm,
    isTouchedForm,
    register,
    handleSubmit,
    errors,
    control,
    watch,
    clearCityAndDomain,
    trigger,
    isLoadingFilter,
    setIsLoadingFilter,
    updateCityAndDomain,
    count,
    setCount,
    reset,
    setValue,
    formMethods,
    defaultValues,
    resetToCurrentFilter,
  };
};
