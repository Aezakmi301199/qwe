import { Button, IconButton, Typography, useTheme } from '@mui/material';
import { ReactElement } from 'react';
import UITooltipWithIcon from '../../../shared/ui-kit/tooltips/tooltip-with-icon';

type ButtonTableProps = {
  startIcon: ReactElement;
  text: string | number;
  background?: string;
  tooltip: {
    text: string;
    width: string;
  };
};

export const ButtonTable: React.FC<ButtonTableProps> = ({ startIcon, text, background, tooltip }) => {
  const theme = useTheme();

  return (
    <Button
      disableRipple
      sx={{
        color: theme.palette.text.primary,
        display: 'flex',
        padding: '0px',
        alignItems: 'center',
        gap: theme.custom.base.module.fifteenth,
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '& .MuiButton-startIcon ': {
          margin: 0,
        },
        '& .MuiButton-endIcon ': {
          margin: 0,
        },
      }}
      startIcon={
        <IconButton
          sx={{
            display: 'flex',
            padding: theme.custom.base.module.zero_five,
            alignItems: 'center',
            gap: '0',
            background: background,
            color: theme.palette.common.white,
            borderRadius: theme.custom.border.radius.md,
            margin: 0,
            pointerEvents: 'none',
          }}
        >
          {startIcon}
        </IconButton>
      }
      endIcon={<UITooltipWithIcon text={tooltip.text} width={tooltip.width} />}
    >
      <Typography variant={'headline6'}>{text}</Typography>
    </Button>
  );
};
