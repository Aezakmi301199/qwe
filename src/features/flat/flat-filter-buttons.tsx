import { Box, Button, FormControl, IconButton, Stack, useTheme } from '@mui/material';
import React, { ReactElement, useEffect } from 'react';
import { Size } from '../../shared/enums/size.enum';
import { ButtonsContainer } from '../../shared/styles/styles';
import UIInputFilters from '../../shared/ui-kit/input-filters/input-filters';
import {
  compareFullFlatFilter,
  FlatFilters,
  FlatFilterType,
  FloorInput,
  NumericLimitsFlatFilter,
  SelectFlatRoomCount,
  UseFlatFiltersContext,
} from '../../entities/real-estate/flat';
import { StatusMultiSelect } from '../../entities/status';
import { useRootStore } from '../../root-store.context';
import { FormProvider } from 'react-hook-form';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { useStrictContext } from '../../shared/hooks/use-strict-context';
import { debounce } from 'lodash';
import { Close, Search } from '@mui/icons-material';
import { userStore } from '../../user-store.context';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { HttpStatusCode } from '../../shared/enums/http-status-code';
import { PagePath } from '../../shared/enums/page-path';
import { useNavigate } from 'react-router-dom';
import { ModalTab } from '../../shared/enums/modal-tab.enum';
import { observer } from 'mobx-react';
import { isGeometryViewport } from '../../shared/lib/is-geometry-viewport';
import { FilterName } from '../../shared/enums/filter-names.enum';

type FlatFilterButtonsProps = {
  buttonFilterModal: ReactElement;
  applyFilter: (canApplyFilter: boolean) => void;
  isOpenModalFilter: boolean;
  setIsOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExist: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFilterLimitReached: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenModalFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
};

const FlatFilterButtons: React.FC<FlatFilterButtonsProps> = ({
  buttonFilterModal,
  applyFilter,
  isOpenModalFilter,
  setIsOpenSnackbar,
  setIsExist,
  handleOpenModalFilter,
  setCurrentTab,
  setIsFilterLimitReached,
}) => {
  const theme = useTheme();
  const { formMethods, handleSubmit, isErrorForm, watch, defaultValues, filters, getValues } =
    useStrictContext(UseFlatFiltersContext);
  const { catalogStore, cityStore, flatStore, flatMapStore } = useRootStore();
  const isNotDefaultFilter =
    !compareFullFlatFilter(filters, defaultValues as FlatFilterType) ||
    Boolean(flatMapStore.geometry && !isGeometryViewport(flatMapStore.geometry));
  const navigate = useNavigate();
  const loadFlatsWithDebounce = handleSubmit(
    debounce(async () => {
      const abortController = new AbortController();

      if (isOpenModalFilter || isErrorForm) {
        return;
      }

      flatStore.setChangingFilter(true);
      applyFilter(!isOpenModalFilter);

      return () => {
        abortController.abort();
      };
    }, TimeConvert.MILLISECONDS_IN_MILLISECONDS * 1000),
  );

  const resetForm = async () => {
    flatMapStore.removePolygonSelectedArea();
    flatMapStore.clearGeometryOnMarkerAndPolygon();
    formMethods.reset();
    getValues('city').length === 1 && (await cityStore.fetchMetroStationByCityId(getValues('city')[0]));

    applyFilter(!isOpenModalFilter);
  };

  const saveFilter = async () => {
    const status = await userStore.saveFilter({
      filter: {
        ...filters,
        ...flatMapStore.getGeometryAndZoomObject(),
      },
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
    handleOpenModalFilter(true);
  };

  useEffect(() => {
    loadFlatsWithDebounce();

    const watchCallback = watch(() => {
      loadFlatsWithDebounce();
    });

    return () => {
      watchCallback.unsubscribe();
    };
  }, [watch, isOpenModalFilter, isErrorForm]);

  return (
    <FormProvider {...formMethods}>
      <Stack flexDirection={'row'} gap={'16px'} alignItems={'center'} sx={{ width: '100%' }}>
        <ButtonsContainer>
          <SelectFlatRoomCount color={theme.palette.text.primary} height={'40px'} />
        </ButtonsContainer>
        <FloorInput
          id={'floor'}
          width={'90px'}
          size={Size.SMALL}
          label={'Этаж'}
          startAdornment={'от'}
          endAdornment={'до'}
          nameFrom={FlatFilters.FLOOR_FROM}
          nameTo={FlatFilters.FLOOR_TO}
        />
        <UIInputFilters
          id={'area'}
          width={'100px'}
          size={Size.SMALL}
          label={'Площ., м²'}
          startAdornment={'от'}
          endAdornment={'до'}
          nameFrom={FlatFilters.AREA_FROM}
          nameTo={FlatFilters.AREA_TO}
          maxValue={NumericLimitsFlatFilter.AREA}
        />
        <UIInputFilters
          id={'price'}
          width={'160px'}
          size={Size.SMALL}
          label={'Цена, ₽'}
          startAdornment={'от'}
          endAdornment={'до'}
          nameFrom={FlatFilters.PRICE_FROM}
          nameTo={FlatFilters.PRICE_TO}
          maxValue={NumericLimitsFlatFilter.PRICE}
        />
        <Box display={'flex'} alignItems={'center'} gap={'4px'} className={'statuses'}>
          <FormControl>
            <StatusMultiSelect
              name={FlatFilters.STATUS}
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

export default observer(FlatFilterButtons);
