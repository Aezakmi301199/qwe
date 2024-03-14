import React, { ReactElement, useEffect, useState } from 'react';
import { Alert, Modal, Stack } from '@mui/material';
import { styleFilterModal } from '../../shared/styles/modal-styles';
import 'dayjs/locale/ru';
import UITabControlModal from '../tabs/ui-tab-control-modal';
import { ModalTab } from '../../shared/enums/modal-tab.enum';
import { useRootStore } from '../../root-store.context';
import { observer } from 'mobx-react';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import UISavedFilterList from './modal-saved-filter';
import { useUserStore } from '../../user-store.context';
import { Store } from '../../shared/lib/store';
import { Flat } from '../../entities/real-estate/flat';
import { House } from '../../entities/real-estate/house';
import { Land } from '../../entities/real-estate/land';
import { InitialState } from '../../shared/enums/pagination.enum';
import InfoIcon from '@mui/icons-material/Info';
import { AlertTypography } from '../../features/account/ui/ui';
import { SpinnerUiProvider } from '../../shared/ui-kit/spinner/spinner';

type ModalFiltersProps = {
  height: string;
  realEstateType: RealEstateTypeUpperCase;
  isOpen: boolean;
  handleClose: ({ currentTab, isClickedReset }: { currentTab: ModalTab; isClickedReset: boolean }) => void;
  currentTab: ModalTab;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
  renderFullFilter: ({
    setClickedReset,
  }: {
    setClickedReset: React.Dispatch<React.SetStateAction<boolean>>;
  }) => ReactElement;
  realEstateStore: Store<Flat | House | Land>;
};

const FilterModal: React.FC<ModalFiltersProps> = observer(
  ({ isOpen, handleClose, currentTab, setCurrentTab, renderFullFilter, realEstateType, height, realEstateStore }) => {
    const [isClickedReset, setClickedReset] = useState<boolean>(false);
    const { cityStore, catalogStore } = useRootStore();
    const userStore = useUserStore();

    const fetchData = async () => {
      if (!cityStore.city.length) {
        await cityStore.fetchData();
      }

      if (!catalogStore.domains.length) {
        await catalogStore.fetchDomains();
      }

      await userStore.fetchSubscriptionPlan();
      await userStore.fetchActiveFiltersCount();
      await userStore.fetchRealEstateFilterData(realEstateType);
    };

    useEffect(() => {
      fetchData();
    }, [currentTab]);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
      event.stopPropagation();
      setCurrentTab(newValue);
    };

    return (
      <Modal open={isOpen} onClose={() => handleClose({ currentTab, isClickedReset })}>
        <Stack minHeight={height} maxHeight={height} sx={styleFilterModal}>
          <UITabControlModal
            currentTab={currentTab}
            handleChangeTab={handleChangeTab}
            handleClose={() => handleClose({ currentTab, isClickedReset })}
          />
          {currentTab === ModalTab.FILTERS && renderFullFilter({ setClickedReset })}
          {currentTab === ModalTab.SAVED_FILTERS ? (
            <>
              {userStore.activeUserFiltersCount >= InitialState.FIVE && (
                <Alert severity='info' icon={<InfoIcon color={'info'} />}>
                  <AlertTypography>Вы подписались на максимальное число поисков</AlertTypography>
                </Alert>
              )}
              <SpinnerUiProvider
                statePending={!userStore.userFilters.length}
                children={
                  <Stack gap={'8px'} overflow={'auto'}>
                    {userStore.userFilters.map((filter, index) => {
                      return (
                        <UISavedFilterList
                          setCurrentTab={setCurrentTab}
                          filter={filter}
                          handleDeleteFilter={userStore.deleteFilter}
                          realEstateStore={realEstateStore}
                          isCheckboxDisabled={
                            userStore.activeUserFiltersCount >= InitialState.FIVE && !filter.isNotificationEnabled
                          }
                          handleClose={() =>
                            handleClose({
                              currentTab,
                              isClickedReset,
                            })
                          }
                          isRecentlyAdded={index === 0 && userStore.isFilterRecentlyAdded}
                        />
                      );
                    })}
                  </Stack>
                }
              />
            </>
          ) : null}
        </Stack>
      </Modal>
    );
  },
);

export default FilterModal;
