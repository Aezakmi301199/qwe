import React, { useEffect, useState } from 'react';
import { InitialState } from '../../../../../shared/enums/pagination.enum';
import { Box, Stack, Typography } from '@mui/material';
import UISavedFilterList from '../../../../../components/modals/modal-saved-filter';
import { theme } from '../../../../../app/providers/theme';
import { FontSize } from '../../../../../shared/enums/font-size.enum';
import { FontWeight } from '../../../../../shared/enums/font-weight.enum';
import SubscriptionModal from '../../../../../components/modals/subscription-modal';
import { useRootStore } from '../../../../../root-store.context';
import { useUserStore } from '../../../../../user-store.context';
import { RealEstateTypeUpperCase } from '../../../../../shared/enums/real-estate-type-upper-case.enum';
import { observer } from 'mobx-react';
import { calculateOffset } from '../../../../../shared/lib/calculate-offset';

const HouseSubscriptionList = observer(() => {
  const { houseStore } = useRootStore();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const userStore = useUserStore();

  useEffect(() => {
    userStore.fetchRealEstateFilterData(RealEstateTypeUpperCase.HOUSE);
  }, []);

  return (
    <>
      {!userStore.isUserFilterLoading ? (
        <Box>
          <Stack
            gap={'8px'}
            overflow={'auto'}
            height={`calc(100dvh - ${calculateOffset(showSubscriptionModal, userStore.activeUserFiltersCount)}px)`}
          >
            {userStore.userFilters.length ? (
              <>
                {userStore.userFilters.map((filter, index) => {
                  return (
                    <UISavedFilterList
                      isCheckboxDisabled={
                        userStore.activeUserFiltersCount >= InitialState.FIVE && !filter.isNotificationEnabled
                      }
                      handleDeleteFilter={userStore.deleteFilter}
                      filter={filter}
                      realEstateStore={houseStore}
                      handleClose={() => {
                        return;
                      }}
                      isRecentlyAdded={index === 0 && userStore.isFilterRecentlyAdded}
                    />
                  );
                })}
              </>
            ) : (
              <Typography
                color={theme.palette.text.primary}
                fontSize={FontSize.TWENTY_FONT}
                fontWeight={FontWeight.SEMI_BOLD}
              >
                Вы еще не подписались ни на один поиск
              </Typography>
            )}
          </Stack>
          <SubscriptionModal isOpen={showSubscriptionModal} handleClose={() => setShowSubscriptionModal(false)} />
        </Box>
      ) : null}
    </>
  );
});

export default HouseSubscriptionList;
