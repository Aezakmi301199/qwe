import Header from '../../components/header/header';
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import { TabLink } from '../../shared/enums/tab-link.enum';
import UITabControl from '../../components/tabs/tab-control';
import { PagePath } from '../../shared/enums/page-path';
import { realEstateTabData } from '../../shared/tab/real-estate-tab-data';
import SubscriptionPlanAlert from '../../shared/ui-kit/subscription-plan-alert/subscription-plan-alert';
import { userStore } from '../../user-store.context';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { useUser } from '../../user-context';

type LayoutProps = {
  selectedTab: TabLink;
  setSelectedTab: (selectedTab: TabLink) => void;
  handleTabChange: (newTabId: TabLink) => void;
};

const Layout: React.FC<LayoutProps> = ({ selectedTab, setSelectedTab, handleTabChange }) => {
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
      <Stack>
        {!isLoginPage && (
          <Box>
            <Header />
            <UITabControl
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              handleTabChange={handleTabChange}
              tabData={realEstateTabData}
            />
          </Box>
        )}
        <Outlet />
      </Stack>
    </>
  );
};

export default Layout;
