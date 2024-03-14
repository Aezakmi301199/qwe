import React, { ReactNode } from 'react';
import { LayoutPageTitle, Text } from '../ui/ui';
import { Typography, useTheme } from '@mui/material';

interface PageTitleProps {
  text: string;
  secondaryText?: string;
  button?: ReactNode;
  color?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ text, secondaryText, button, color }) => {
  const theme = useTheme();

  return (
    <LayoutPageTitle>
      <Text>
        <Typography component={'h5'} variant={'headline5'}>
          {text}
        </Typography>
        {secondaryText && (
          <Typography color={color ?? theme.palette.success.main} variant='body2'>
            {secondaryText}
          </Typography>
        )}
      </Text>
      {button}
    </LayoutPageTitle>
  );
};
