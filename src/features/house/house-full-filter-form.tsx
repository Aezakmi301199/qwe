import { CityMetroStationMultiAutoComplete, CityMultiAutoComplete } from '../../entities/city';
import { observer } from 'mobx-react';
import { Box, Button, Stack, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { AuthorSelect, DealTypeSelect, trimFilters, UniqueButtonCheckbox } from '../../entities/real-estate';
import {
  compareFullHouseFilter,
  HouseFilters,
  HouseFilterType,
  HouseStore,
  NumericLimitsHouseFilter,
  UseHouseFiltersContext,
} from '../../entities/real-estate/house';
import { StatusMultiSelect } from '../../entities/status';
import { useRootStore } from '../../root-store.context';
import { FontFamily } from '../../shared/enums/font-family.enum';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { Size } from '../../shared/enums/size.enum';
import { getItemDeclension } from '../../shared/lib/get-item-declension';
import {
  ClearObjectsButton,
  InputFiltersContainer,
  InputGridContainer,
  ModalButtonContainer,
  ShowObjectsButton,
  WFullContainer,
} from '../../shared/styles/styles';
import DatePickerComponent from '../../shared/ui-kit/date-picker/date-picker';
import UIInputFilters from '../../shared/ui-kit/input-filters/input-filters';
import UIOutlinedInput from '../../shared/ui-kit/input-filters/outlined-input';
import UIAutoComplete from '../../shared/ui-kit/select/auto-complete';
import { FormProvider } from 'react-hook-form';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { Spinner, SpinnerUiProvider } from '../../shared/ui-kit/spinner/spinner';
import { useStrictContext } from '../../shared/hooks/use-strict-context';
import { DomainMultiSelect, DomainSource } from '../../entities/domain';
import { userStore } from '../../user-store.context';
import { ModalTab } from '../../shared/enums/modal-tab.enum';
import { HttpStatusCode } from '../../shared/enums/http-status-code';
import { PagePath } from '../../shared/enums/page-path';
import { useNavigate } from 'react-router-dom';
import { NoDataMessage } from '../../shared/enums/no-data-message-enum';
import { debounce } from 'lodash';
import { FilterName } from '../../shared/enums/filter-names.enum';

type HouseFullFilterFormProps = {
  applyFilter: () => void;
  setClickedReset: (isClickedReset: boolean) => void;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
  setIsOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExist: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFilterLimitReached: React.Dispatch<React.SetStateAction<boolean>>;
};

export const HouseFullFilterForm: React.FC<HouseFullFilterFormProps> = observer(
  ({ applyFilter, setClickedReset, setCurrentTab, setIsExist, setIsOpenSnackbar, setIsFilterLimitReached }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { cityStore, catalogStore, houseMapStore } = useRootStore();
    const [houseLocalStore] = useState(() => new HouseStore(catalogStore));
    const {
      filters,
      updateCityAndDomain,
      isErrorForm,
      formMethods,
      trigger,
      watch,
      handleSubmit,
      defaultValues,
      getValues,
    } = useStrictContext(UseHouseFiltersContext);

    const filterDomains = useMemo(() => {
      return cityStore.findConnectedDomainsByParams({
        city: filters.city,
        domains: catalogStore.findDomains(),
        realEstateType: RealEstateTypeUpperCase.HOUSE,
      });
    }, [filters.city]);

    const conditionActivateButton = houseLocalStore.count && !isErrorForm;
    const isNotDefaultFilter = !compareFullHouseFilter(filters, defaultValues as HouseFilterType);

    const handleChangeCity = async () => {
      const cities = formMethods.getValues('city');

      if (!formMethods.getValues('city').length) {
        return;
      }

      const connectedDomains = cityStore.findConnectedDomainsByParams({
        city: cities,
        domains: catalogStore.findDomains(),
        realEstateType: RealEstateTypeUpperCase.HOUSE,
      });

      updateCityAndDomain({
        city: cities,
        domain: connectedDomains.map((domain: DomainSource) => domain.value),
      });

      cities.length === 1 && (await cityStore.fetchMetroStationByCityId(cities[0]));
      trigger(HouseFilters.DOMAIN);
      trigger(HouseFilters.CITY);
    };

    const resetForm = async () => {
      formMethods.reset();
      getValues('city').length === 1 && (await cityStore.fetchMetroStationByCityId(getValues('city')[0]));
      setClickedReset(true);
    };

    const loadCount = debounce(
      handleSubmit(async () => {
        trigger();

        const values = getValues();
        const abortController = new AbortController();
        const trimmedFilter = trimFilters(values);

        await houseLocalStore.fetchCount({
          ...trimmedFilter,
          ...(houseMapStore.polygonSelectedArea ? houseMapStore.getGeometryAndZoomObject() : {}),
        });

        return () => {
          abortController.abort();
        };
      }),
      TimeConvert.MILLISECONDS_IN_MILLISECONDS * 500,
    );

    const handleLoadingCount = async () => {
      if (isErrorForm) {
        houseLocalStore.setLoadingCount(false);

        return;
      }

      houseLocalStore.setLoadingCount(true);
      await new Promise(() => loadCount());
      houseLocalStore.setLoadingCount(false);
    };

    useEffect(() => {
      handleLoadingCount();

      const watchCallback = watch(async () => {
        setClickedReset(false);
        handleLoadingCount();
      });

      return () => {
        watchCallback.unsubscribe();
      };
    }, [watch, isErrorForm]);

    const saveFilter = async () => {
      const status = await userStore.saveFilter({
        filter: filters,
        name: FilterName.DEFAULT,
        realEstateType: RealEstateTypeUpperCase.HOUSE,
      });

      if (status === HttpStatusCode.BAD_REQUEST) {
        setIsOpenSnackbar(true);

        return;
      }

      if (status === HttpStatusCode.UNAUTHORIZED) {
        navigate(PagePath.LOGIN);
      }

      if (status === HttpStatusCode.CONFLICT) {
        setIsOpenSnackbar(true);
        setIsExist(true);

        return;
      }

      if (status === HttpStatusCode.FORBIDDEN) {
        setIsFilterLimitReached(true);

        return;
      }

      setCurrentTab(ModalTab.SAVED_FILTERS);
    };

    return (
      <Stack sx={{ gap: '20px', overflow: 'auto', flex: 1 }}>
        <FormProvider {...formMethods}>
          <Stack sx={{ flex: 1, gap: '20px' }}>
            <InputGridContainer mt={'8px'}>
              <CityMultiAutoComplete
                name={HouseFilters.CITY}
                handleChange={handleChangeCity}
                id={'city'}
                width={'100%'}
                inputLabel={'Город'}
                size={Size.SMALL}
              />
              <UIOutlinedInput
                name={HouseFilters.ADDRESS}
                placeholder={'Адрес'}
                visibilityTextHelper={true}
                helperText={'Например: Газовиков 32'}
              />
            </InputGridContainer>
            <InputGridContainer>
              <WFullContainer>
                <UIInputFilters
                  id={'landArea'}
                  width={'100%'}
                  size={Size.SMALL}
                  label={'Площ. участка, сот.'}
                  startAdornment={'от'}
                  endAdornment={'до'}
                  nameFrom={HouseFilters.LAND_AREA_FROM}
                  nameTo={HouseFilters.LAND_AREA_TO}
                  maxValue={NumericLimitsHouseFilter.AREA_LAND}
                />
              </WFullContainer>
              <WFullContainer>
                <UIInputFilters
                  id={'area'}
                  width={'100%'}
                  size={Size.SMALL}
                  label={'Площ. дома, м²'}
                  startAdornment={'от'}
                  endAdornment={'до'}
                  nameFrom={HouseFilters.AREA_FROM}
                  nameTo={HouseFilters.AREA_TO}
                  maxValue={NumericLimitsHouseFilter.AREA}
                />
              </WFullContainer>
              <WFullContainer>
                <UIInputFilters
                  id={'price'}
                  width={'100%'}
                  size={Size.SMALL}
                  label={'Цена, ₽'}
                  startAdornment={'от'}
                  endAdornment={'до'}
                  nameFrom={HouseFilters.PRICE_FROM}
                  nameTo={HouseFilters.PRICE_TO}
                  maxValue={NumericLimitsHouseFilter.PRICE}
                />
              </WFullContainer>
            </InputGridContainer>
            <InputGridContainer>
              <UIAutoComplete size={Size.SMALL} label={'Район'} data={[]} />
              <CityMetroStationMultiAutoComplete />
            </InputGridContainer>
            <InputFiltersContainer>
              <DomainMultiSelect
                name={HouseFilters.DOMAIN}
                id={'sources'}
                width={'100%'}
                size={Size.SMALL}
                inputLabel={'Источники'}
                domains={filterDomains}
              />
              <AuthorSelect />
              <DatePickerComponent
                label={'Опубликован'}
                nameFrom={HouseFilters.PUBLISHED_AT_FROM}
                nameTo={HouseFilters.PUBLISHED_AT_TO}
              />
            </InputFiltersContainer>
            <InputGridContainer>
              <StatusMultiSelect
                name={HouseFilters.STATUS}
                inputLabel={'Статус'}
                id={'status'}
                statuses={catalogStore.findStatuses()}
                width={'100%'}
                size={Size.SMALL}
              />
              <DealTypeSelect />
            </InputGridContainer>
            <UniqueButtonCheckbox />
          </Stack>
          <Box
            display={'flex'}
            position={'sticky'}
            bottom={'0'}
            flexShrink={0}
            alignItems={'center'}
            justifyContent={'space-between'}
            gap={'10px'}
          >
            <Button
              onClick={saveFilter}
              sx={{
                textTransform: 'none',
                whiteSpace: 'nowrap',
                padding: '8px 11px',
                fontSize: '15px',
                borderRadius: '8px',
                fontFamily: FontFamily.ROBOTO,
                color: theme.palette.primary.main,
                visibility: isNotDefaultFilter ? 'visible' : 'hidden',
              }}
            >
              Сохранить поиск
            </Button>
            <ModalButtonContainer>
              <ClearObjectsButton size={Size.LARGE} onClick={() => resetForm()}>
                Очистить
              </ClearObjectsButton>
              <ShowObjectsButton
                onClick={() => applyFilter()}
                size={Size.LARGE}
                disabled={!conditionActivateButton}
                sx={{ width: '280px', height: '40px' }}
              >
                <SpinnerUiProvider
                  statePending={houseLocalStore.loadingCount}
                  spinner={<Spinner sx={{ color: 'white', padding: '4.9px 0' }} size={'15px'} />}
                  children={
                    <>
                      {conditionActivateButton
                        ? `Показать ${getItemDeclension(houseLocalStore.count, ['объект', 'объекта', 'объектов'])}`
                        : NoDataMessage.REAL_ESTATE_NOT_FOUND}
                    </>
                  }
                />
              </ShowObjectsButton>
            </ModalButtonContainer>
          </Box>
        </FormProvider>
      </Stack>
    );
  },
);
