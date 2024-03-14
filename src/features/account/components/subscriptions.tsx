import React, { useEffect, useState } from 'react';
import { Alert, Box, Stack, Typography } from '@mui/material';
import { FontWeight } from '../../../shared/enums/font-weight.enum';
import { FontSize } from '../../../shared/enums/font-size.enum';
import { theme } from '../../../app/providers/theme';
import { AlertTypography, TitleTypography } from '../ui/ui';
import { FontFamily } from '../../../shared/enums/font-family.enum';
import { useRootStore } from '../../../root-store.context';
import { observer } from 'mobx-react';
import PlusBanner from '../../../shared/ui-kit/plus-banner/plus-banner';
import { useUser } from '../../../user-context';
import { SnackbarMessage } from '../../../shared/enums/snackbar-message';
import TabsUI from '../../../shared/ui-kit/tab-control/tabs';
import { TabLink } from '../../../shared/enums/tab-link.enum';
import FlatSubscriptionList from './subscription-lists/flat/flat-subscription-list';
import HouseSubscriptionList from './subscription-lists/house/house-subscription-list';
import LandSubscriptionList from './subscription-lists/land/land-subscription-list';
import { AccountMenu } from '../../../shared/enums/account-menu.enum';
import { InitialState } from '../../../shared/enums/pagination.enum';
import InfoIcon from '@mui/icons-material/Info';
import { useUserStore } from '../../../user-store.context';
import { BorderLinearProgress } from '../../../shared/ui-kit/progress/border-linear-progress';

const Subscriptions = observer(() => {
  const [value, setValue] = useState<TabLink>(TabLink.FLATS);
  const { cityStore, catalogStore } = useRootStore();
  const user = useUser();
  const userStore = useUserStore();
  const fetchData = async () => {
    await cityStore.fetchData();
    await catalogStore.fetchDomains();
    await userStore.fetchActiveFiltersCount();
    await userStore.fetchSubscriptionPlan();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack width={'800px'} overflow={'auto'}>
      <Box display={'flex'} flexDirection={'column'} gap={'8px'} paddingBottom={'24px'}>
        <TitleTypography>{AccountMenu.SUBSCRIPTIONS}</TitleTypography>
        <Typography
          fontFamily={FontFamily.ROBOTO}
          fontWeight={FontWeight.REGULAR}
          fontSize={FontSize.FOURTEENTH_FONT}
          color={theme.palette.text.secondary}
        >
          Подписаться можно на 5 поисков
        </Typography>
      </Box>
      {user?.subscriptionPlan.isDefault ? <PlusBanner text={SnackbarMessage.NEW_TELEGRAM_OBJECT} /> : null}
      {userStore.activeUserFiltersCount >= InitialState.FIVE && (
        <Alert severity='info' icon={<InfoIcon color={'info'} />}>
          <AlertTypography>Вы подписались на максимальное число поисков</AlertTypography>
        </Alert>
      )}
      <TabsUI value={value} setValue={setValue} handleChange={handleChange} />
      <BorderLinearProgress visible={userStore.isUserFilterLoading} />

      {value === TabLink.FLATS && <FlatSubscriptionList />}
      {value === TabLink.HOUSES && <HouseSubscriptionList />}
      {value === TabLink.LANDS && <LandSubscriptionList />}
    </Stack>
  );
});

export default Subscriptions;
