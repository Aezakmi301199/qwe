import { Box } from '@mui/material';
import React, { useState } from 'react';
import { useRootStore } from '../../root-store.context';
import { GroupButton } from '../../shared/styles/styles';
import { observer } from 'mobx-react';
import {
  compareFullLandFilter,
  getDefaultLandFilter,
  LandFilterType,
  trimNotPartialLandFilter,
  useLandFilters,
  UseLandFiltersContext,
} from '../../entities/real-estate/land';
import equal from 'fast-deep-equal';
import { BadgeFilter, trimFilters } from '../../entities/real-estate';
import { InitialState } from '../../shared/enums/pagination.enum';
import { LocalStorageName } from '../../shared/enums/local-storage';
import FilterModal from '../../components/modals/filter-modal';
import { LandFullFilterForm } from '../../features/land/land-full-filter-form';
import { ModalTab } from '../../shared/enums/modal-tab.enum';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import { BorderLinearProgress } from '../../shared/ui-kit/progress/border-linear-progress';
import { sortByAlphabet } from '../../shared/lib/sort-by-alphabet';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { SnackbarMessage } from '../../shared/enums/snackbar-message';
import SnackbarNotify from '../../shared/ui-kit/snackbar/snackbar-shared';
import LandFilterButtons from '../../features/land/land-filter-buttons';
import { userStore } from '../../user-store.context';

const compareLandFilter = (filters: LandFilterType) => {
  if (!filters) {
    return false;
  }

  const copyFilters = { ...filters, domain: sortByAlphabet(filters.domain) };
  const copyDefaultFilters = { ...getDefaultLandFilter(), domain: sortByAlphabet(getDefaultLandFilter().domain) };

  return equal(trimNotPartialLandFilter(copyFilters), trimNotPartialLandFilter(copyDefaultFilters));
};

export const FilterLandComponent = observer(() => {
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [isExist, setIsExist] = useState<boolean>(false);
  const [isFilterLimitReached, setIsFilterLimitReached] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<ModalTab>(ModalTab.FILTERS);
  const handleOpenModalFilter = () => setIsOpenModalFilter(true);
  const handleCloseModalFilter = () => setIsOpenModalFilter(false);
  const { landStore } = useRootStore();
  const filterMethods = useLandFilters();
  const { getValues, resetToCurrentFilter, filters, handleSubmit } = filterMethods;
  const { setItemStorage } = useLocalStorage(LocalStorageName.LAND_FILTER);

  const applyFilter = (canApplyFilter: boolean) => {
    landStore.setChangingFilter(false);
    handleSubmit(() => {
      const isSameFilter = compareFullLandFilter(landStore.currentFilter as LandFilterType, getValues());

      if (isSameFilter || !canApplyFilter) {
        return;
      }

      const trimmedFilter = trimFilters(getValues());

      landStore.setCurrentFilter(trimmedFilter);
      landStore.setPage(InitialState.FIRST);
      setItemStorage(trimmedFilter);
    })();
  };

  const applyFilterInModal = () => {
    applyFilter(true);
    handleCloseModalFilter();
  };

  const closeModal = (currentTab: ModalTab, isClickedReset: boolean, isErrorForm: boolean) => {
    const isSameFilter = compareFullLandFilter(landStore.currentFilter as LandFilterType, filterMethods.filters);

    if (!isSameFilter && isClickedReset && currentTab === ModalTab.FILTERS && !isErrorForm) {
      applyFilter(true);
      handleCloseModalFilter();

      return;
    }

    resetToCurrentFilter();
    setCurrentTab(ModalTab.FILTERS);
    handleCloseModalFilter();
    userStore.isFilterRecentlyAdded = false;
  };

  return (
    <>
      <GroupButton>
        <UseLandFiltersContext.Provider value={filterMethods}>
          <LandFilterButtons
            buttonFilterModal={<BadgeFilter onClick={handleOpenModalFilter} invisible={compareLandFilter(filters)} />}
            applyFilter={applyFilter}
            isOpenModalFilter={isOpenModalFilter}
            setIsOpenSnackbar={setIsOpenSnackbar}
            setIsExist={setIsExist}
            handleOpenModalFilter={handleOpenModalFilter}
            setCurrentTab={setCurrentTab}
            setIsFilterLimitReached={setIsFilterLimitReached}
          />
          <FilterModal
            height={'552px'}
            realEstateType={RealEstateTypeUpperCase.LAND}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            renderFullFilter={({ setClickedReset }) => (
              <LandFullFilterForm
                setCurrentTab={setCurrentTab}
                applyFilter={applyFilterInModal}
                setClickedReset={setClickedReset}
                setIsFilterLimitReached={setIsFilterLimitReached}
                setIsOpenSnackbar={setIsOpenSnackbar}
                setIsExist={setIsExist}
              />
            )}
            isOpen={isOpenModalFilter}
            handleClose={({ currentTab, isClickedReset }) =>
              closeModal(currentTab, isClickedReset, filterMethods.isErrorForm)
            }
            realEstateStore={landStore}
          />
          <SnackbarNotify
            message={isExist ? SnackbarMessage.IS_EXIST : SnackbarMessage.NOT_CORRECT_FILTER}
            isOpenSnackBar={isOpenSnackbar}
            handleCloseSnackBar={() => setIsOpenSnackbar(false)}
          />
          <SnackbarNotify
            message={SnackbarMessage.USER_FILTER_LIMIT_REACHED}
            isOpenSnackBar={isFilterLimitReached}
            handleCloseSnackBar={() => setIsFilterLimitReached(false)}
          />
        </UseLandFiltersContext.Provider>
      </GroupButton>
      <Box sx={{ width: '100%' }}>
        <BorderLinearProgress visible={landStore.loading && !isOpenModalFilter} />
      </Box>
    </>
  );
});
