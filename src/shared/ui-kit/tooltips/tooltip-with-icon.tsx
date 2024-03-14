import React from 'react';
import { SxProps, Tooltip, Typography, useTheme } from '@mui/material';
import { FontFamily } from '../../enums/font-family.enum';
import { FontSize } from '../../enums/font-size.enum';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

type TooltipProps = {
  text: string;
  width?: string;
  icon?: {
    sx: SxProps;
  };
};

const UITooltipWithIcon: React.FC<TooltipProps> = ({ text, width, icon }) => {
  const theme = useTheme();

  return (
    <Tooltip
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            width: width,
            padding: '0',
            borderRadius: '8px',
          },
        },
      }}
      title={
        <Typography fontFamily={FontFamily.ROBOTO} fontSize={FontSize.FOURTEENTH_FONT} padding={'4px 8px'}>
          {text}
        </Typography>
      }
    >
      <HelpOutlineOutlinedIcon
        fontSize={'small'}
        sx={{
          color: theme.palette.action.active,
          margin: 0,
          zIndex: 7,
          ...icon?.sx,
        }}
      />
    </Tooltip>
  );
};

export default UITooltipWithIcon;
