import { useEffect, useState } from 'react';
import { TypeOrderBy } from '../../../../shared/enums/type-order-by';
import { Author } from '../../../../shared/enums/author.enum';
import { createStrictContext } from '../../../../shared/hooks/use-strict-context';
import { RealEstateFilterType, RealEstateFilterTypeSchema, refineRealEstateTypeSchema } from '../../common/type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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

export enum NumericLimitsLandFilter {
  PRICE = tenBillionUnits,
  AREA = tenThousandUnits,
}

export enum LandFilters {
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
  STATUS = 'statusId',
}

export type LandFilterType = RealEstateFilterType;

export type UseLandFiltersDataReturnType = ReturnType<typeof useLandFilters>;

export const UseLandFiltersContext = createStrictContext<UseLandFiltersDataReturnType>();

export const LandFilterTypeSchema = RealEstateFilterTypeSchema;

const refineLandFilterTypeSchema = refineRealEstateTypeSchema(LandFilterTypeSchema);

export const defaultLandFilter = {
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
};

export const getDefaultLandFilter = (): LandFilterType => {
  const { cityStore, catalogStore } = useRootStore();
  const user = useUser();

  return {
    ...defaultLandFilter,
    city: [user.workAddress.cityId],
    statusId: catalogStore.findStatuses().map((status) => status.id),
    domain: cityStore
      .findConnectedDomainsByParams({
        city: [user.workAddress.cityId],
        domains: catalogStore.findDomains(),
        realEstateType: RealEstateTypeUpperCase.LAND,
      })
      .map((domain: DomainSource) => domain.value),
  };
};

export const trimNotPartialLandFilter = (filter: LandFilterType) => {
  try {
    return LandFilterTypeSchema.pick({
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

const trimFullLandFilter = (filter: LandFilterType) => {
  try {
    return LandFilterTypeSchema.pick({
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
      dealType: true,
    }).parse(filter);
  } catch (error) {
    return false;
  }
};

export const compareFullLandFilter = (firstFilter: LandFilterType, secondFilter: LandFilterType) => {
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

  return equal(trimFullLandFilter(copyFirstFilters), trimFullLandFilter(copySecondFilters));
};

export const useLandFilters = () => {
  const [isLoadingFilter, setIsLoadingFilter] = useState<boolean>(true);
  const { landStore } = useRootStore();
  const [count, setCount] = useState<number>(0);

  const formMethods = useForm<LandFilterType>({
    mode: 'all',
    defaultValues: getDefaultLandFilter(),
    resolver: zodResolver(refineLandFilterTypeSchema),
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
    setValue(LandFilters.CITY, [], { shouldDirty: false });
    setValue(LandFilters.DOMAIN, [], { shouldDirty: false });
  };

  const updateCityAndDomain = ({ city, domain }: { city: string[]; domain: string[] }) => {
    setValue(LandFilters.DOMAIN, domain, { shouldDirty: false });
    setValue(LandFilters.CITY, city, { shouldDirty: false });
    trigger();
    setIsLoadingFilter(false);

    return getValues();
  };

  const resetToCurrentFilter = () => {
    reset(landStore.currentFilter as LandFilterType, { keepDefaultValues: true });
  };

  useEffect(() => {
    resetToCurrentFilter();
  }, [landStore.currentFilter]);

  return {
    filters: getValues(),
    getValues,
    isDirtyForm,
    isTouchedForm,
    isErrorForm,
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
