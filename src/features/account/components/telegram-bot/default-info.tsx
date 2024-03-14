import React, { useEffect } from 'react';
import { GetPlusButtonModal } from '../../ui/ui';
import { Stack, Typography } from '@mui/material';
import { theme } from '../../../../app/providers/theme';
import { FontSize } from '../../../../shared/enums/font-size.enum';
import { userStore } from '../../../../user-store.context';
import { Link } from 'react-router-dom';
import { PagePath } from '../../../../shared/enums/page-path';
import { TimeConvert } from '../../../../shared/enums/time-convert.enum';
import { observer } from 'mobx-react';

const DefaultInfo = () => {
  useEffect(() => {
    const prepareData = async () => {
      if (!userStore.subscriptionPlans.length) {
        await userStore.fetchSubscriptionPlan();
      }
    };

    prepareData();
  }, []);

  return (
    <Stack gap={'4px'}>
      <Link to={PagePath.ACCOUNT_TARIFFS}>
        <GetPlusButtonModal>
          Подключить за {Math.round(userStore.subscriptionPlans[0].price / TimeConvert.MONTHS_IN_ONE_YEAR)} ₽/мес.
        </GetPlusButtonModal>
      </Link>
      <Typography sx={{ textAlign: 'center' }} color={theme.palette.text.secondary} fontSize={FontSize.FOURTEENTH_FONT}>
        Необходима подписка RHOOD Plus
      </Typography>
    </Stack>
  );
};

export default observer(DefaultInfo);
