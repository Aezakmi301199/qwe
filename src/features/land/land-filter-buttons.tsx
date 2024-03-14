import { Box, Button, FormControl, IconButton, Stack } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import {
  compareFullLandFilter,
  LandFilters,
  LandFilterType,
  NumericLimitsLandFilter,
  UseLandFiltersContext,
} from '../../entities/real-estate/land';
import { StatusMultiSelect } from '../../entities/status';
import { useRootStore } from '../../root-store.context';
import { Size } from '../../shared/enums/size.enum';
import UIInputFilters from '../../shared/ui-kit/input-filters/input-filters';
import React, { ReactElement, useEffect } from 'react';
import { useStrictContext } from '../../shared/hooks/use-strict-context';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { debounce } from 'lodash';
import { Close, Search } from '@mui/icons-material';
import { userStore } from '../../user-store.context';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { HttpStatusCode } from '../../shared/enums/http-status-code';
import { PagePath } from '../../shared/enums/page-path';
import { ModalTab } from '../../shared/enums/modal-tab.enum';
import { useNavigate } from 'react-router-dom';
import { isGeometryViewport } from '../../shared/lib/is-geometry-viewport';
import { observer } from 'mobx-react';
import { FilterName } from '../../shared/enums/filter-names.enum';

type LandFilterButtonsProps = {
  buttonFilterModal: ReactElement;
  applyFilter: (canApplyFilter: boolean) => void;
  isOpenModalFilter: boolean;
  setIsOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExist: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFilterLimitReached: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenModalFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
};

const LandFilterButtons: React.FC<LandFilterButtonsProps> = ({
  buttonFilterModal,
  applyFilter,
  isOpenModalFilter,
  setIsOpenSnackbar,
  setIsExist,
  handleOpenModalFilter,
  setCurrentTab,
  setIsFilterLimitReached,
}) => {
  const { handleSubmit, isErrorForm, formMethods, watch, defaultValues, filters, getValues } =
    useStrictContext(UseLandFiltersContext);
  const { catalogStore, cityStore, landMapStore, landStore } = useRootStore();
  const isNotDefaultFilter =
    !compareFullLandFilter(filters, defaultValues as LandFilterType) ||
    Boolean(landMapStore.geometry && !isGeometryViewport(landMapStore.geometry));
  const navigate = useNavigate();
  const loadLandsWithDebounce = handleSubmit(
    debounce(async () => {
      const abortController = new AbortController();

      if (isOpenModalFilter || isErrorForm) {
        return;
      }

      landStore.setChangingFilter(true);
      applyFilter(!isOpenModalFilter);

      return () => {
        abortController.abort();
      };
    }, TimeConvert.MILLISECONDS_IN_MILLISECONDS * 1000),
  );

  const resetForm = async () => {
    landMapStore.removePolygonSelectedArea();
    landMapStore.clearGeometryOnMarkerAndPolygon();
    formMethods.reset();
    getValues('city').length === 1 && (await cityStore.fetchMetroStationByCityId(getValues('city')[0]));
    applyFilter(!isOpenModalFilter);
  };

  useEffect(() => {
    loadLandsWithDebounce();

    const watchCallback = watch(() => {
      loadLandsWithDebounce();
    });

    return () => {
      watchCallback.unsubscribe();
    };
  }, [watch, isOpenModalFilter, isErrorForm]);

  const saveFilter = async () => {
    const status = await userStore.saveFilter({
      filter: {
        ...filters,
        ...landMapStore.getGeometryAndZoomObject(),
      },
      name: FilterName.DEFAULT,
      realEstateType: RealEstateTypeUpperCase.LAND,
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
          nameFrom={LandFilters.AREA_FROM}
          nameTo={LandFilters.AREA_TO}
          maxValue={NumericLimitsLandFilter.AREA}
        />
        <UIInputFilters
          id={'price'}
          width={'160px'}
          size={Size.SMALL}
          label={'Цена, ₽'}
          startAdornment={'от'}
          endAdornment={'до'}
          nameFrom={LandFilters.PRICE_FROM}
          nameTo={LandFilters.PRICE_TO}
          maxValue={NumericLimitsLandFilter.PRICE}
        />
        <Box display={'flex'} alignItems={'center'} gap={'4px'} className={'statuses'}>
          <FormControl>
            <StatusMultiSelect
              name={LandFilters.STATUS}
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

export default observer(LandFilterButtons);
