import { Box, Button, FormControl, IconButton, Stack } from '@mui/material';
import React, { ReactElement, useEffect } from 'react';
import { Size } from '../../shared/enums/size.enum';
import UIInputFilters from '../../shared/ui-kit/input-filters/input-filters';
import { useRootStore } from '../../root-store.context';
import {
  compareFullHouseFilter,
  HouseFilters,
  HouseFilterType,
  NumericLimitsHouseFilter,
  UseHouseFiltersContext,
} from '../../entities/real-estate/house';
import { StatusMultiSelect } from '../../entities/status';
import { useStrictContext } from '../../shared/hooks/use-strict-context';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { FormProvider } from 'react-hook-form';
import { debounce } from 'lodash';
import { userStore } from '../../user-store.context';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { HttpStatusCode } from '../../shared/enums/http-status-code';
import { PagePath } from '../../shared/enums/page-path';
import { ModalTab } from '../../shared/enums/modal-tab.enum';
import { useNavigate } from 'react-router-dom';
import { Close, Search } from '@mui/icons-material';
import { isGeometryViewport } from '../../shared/lib/is-geometry-viewport';
import { observer } from 'mobx-react';
import { FilterName } from '../../shared/enums/filter-names.enum';

type HouseFilterButtonsProps = {
  buttonFilterModal: ReactElement;
  applyFilter: (canApplyFilter: boolean) => void;
  isOpenModalFilter: boolean;
  setIsOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExist: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFilterLimitReached: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenModalFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
};

const HouseFilterButtons: React.FC<HouseFilterButtonsProps> = ({
  buttonFilterModal,
  applyFilter,
  isOpenModalFilter,
  setIsOpenSnackbar,
  setIsExist,
  handleOpenModalFilter,
  setCurrentTab,
  setIsFilterLimitReached,
}) => {
  const { formMethods, handleSubmit, isErrorForm, watch, defaultValues, filters, getValues } =
    useStrictContext(UseHouseFiltersContext);
  const { catalogStore, cityStore, houseStore, houseMapStore } = useRootStore();
  const isNotDefaultFilter =
    !compareFullHouseFilter(filters, defaultValues as HouseFilterType) ||
    Boolean(houseMapStore.geometry && !isGeometryViewport(houseMapStore.geometry));
  const navigate = useNavigate();
  const loadHousesWithDebounce = handleSubmit(
    debounce(async () => {
      const abortController = new AbortController();

      if (isOpenModalFilter || isErrorForm) {
        return;
      }

      houseStore.setChangingFilter(true);
      applyFilter(!isOpenModalFilter);

      return () => {
        abortController.abort();
      };
    }, TimeConvert.MILLISECONDS_IN_MILLISECONDS * 1000),
  );

  const resetForm = async () => {
    houseMapStore.removePolygonSelectedArea();
    houseMapStore.clearGeometryOnMarkerAndPolygon();
    formMethods.reset();
    getValues('city').length === 1 && (await cityStore.fetchMetroStationByCityId(getValues('city')[0]));
    applyFilter(!isOpenModalFilter);
  };

  useEffect(() => {
    loadHousesWithDebounce();

    const watchCallback = watch(() => {
      loadHousesWithDebounce();
    });

    return () => {
      watchCallback.unsubscribe();
    };
  }, [watch, isOpenModalFilter, isErrorForm]);

  const saveFilter = async () => {
    const status = await userStore.saveFilter({
      filter: {
        ...filters,
        ...houseMapStore.getGeometryAndZoomObject(),
      },
      name: FilterName.DEFAULT,
      realEstateType: RealEstateTypeUpperCase.HOUSE,
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
    handleOpenModalFilter(true);
  };

  return (
    <FormProvider {...formMethods}>
      <Stack flexDirection={'row'} gap={'16px'} alignItems={'center'} sx={{ width: '100%' }}>
        <UIInputFilters
          id={'landArea'}
          width={'145px'}
          size={Size.SMALL}
          label={'Площ. участка, сот.'}
          startAdornment={'от'}
          endAdornment={'до'}
          nameFrom={HouseFilters.LAND_AREA_FROM}
          nameTo={HouseFilters.LAND_AREA_TO}
          maxValue={NumericLimitsHouseFilter.AREA_LAND}
        />
        <UIInputFilters
          id={'areaHouse'}
          width={'145px'}
          size={Size.SMALL}
          label={'Площ. дома, м²'}
          startAdornment={'от'}
          endAdornment={'до'}
          nameFrom={HouseFilters.AREA_FROM}
          nameTo={HouseFilters.AREA_TO}
          maxValue={NumericLimitsHouseFilter.AREA}
        />
        <UIInputFilters
          id={'price'}
          width={'160px'}
          size={Size.SMALL}
          label={'Цена, ₽'}
          startAdornment={'от'}
          endAdornment={'до'}
          nameFrom={HouseFilters.PRICE_FROM}
          nameTo={HouseFilters.PRICE_TO}
          maxValue={NumericLimitsHouseFilter.PRICE}
        />
        <Box display={'flex'} alignItems={'center'} gap={'4px'} className={'statuses'}>
          <FormControl>
            <StatusMultiSelect
              name={HouseFilters.STATUS}
              inputLabel={'Статус'}
              id={'status'}
              statuses={catalogStore.findStatuses()}
              width={'200px'}
              size={Size.SMALL}
            />
          </FormControl>
        </Box>
        <Box display={'flex'} gap={'8px'}>
          {buttonFilterModal}
          {isNotDefaultFilter && (
            <Button
              disableRipple
              sx={{
                whiteSpace: 'nowrap',
                fontSize: '14px',
                textTransform: 'none',
                borderRadius: '8px',
                padding: '6px 11px',
              }}
              size={'medium'}
              startIcon={<Search />}
              onClick={saveFilter}
            >
              Сохранить поиск
            </Button>
          )}
          {isNotDefaultFilter && (
            <IconButton
              disableRipple
              sx={{ borderRadius: '8px', '&:hover': { backgroundColor: 'rgba(252,106,106,0.05)' } }}
              size={Size.SMALL}
              onClick={resetForm}
            >
              <Close color={'error'} fontSize={Size.SMALL} />
            </IconButton>
          )}
        </Box>
      </Stack>
    </FormProvider>
  );
};

export default observer(HouseFilterButtons);
