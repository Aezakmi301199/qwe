import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { TitleTypography } from '../ui/ui';
import { observer } from 'mobx-react';
import TabsUI from '../../../shared/ui-kit/tab-control/tabs';
import { TabLink } from '../../../shared/enums/tab-link.enum';
import HouseCallTable from './call-tables/house/house-call-table';
import FlatCallTable from './call-tables/flat/flat-call-table';
import LandCallTable from './call-tables/land/land-call-table';
import PlusBanner from '../../../shared/ui-kit/plus-banner/plus-banner';
import { useUser } from '../../../user-context';
import { SnackbarMessage } from '../../../shared/enums/snackbar-message';
import { userStore } from '../../../user-store.context';
import { useRootStore } from '../../../root-store.context';

const CallHistory = observer(() => {
  const [value, setValue] = useState<TabLink>(TabLink.FLATS);
  const { catalogStore } = useRootStore();
  const user = useUser();
  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    catalogStore.findDomains();
    catalogStore.fetchStatuses();
    userStore.findSubscriptionPlanById(user.id);
  }, []);

  return (
    <Stack width={'800px'}>
      <TitleTypography>История звонков</TitleTypography>
      <Box marginTop={'40px'}>
        {user.subscriptionPlan.isDefault ? <PlusBanner text={SnackbarMessage.RECOGNITION_TEXT} /> : null}
        <TabsUI value={value} setValue={setValue} handleChange={handleChange} margin={'0px'} />
        {value === TabLink.FLATS && <FlatCallTable />}
        {value === TabLink.HOUSES && <HouseCallTable />}
        {value === TabLink.LANDS && <LandCallTable />}
      </Box>
    </Stack>
  );
});

export default CallHistory;
