import { Badge, Button } from '@mui/material';
import { Anchor } from '../../../../shared/enums/anchor.enum';
import { TuneRounded } from '@mui/icons-material';
import React, { DOMAttributes } from 'react';

type BadgeFilterProps = {
  invisible: boolean;
};

export const BadgeFilter: React.FC<BadgeFilterProps & DOMAttributes<HTMLButtonElement>> = ({ invisible, onClick }) => {
  return (
    <Button
      disableRipple
      sx={{ whiteSpace: 'nowrap', fontSize: '14px', textTransform: 'none', borderRadius: '8px', padding: '6px 11px' }}
      size={'medium'}
      onClick={onClick}
      startIcon={
        <Badge
          id={'main_filter_button'}
          color='error'
          variant='dot'
          invisible={invisible}
          anchorOrigin={{
            vertical: Anchor.ANCHOR_TOP,
            horizontal: Anchor.ANCHOR_LEFT,
          }}
          sx={{
            '.MuiBadge-dot': {
              height: '5px',
              minWidth: '5px',
              borderRadius: '50%',
            },
          }}
        >
          <TuneRounded />
        </Badge>
      }
    >
      Все фильтры
    </Button>
  );
};
