import { Box } from '@mui/material';
import { useState } from 'react';
import FlatFilterButtons from '../../features/flat/flat-filter-buttons';
import { GroupButton } from '../../shared/styles/styles';
import {
  compareFullFlatFilter,
  FlatFilterType,
  getDefaultFlatFilter,
  trimNotPartialFlatFilter,
  useFlatFilters,
  UseFlatFiltersContext,
} from '../../entities/real-estate/flat';
import { useRootStore } from '../../root-store.context';
import { observer } from 'mobx-react';
import equal from 'fast-deep-equal';
import { BadgeFilter, trimFilters } from '../../entities/real-estate';
import FilterModal from '../../components/modals/filter-modal';
import { FlatFullFilterForm } from '../../features/flat/flat-full-filter-form';
import { ModalTab } from '../../shared/enums/modal-tab.enum';
import { BorderLinearProgress } from '../../shared/ui-kit/progress/border-linear-progress';
import { sortByAlphabet } from '../../shared/lib/sort-by-alphabet';
import { SnackbarMessage } from '../../shared/enums/snackbar-message';
import SnackbarNotify from '../../shared/ui-kit/snackbar/snackbar-shared';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { InitialState } from '../../shared/enums/pagination.enum';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { userStore } from '../../user-store.context';

const compareFlatFilter = (filters: FlatFilterType) => {
  if (!filters) {
    return false;
  }

  const copyFilters = { ...filters, domain: sortByAlphabet(filters.domain) };
  const copyDefaultFilters = { ...getDefaultFlatFilter(), domain: sortByAlphabet(getDefaultFlatFilter().domain) };

  return equal(trimNotPartialFlatFilter(copyFilters), trimNotPartialFlatFilter(copyDefaultFilters));
};

export const FilterFlatComponent = observer(() => {
  const [isOpenModalFilter, setIsOpenModalFilter] = useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [isExist, setIsExist] = useState<boolean>(false);
  const [isFilterLimitReached, setIsFilterLimitReached] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<ModalTab>(ModalTab.FILTERS);
  const handleOpenModalFilter = () => setIsOpenModalFilter(true);
  const handleCloseModalFilter = () => setIsOpenModalFilter(false);
  const { flatStore, flatMapStore } = useRootStore();
  const filterMethods = useFlatFilters();
  const { resetToCurrentFilter, filters, handleSubmit, getValues } = filterMethods;
  const { setItemStorage } = useLocalStorage(LocalStorageName.FLAT_FILTER);

  const applyFilter = (canApplyFilter: boolean) => {
    flatStore.setChangingFilter(false);
    handleSubmit(() => {
      const isSameFilter = compareFullFlatFilter(flatStore.currentFilter as FlatFilterType, getValues());
      const trimmedFilter = trimFilters(getValues());

      if (isSameFilter || !canApplyFilter) {
        return;
      }

      flatStore.setCurrentFilter(trimmedFilter);
      flatStore.setPage(InitialState.FIRST);
      setItemStorage(trimmedFilter);
    })();
  };

  const applyFilterInModal = () => {
    applyFilter(true);
    handleCloseModalFilter();
  };

  const closeModal = (currentTab: ModalTab, isClickedReset: boolean, isErrorForm: boolean) => {
    const isSameFilter = compareFullFlatFilter(flatStore.currentFilter as FlatFilterType, filterMethods.filters);

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
        <UseFlatFiltersContext.Provider value={filterMethods}>
          <FlatFilterButtons
            buttonFilterModal={<BadgeFilter onClick={handleOpenModalFilter} invisible={compareFlatFilter(filters)} />}
            applyFilter={applyFilter}
            isOpenModalFilter={isOpenModalFilter}
            setIsOpenSnackbar={setIsOpenSnackbar}
            setIsExist={setIsExist}
            handleOpenModalFilter={handleOpenModalFilter}
            setCurrentTab={setCurrentTab}
            setIsFilterLimitReached={setIsFilterLimitReached}
          />
          <FilterModal
            height={'619px'}
            realEstateType={RealEstateTypeUpperCase.FLAT}
            setCurrentTab={setCurrentTab}
            currentTab={currentTab}
            renderFullFilter={({ setClickedReset }) => (
              <FlatFullFilterForm
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
            realEstateStore={flatStore}
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
        </UseFlatFiltersContext.Provider>
      </GroupButton>
      <Box sx={{ width: '100%' }}>
        <BorderLinearProgress visible={flatStore.loading && !isOpenModalFilter} />
      </Box>
    </>
  );
});
