import { Box, Button, Stack, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { CityMetroStationMultiAutoComplete, CityMultiAutoComplete } from '../../entities/city';
import { DomainMultiSelect, DomainSource } from '../../entities/domain';
import { AuthorSelect, DealTypeSelect, trimFilters, UniqueButtonCheckbox } from '../../entities/real-estate';
import {
  CheckButtonFloor,
  compareFullFlatFilter,
  FlatFilters,
  FlatFilterType,
  FlatStore,
  FloorInput,
  NumericLimitsFlatFilter,
  SelectFlatRoomCount,
  UseFlatFiltersContext,
} from '../../entities/real-estate/flat';
import { StatusMultiSelect } from '../../entities/status';
import { FontFamily } from '../../shared/enums/font-family.enum';
import { Size } from '../../shared/enums/size.enum';
import { getItemDeclension } from '../../shared/lib/get-item-declension';
import {
  ClearObjectsButton,
  InputBaseLineContainer,
  InputFiltersContainer,
  InputGridContainer,
  InputGridContainerTwoColumn,
  ModalButtonContainer,
  ShowObjectsButton,
  WFullContainer,
} from '../../shared/styles/styles';
import DatePickerComponent from '../../shared/ui-kit/date-picker/date-picker';
import UIInputFilters from '../../shared/ui-kit/input-filters/input-filters';
import UIOutlinedInput from '../../shared/ui-kit/input-filters/outlined-input';
import UIAutoComplete from '../../shared/ui-kit/select/auto-complete';
import { useRootStore } from '../../root-store.context';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { observer } from 'mobx-react';
import { FormProvider } from 'react-hook-form';
import { Spinner, SpinnerUiProvider } from '../../shared/ui-kit/spinner/spinner';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { useStrictContext } from '../../shared/hooks/use-strict-context';
import { ModalTab } from '../../shared/enums/modal-tab.enum';
import { userStore } from '../../user-store.context';
import { HttpStatusCode } from '../../shared/enums/http-status-code';
import { PagePath } from '../../shared/enums/page-path';
import { useNavigate } from 'react-router-dom';
import { NoDataMessage } from '../../shared/enums/no-data-message-enum';
import { debounce } from 'lodash';
import { FilterName } from '../../shared/enums/filter-names.enum';

type FlatFullFilterFormProps = {
  applyFilter: () => void;
  setClickedReset: (isClickedReset: boolean) => void;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
  setIsOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExist: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFilterLimitReached: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FlatFullFilterForm: React.FC<FlatFullFilterFormProps> = observer(
  ({ applyFilter, setClickedReset, setCurrentTab, setIsOpenSnackbar, setIsExist, setIsFilterLimitReached }) => {
    const theme = useTheme();
    const { cityStore, catalogStore, flatMapStore } = useRootStore();
    const [flatLocalStore] = useState(() => new FlatStore(catalogStore));
    const navigate = useNavigate();
    const {
      filters,
      updateCityAndDomain,
      isErrorForm,
      handleSubmit,
      formMethods,
      trigger,
      watch,
      defaultValues,
      getValues,
    } = useStrictContext(UseFlatFiltersContext);

    const filterDomains = useMemo(() => {
      return cityStore.findConnectedDomainsByParams({
        city: filters.city,
        domains: catalogStore.findDomains(),
        realEstateType: RealEstateTypeUpperCase.FLAT,
      });
    }, [filters.city]);

    const isFloorAdditionalExist = !!watch(FlatFilters.FLOOR_ADDITIONAL_FILTER)?.length;
    const conditionActivateButton = flatLocalStore.count && !isErrorForm;
    const isNotDefaultFilter = !compareFullFlatFilter(filters, defaultValues as FlatFilterType);

    const handleChangeCity = async () => {
      const cities = formMethods.getValues('city');

      if (!formMethods.getValues('city').length) {
        return;
      }

      const connectedDomains = cityStore.findConnectedDomainsByParams({
        city: cities,
        domains: catalogStore.findDomains(),
        realEstateType: RealEstateTypeUpperCase.FLAT,
      });

      updateCityAndDomain({
        city: cities,
        domain: connectedDomains.map((domain: DomainSource) => domain.value),
      });

      cities.length === 1 && (await cityStore.fetchMetroStationByCityId(cities[0]));
      trigger(FlatFilters.DOMAIN);
      trigger(FlatFilters.CITY);
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

        await flatLocalStore.fetchCount({
          ...trimmedFilter,
          ...(flatMapStore.polygonSelectedArea ? flatMapStore.getGeometryAndZoomObject() : {}),
        });

        return () => {
          abortController.abort();
        };
      }),
      TimeConvert.MILLISECONDS_IN_MILLISECONDS * 500,
    );

    const handleLoadingCount = async () => {
      if (isErrorForm) {
        flatLocalStore.setLoadingCount(false);

        return;
      }

      flatLocalStore.setLoadingCount(true);
      await new Promise(() => loadCount());
      flatLocalStore.setLoadingCount(false);
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
        realEstateType: RealEstateTypeUpperCase.FLAT,
      });

      if (status === HttpStatusCode.UNAUTHORIZED) {
        navigate(PagePath.LOGIN);
      }

      if (status === HttpStatusCode.BAD_REQUEST) {
        setIsOpenSnackbar(true);

        return;
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
            <InputBaseLineContainer>
              <CityMultiAutoComplete
                name={FlatFilters.CITY}
                handleChange={handleChangeCity}
                id={'city'}
                width={'100%'}
                inputLabel={'Город'}
                size={Size.SMALL}
              />
              <UIOutlinedInput
                name={FlatFilters.ADDRESS}
                placeholder={'Адрес'}
                visibilityTextHelper={true}
                helperText={'Например: Газовиков 32'}
              />
              <SelectFlatRoomCount color={theme.palette.text.primary} height={'40px'} />
            </InputBaseLineContainer>
            <InputGridContainer>
              <WFullContainer>
                <UIInputFilters
                  id={'area'}
                  width={'100%'}
                  size={Size.SMALL}
                  label={'Площ., м²'}
                  startAdornment={'от'}
                  endAdornment={'до'}
                  nameFrom={FlatFilters.AREA_FROM}
                  nameTo={FlatFilters.AREA_TO}
                  maxValue={NumericLimitsFlatFilter.AREA}
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
                  nameFrom={FlatFilters.PRICE_FROM}
                  nameTo={FlatFilters.PRICE_TO}
                  maxValue={NumericLimitsFlatFilter.PRICE}
                />
              </WFullContainer>
            </InputGridContainer>
            <InputGridContainerTwoColumn>
              <FloorInput
                id={'floor'}
                width={'100%'}
                size={Size.SMALL}
                label={'Этаж'}
                startAdornment={'от'}
                endAdornment={'до'}
                nameFrom={FlatFilters.FLOOR_FROM}
                nameTo={FlatFilters.FLOOR_TO}
                disabled={isFloorAdditionalExist}
              />
              <CheckButtonFloor />
            </InputGridContainerTwoColumn>
            <InputGridContainer>
              <UIAutoComplete size={Size.SMALL} label={'Район'} data={[]} />
              <CityMetroStationMultiAutoComplete />
            </InputGridContainer>
            <InputFiltersContainer>
              <DomainMultiSelect
                name={FlatFilters.DOMAIN}
                id={'sources'}
                width={'100%'}
                size={Size.SMALL}
                inputLabel={'Источники'}
                domains={filterDomains}
              />
              <AuthorSelect />
              <DatePickerComponent
                label={'Опубликован'}
                nameFrom={FlatFilters.PUBLISHED_AT_FROM}
                nameTo={FlatFilters.PUBLISHED_AT_TO}
              />
            </InputFiltersContainer>
            <InputGridContainer>
              <StatusMultiSelect
                name={FlatFilters.STATUS}
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
              <ClearObjectsButton size={Size.LARGE} onClick={resetForm}>
                Очистить
              </ClearObjectsButton>
              <ShowObjectsButton
                onClick={() => applyFilter()}
                size={Size.LARGE}
                disabled={!conditionActivateButton}
                sx={{ width: '280px', height: '40px' }}
              >
                <SpinnerUiProvider
                  statePending={flatLocalStore.loadingCount}
                  spinner={<Spinner sx={{ color: 'white', padding: '4.9px 0' }} size={'15px'} />}
                  children={
                    <>
                      {conditionActivateButton
                        ? `Показать ${getItemDeclension(flatLocalStore.count, ['объект', 'объекта', 'объектов'])}`
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
