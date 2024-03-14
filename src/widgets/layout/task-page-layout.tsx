import Header from '../../components/header/header';
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import { PagePath } from '../../shared/enums/page-path';
import { userStore } from '../../user-store.context';
import { LocalStorageName } from '../../shared/enums/local-storage';
import SubscriptionPlanAlert from '../../shared/ui-kit/subscription-plan-alert/subscription-plan-alert';
import { useUser } from '../../user-context';

const TaskPageLayout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === PagePath.LOGIN;
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
      <Stack height={'inherit'}>
        {!isLoginPage && (
          <Box>
            <Header />
          </Box>
        )}
        <Outlet />
      </Stack>
    </>
  );
};

export default TaskPageLayout;
