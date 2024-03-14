import React from 'react';
import { Stack, SxProps, Typography } from '@mui/material';
import { theme } from '../../../app/providers/theme';

type LabelContainerProps = {
  label: string;
  secondary?: string;
  width?: string;
  noWrap?: boolean;
};

const LabelContainer: React.FC<LabelContainerProps> = ({ label, secondary, width = 'auto', noWrap = true }) => {
  return (
    <Stack sx={{ width: width }}>
      <Typography color={theme.palette.text.primary} variant={'body2Medium'} noWrap={noWrap}>
        {label}
      </Typography>
      {secondary ? (
        <Typography color={theme.palette.text.secondary} variant={'body2'} noWrap>
          {secondary}
        </Typography>
      ) : noWrap ? (
        <Typography variant={'body2'} noWrap>
          &nbsp;
        </Typography>
      ) : null}
    </Stack>
  );
};

export default LabelContainer;
