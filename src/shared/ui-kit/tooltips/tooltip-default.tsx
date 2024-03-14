import React from 'react';
import { Tooltip, Typography, useTheme } from '@mui/material';
import { FontSize } from '../../enums/font-size.enum';

type TooltipProps = {
  text: string;
};

const UITooltipDefault: React.FC<TooltipProps> = ({ text }) => {
  const theme = useTheme();

  return (
    <Tooltip
      classes={{ tooltip: 'custom-tooltip' }}
      arrow
      title={text}
      componentsProps={{
        tooltip: {
          sx: {
            right: '40px',
            borderRadius: '8px',
          },
        },
      }}
    >
      <Typography fontSize={FontSize.TWELFTH_FONT} className={'truncate-text'} color={theme.palette.text.secondary}>
        {text}
      </Typography>
    </Tooltip>
  );
};

export default UITooltipDefault;
