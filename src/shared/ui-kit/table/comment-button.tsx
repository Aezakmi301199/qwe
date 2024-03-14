import React, { DOMAttributes, MouseEventHandler } from 'react';
import { Badge, IconButton } from '@mui/material';
import { CommentRounded } from '@mui/icons-material';
import { Size } from '../../enums/size.enum';

type CommentButtonProps = {
  commentCount: number;
};

const CommentButton: React.FC<CommentButtonProps & DOMAttributes<HTMLButtonElement>> = ({ commentCount, onClick }) => {
  return (
    <IconButton onClick={onClick} size={'small'} disableRipple>
      <Badge
        sx={{
          '.MuiBadge-badge': {
            top: '10px',
            left: '5px',
            width: '29px',
            padding: '0 4px',
          },
        }}
        badgeContent={commentCount}
      >
        <CommentRounded fontSize={Size.SMALL} />
      </Badge>
    </IconButton>
  );
};

export default CommentButton;
