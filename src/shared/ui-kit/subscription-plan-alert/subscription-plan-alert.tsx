import React from 'react';
import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';
import { FontFamily } from '../../enums/font-family.enum';
import { FontSize } from '../../enums/font-size.enum';
import { Close, ErrorOutlineRounded, WarningAmberRounded } from '@mui/icons-material';
import { theme } from '../../../app/providers/theme';
import { getItemDeclension } from '../../lib/get-item-declension';
import { Link } from 'react-router-dom';
import { PagePath } from '../../enums/page-path';
import { LocalStorageName } from '../../enums/local-storage';

type SubscriptionPlanAlertProps = {
  isLastDay: boolean;
  daysLeft: number;
  setIsSubscriptionPlanAlertClosed: React.Dispatch<React.SetStateAction<boolean>>;
};

const SubscriptionPlanAlert: React.FC<SubscriptionPlanAlertProps> = ({
  isLastDay,
  daysLeft,
  setIsSubscriptionPlanAlertClosed,
}) => {
  const Icon = isLastDay ? ErrorOutlineRounded : WarningAmberRounded;
  const backgroundColor = isLastDay ? '#EE4343' : '#F77518';
  const setAlertClosed = () => {
    localStorage.setItem(LocalStorageName.IS_SUBSCRIPTION_PLAN_ALERT_CLOSED, JSON.stringify(true));
    setIsSubscriptionPlanAlertClosed(true);
  };
  const dayWordVariation = ['день', 'дня', 'дней'];
  const dayWord = getItemDeclension(daysLeft, dayWordVariation);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: backgroundColor,
        padding: '4px 16px',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Icon sx={{ color: theme.palette.common.white, width: '20px', height: '20px' }} />
        <Typography
          fontFamily={FontFamily.ROBOTO}
          fontSize={FontSize.FOURTEENTH_FONT}
          color={theme.palette.common.white}
        >
          До окончания подписки RHOOD Plus {dayWord}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Link to={PagePath.ACCOUNT_TARIFFS}>
          <Button
            variant={'outlined'}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              border: '1px solid white',
              color: theme.palette.common.white,
              padding: '4px 10px',
              height: '30px',
              '&:hover': {
                backgroundColor: '#FFFFFF0A',
                border: '1px solid white',
              },
            }}
          >
            Продлить
          </Button>
        </Link>
        <Close
          sx={{ color: theme.palette.common.white, width: '20px', height: '20px', cursor: 'pointer' }}
          onClick={setAlertClosed}
        ></Close>
      </Box>
    </Box>
  );
};

export default SubscriptionPlanAlert;
