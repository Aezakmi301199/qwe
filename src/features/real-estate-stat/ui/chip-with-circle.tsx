import { Box, SxProps, Typography, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';
import { primary } from '../../../shared/colors';
import { Skeleton } from '../../../shared/ui-kit/skeleton/skeleton';

type ChipWithCircleProps = {
  text?: string;
  circle: {
    width: string;
    height: string;
    color: string;
  };
  onClick?: () => void;
  isLineThrough?: boolean;
  isLoading?: ReactNode;
  sx?: SxProps;
};

export const ChipWithCircle: React.FC<ChipWithCircleProps> = ({
  text,
  circle = { width: '16px', height: '16px', color: primary[400] },
  isLineThrough,
  onClick,
  isLoading,
  sx,
}) => {
  const theme = useTheme();

  return (
    <Box
      display={'flex'}
      padding={'0px'}
      alignItems={'center'}
      gap={theme.custom.base.module.first}
      sx={{ cursor: 'pointer', textDecoration: isLineThrough ? 'line-through' : '', ...sx }}
      onClick={onClick}
    >
      <Box
        display={'block'}
        sx={{
          width: circle.width,
          height: circle.height,
          display: 'flex',
          background: circle.color,
          borderRadius: '50%',
        }}
      />
      {isLoading ? (
        <Skeleton width={'100px'} height={theme.custom.base.module.third} />
      ) : (
        <Typography
          variant={'body2'}
          color={theme.palette.text.primary}
          children={text}
          sx={{ pointerEvents: 'none' }}
        />
      )}
    </Box>
  );
};
