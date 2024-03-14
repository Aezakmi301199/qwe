import React from 'react';
import { Stack, Typography } from '@mui/material';
import { PrimaryTypography } from '../../../features/account/ui/ui';
import { FontSize } from '../../enums/font-size.enum';
import { theme } from '../../../app/providers/theme';

type NoDataNotificationProps = {
  descriptionPrimary: string;
  descriptionSecondary: string;
};

const NoDataNotification: React.FC<NoDataNotificationProps> = ({ descriptionPrimary, descriptionSecondary }) => {
  return (
    <Stack sx={{ padding: '24px 0', gap: '48px' }}>
      <Stack sx={{ gap: '10px' }}>
        <PrimaryTypography>{descriptionPrimary}</PrimaryTypography>
        <Typography fontSize={FontSize.SIXTEENTH_FONT} color={theme.palette.text.primary}>
          {descriptionSecondary}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default NoDataNotification;
