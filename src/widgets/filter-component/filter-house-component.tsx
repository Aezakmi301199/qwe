import { Box } from '@mui/material';
import { useState } from 'react';
import FilterModal from '../../components/modals/filter-modal';
import { HouseFullFilterForm } from '../../features/house/house-full-filter-form';
import { useRootStore } from '../../root-store.context';
import { GroupButton } from '../../shared/styles/styles';
import { observer } from 'mobx-react';
import {
  compareFullHouseFilter,
  getDefaultHouseFilter,
  HouseFilterType,
  trimNotPartialHouseFilter,
  useHouseFilters,
  UseHouseFiltersContext,
} from '../../entities/real-estate/house';
import equal from 'fast-deep-equal';
import { BadgeFilter, trimFilters } from '../../entities/real-estate';
import { ModalTab } from '../../shared/enums/modal-tab.enum';
import { InitialState } from '../../shared/enums/pagination.enum';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import { BorderLinearProgress } from '../../shared/ui-kit/progress/border-linear-progress';
import { sortByAlphabet } from '../../shared/lib/sort-by-alphabet';
import { SnackbarMessage } from '../../shared/enums/snackbar-message';
import SnackbarNotify from '../../shared/ui-kit/snackbar/snackbar-shared';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import HouseFilterButtons from '../../features/house/house-filter-buttons';
import { userStore } from '../../user-store.context';

const compareHouseFilter = (filters: HouseFilterType) => {
  if (!filters) {
    return false;
  }

  const copyFilters = { ...filters, domain: sortByAlphabet(filters.domain) };
  const copyDefaultFilters = { ...getDefaultHouseFilter(), domain: sortByAlphabet(getDefaultHouseFilter().domain) };

  return equal(trimNotPartialHouseFilter(copyFilters), trimNotPartialHouseFilter(copyDefaultFilters));
};

export const FilterHouseComponent = observer(() => {
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [isExist, setIsExist] = useState<boolean>(false);
  const [isFilterLimitReached, setIsFilterLimitReached] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<ModalTab>(ModalTab.FILTERS);
  const handleOpenModalFilter = () => setIsOpenModalFilter(true);
  const handleCloseModalFilter = () => setIsOpenModalFilter(false);
  const { houseStore, houseMapStore } = useRootStore();
  const filterMethods = useHouseFilters();
  const { getValues, resetToCurrentFilter, filters, handleSubmit } = filterMethods;
  const { setItemStorage } = useLocalStorage(LocalStorageName.HOUSE_FILTER);

  const applyFilter = (canApplyFilter: boolean) => {
    houseStore.setChangingFilter(false);
    handleSubmit(() => {
      const isSameFilter = compareFullHouseFilter(houseStore.currentFilter as HouseFilterType, getValues());
      const trimmedFilter = trimFilters(getValues());

      if (isSameFilter || !canApplyFilter) {
        return;
      }

      houseStore.setCurrentFilter(trimmedFilter);
      houseStore.setPage(InitialState.FIRST);
      setItemStorage(trimmedFilter);
    })();
  };

  const applyFilterInModal = () => {
    applyFilter(true);
    handleCloseModalFilter();
  };

  const closeModal = (currentTab: ModalTab, isClickedReset: boolean, isErrorForm: boolean) => {
    const isSameFilter = compareFullHouseFilter(houseStore.currentFilter as HouseFilterType, filterMethods.filters);

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
        <UseHouseFiltersContext.Provider value={filterMethods}>
          <HouseFilterButtons
            buttonFilterModal={<BadgeFilter onClick={handleOpenModalFilter} invisible={compareHouseFilter(filters)} />}
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
            realEstateType={RealEstateTypeUpperCase.HOUSE}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            renderFullFilter={({ setClickedReset }) => (
              <HouseFullFilterForm
                setIsExist={setIsExist}
                setIsOpenSnackbar={setIsOpenSnackbar}
                setCurrentTab={setCurrentTab}
                applyFilter={applyFilterInModal}
                setClickedReset={setClickedReset}
                setIsFilterLimitReached={setIsFilterLimitReached}
              />
            )}
            isOpen={isOpenModalFilter}
            handleClose={({ currentTab, isClickedReset }) =>
              closeModal(currentTab, isClickedReset, filterMethods.isErrorForm)
            }
            realEstateStore={houseStore}
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
        </UseHouseFiltersContext.Provider>
      </GroupButton>
      <Box sx={{ width: '100%' }}>
        <BorderLinearProgress visible={houseStore.loading && !isOpenModalFilter} />
      </Box>
    </>
  );
});
