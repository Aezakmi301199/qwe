import { useEffect, useState } from 'react';
import { TypeOrderBy } from '../../../../shared/enums/type-order-by';
import { Author } from '../../../../shared/enums/author.enum';
import { createStrictContext } from '../../../../shared/hooks/use-strict-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { isCompareNumberBetweenInZod } from '../../../../shared/lib/zod-lib';
import {
  RealEstateCustomErrorText,
  RealEstateFilterType,
  RealEstateFilterTypeSchema,
  refineRealEstateTypeSchema,
} from '../../common/type';
import { DealType } from '../../../../shared/enums/deal-type.enum';
import { useRootStore } from '../../../../root-store.context';
import { NumberConvert } from '../../../../shared/enums/number-convert.enum';
import { RealEstateTypeUpperCase } from '../../../../shared/enums/real-estate-type-upper-case.enum';
import { DomainSource } from '../../../domain';
import { useUser } from '../../../../user-context';
import { sortByAlphabet } from '../../../../shared/lib/sort-by-alphabet';
import equal from 'fast-deep-equal';

const tenThousandUnits = NumberConvert.THOUSAND * 10;
const tenBillionUnits = NumberConvert.BILLION * 10;

export enum NumericLimitsFlatFilter {
  PRICE = tenBillionUnits,
  AREA = tenThousandUnits,
  FLOOR = NumberConvert.THOUSAND,
}

export type UseFlatFiltersDataReturnType = ReturnType<typeof useFlatFilters>;

export const UseFlatFiltersContext = createStrictContext<UseFlatFiltersDataReturnType>();

export enum FlatFilters {
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
  AREA_FROM = 'areaFrom',
  AREA_TO = 'areaTo',
  METRO_STATION = 'metroStationId',
  FLOOR_FROM = 'floorFrom',
  FLOOR_TO = 'floorTo',
  ROOM_COUNT = 'roomCount',
  FLOOR_ADDITIONAL_FILTER = 'floorAdditionalFilter',
  STATUS = 'statusId',
}

export type FlatFilterType = RealEstateFilterType & {
  floorFrom?: string;
  floorTo?: string;
  roomCount?: number[];
  floorAdditionalFilter: string[];
};

export const FlatFilterTypeSchema = RealEstateFilterTypeSchema.extend({
  floorFrom: z.string().optional(),
  floorTo: z.string().optional(),
  roomCount: z.number().array().optional(),
  floorAdditionalFilter: z.array(z.string()).optional(),
});

const refineFlatFilterTypeSchema = refineRealEstateTypeSchema(FlatFilterTypeSchema).superRefine((data, customError) => {
  const isCompareResponse = isCompareNumberBetweenInZod(data.floorFrom, data.floorTo);

  if (!isCompareResponse) {
    customError.addIssue({
      code: z.ZodIssueCode.custom,
      path: [FlatFilters.FLOOR_FROM],
      message: RealEstateCustomErrorText.INCORRECT_RANGE_FLOOR,
    });
    customError.addIssue({
      code: z.ZodIssueCode.custom,
      path: [FlatFilters.FLOOR_TO],
      message: RealEstateCustomErrorText.INCORRECT_RANGE_FLOOR,
    });
  }
});

export const defaultFlatFilter = {
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
  areaFrom: '',
  areaTo: '',
  metroStationId: [],
  floorFrom: '',
  floorTo: '',
  roomCount: [],
  floorAdditionalFilter: [],
};

export const getDefaultFlatFilter = (): FlatFilterType => {
  const { cityStore, catalogStore } = useRootStore();
  const user = useUser();

  return {
    ...defaultFlatFilter,
    statusId: catalogStore.findStatuses().map((status) => status.id),
    city: [user.workAddress.cityId],
    domain: cityStore
      .findConnectedDomainsByParams({
        city: [user.workAddress.cityId],
        domains: catalogStore.findDomains(),
        realEstateType: RealEstateTypeUpperCase.FLAT,
      })
      .map((domain: DomainSource) => domain.value),
  };
};

export const trimNotPartialFlatFilter = (filter: FlatFilterType) => {
  try {
    return FlatFilterTypeSchema.pick({
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

const trimFullFlatFilter = (filter: FlatFilterType) => {
  try {
    return FlatFilterTypeSchema.pick({
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
      areaFrom: true,
      areaTo: true,
      metroStationId: true,
      floorFrom: true,
      floorTo: true,
      roomCount: true,
      floorAdditionalFilter: true,
      dealType: true,
    }).parse(filter);
  } catch (error) {
    return false;
  }
};

export const compareFullFlatFilter = (firstFilter: FlatFilterType, secondFilter: FlatFilterType) => {
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

  return equal(trimFullFlatFilter(copyFirstFilters), trimFullFlatFilter(copySecondFilters));
};

export const useFlatFilters = () => {
  const [isLoadingFilter, setIsLoadingFilter] = useState<boolean>(true);
  const [changingFilterAndLoadingFilter, setChangingFilterAndLoadingFilter] = useState<boolean>(true);
  const { flatStore } = useRootStore();
  const [count, setCount] = useState<number>(0);

  const formMethods = useForm<FlatFilterType>({
    mode: 'all',
    defaultValues: getDefaultFlatFilter(),
    resolver: zodResolver(refineFlatFilterTypeSchema),
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
    setValue(FlatFilters.CITY, [], { shouldDirty: false });
    setValue(FlatFilters.DOMAIN, [], { shouldDirty: false });
  };

  const updateCityAndDomain = ({ city, domain }: { city: string[]; domain: string[] }) => {
    setValue(FlatFilters.DOMAIN, domain, { shouldDirty: false });
    setValue(FlatFilters.CITY, city, { shouldDirty: false });
    trigger();
    setIsLoadingFilter(false);

    return getValues();
  };

  const resetToCurrentFilter = () => {
    reset(flatStore.currentFilter as FlatFilterType, { keepDefaultValues: true });
  };

  useEffect(() => {
    resetToCurrentFilter();
  }, [flatStore.currentFilter]);

  return {
    filters: getValues(),
    getValues,
    isDirtyForm,
    isTouchedForm,
    isErrorForm,
    register,
    handleSubmit,
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
    dirtyFields,
    defaultValues,
    resetToCurrentFilter,
    setChangingFilterAndLoadingFilter,
    changingFilterAndLoadingFilter,
  };
};
