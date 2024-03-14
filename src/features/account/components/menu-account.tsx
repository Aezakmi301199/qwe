import React from 'react';
import { Box } from '@mui/material';
import { CurrencyRubleOutlined, NotificationsNone, PhoneOutlined } from '@mui/icons-material';
import RhoodIcon from './custom-icons/rhood-icon';
import TelegramIcon from './custom-icons/telegram-icon';
import { NavigateTypography } from '../ui/ui';
import { theme } from '../../../app/providers/theme';
import { PagePath } from '../../../shared/enums/page-path';
import { Link, useLocation } from 'react-router-dom';
import { AccountMenu } from '../../../shared/enums/account-menu.enum';

const MenuAccount = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box display={'flex'} flexDirection={'column'} width={'260px'} height={'100%'}>
      <Link to={PagePath.ACCOUNT_SUBSCRIPTIONS} style={{ textDecoration: 'none' }}>
        <NavigateTypography
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: isActive(PagePath.ACCOUNT_SUBSCRIPTIONS)
              ? `${theme.palette.secondary.main} !important`
              : 'transparent',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(19, 29, 53, 0.04)',
            },
          }}
        >
          <NotificationsNone opacity={isActive(PagePath.ACCOUNT_SUBSCRIPTIONS) ? '1' : '0.54'} />
          {AccountMenu.SUBSCRIPTIONS}
        </NavigateTypography>
      </Link>
      <Link to={PagePath.ACCOUNT_TARIFFS}>
        <NavigateTypography
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: isActive(PagePath.ACCOUNT_TARIFFS)
              ? `${theme.palette.secondary.main} !important`
              : 'transparent',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(19, 29, 53, 0.04)',
            },
          }}
        >
          <RhoodIcon opacity={isActive(PagePath.ACCOUNT_TARIFFS) ? '1' : '0.54'} />
          Тарифы
        </NavigateTypography>
      </Link>
      <Link to={PagePath.ACCOUNT_BOT}>
        <NavigateTypography
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: isActive(PagePath.ACCOUNT_BOT)
              ? `${theme.palette.secondary.main} !important`
              : 'transparent',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(19, 29, 53, 0.04)',
            },
          }}
        >
          <TelegramIcon opacity={isActive(PagePath.ACCOUNT_BOT) ? '1' : '0.54'} />
          Чат-бот
        </NavigateTypography>
      </Link>
      <Link to={PagePath.ACCOUNT_CALLS}>
        <NavigateTypography
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: isActive(PagePath.ACCOUNT_CALLS)
              ? `${theme.palette.secondary.main} !important`
              : 'transparent',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(19, 29, 53, 0.04)',
            },
          }}
        >
          <PhoneOutlined opacity={isActive(PagePath.ACCOUNT_CALLS) ? '1' : '0.54'} />
          История звонков
        </NavigateTypography>
      </Link>
      <Link to={PagePath.ACCOUNT_PAYMENTS}>
        <NavigateTypography
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: isActive(PagePath.ACCOUNT_PAYMENTS)
              ? `${theme.palette.secondary.main} !important`
              : 'transparent',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(19, 29, 53, 0.04)',
            },
          }}
        >
          <CurrencyRubleOutlined opacity={isActive(PagePath.ACCOUNT_PAYMENTS) ? '1' : '0.54'} />
          История платежей
        </NavigateTypography>
      </Link>
    </Box>
  );
};

export default MenuAccount;
