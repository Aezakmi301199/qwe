import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/header/header';
import MenuAccount from '../../features/account/components/menu-account';
import { Box, Stack } from '@mui/material';
import SubscriptionPlanAlert from '../../shared/ui-kit/subscription-plan-alert/subscription-plan-alert';
import { userStore } from '../../user-store.context';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { useUser } from '../../user-context';

const AccountLayout: React.FC = () => {
  const user = useUser();
  const { isSubscriptionPlanExpiring, isLastDay, subscriptionPlanDaysLeft } =
    userStore.isSubscriptionPlanExpiring(user);
  const isSubscriptionPlanAlertClosedData = localStorage.getItem(LocalStorageName.IS_SUBSCRIPTION_PLAN_ALERT_CLOSED);
  const isSubscriptionPlanAlertClosedValue = JSON.parse(isSubscriptionPlanAlertClosedData ?? String(false));
  const [isSubscriptionPlanAlertClosed, setIsSubscriptionPlanAlertClosed] = useState<boolean>(
    isSubscriptionPlanAlertClosedValue,
  );

  return (
    <>
      {!isSubscriptionPlanAlertClosed && isSubscriptionPlanExpiring && subscriptionPlanDaysLeft && (
        <SubscriptionPlanAlert
          daysLeft={subscriptionPlanDaysLeft}
          isLastDay={isLastDay}
          setIsSubscriptionPlanAlertClosed={setIsSubscriptionPlanAlertClosed}
        ></SubscriptionPlanAlert>
      )}
      <Header />
      <Stack padding={'24px'} flexDirection={'row'}>
        <MenuAccount />
        <Box
          id={'ratesParent'}
          flex={1}
          width={'100%'}
          display={'flex'}
          justifyContent={'center'}
          padding={'0 24px'}
          overflow={'overlay'}
        >
          <Outlet />
        </Box>
      </Stack>
    </>
  );
};

export default AccountLayout;
