import React from 'react';
import { Stack, Typography } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { DurationTime } from '../../enums/duration-time.enum';
import copyGreenIcon from '../../assets/icons/copyWhiteIcon.svg';
import { FontSize } from '../../enums/font-size.enum';
import { FontFamily } from '../../enums/font-family.enum';
import { Anchor } from '../../enums/anchor.enum';

type SnackbarProps = {
  isOpenSnackBar: boolean;
  handleCloseSnackBar: () => void;
  message: string;
  icon?: string;
};

const SnackbarToast: React.FC<SnackbarProps> = ({ isOpenSnackBar, handleCloseSnackBar, message }) => {
  return (
    <Snackbar
      sx={{ marginTop: '48px', marginRight: '-16px' }}
      open={isOpenSnackBar}
      autoHideDuration={DurationTime.THREE_SECONDS}
      onClose={handleCloseSnackBar}
      message={
        <Stack flexDirection={'row'} alignItems={'center'} gap={'4px'} height={'14px'}>
          <img src={copyGreenIcon} alt={''} />
          <Typography fontSize={FontSize.FOURTEENTH_FONT} fontFamily={FontFamily.ROBOTO}>
            {message}
          </Typography>
        </Stack>
      }
      anchorOrigin={{
        vertical: Anchor.ANCHOR_TOP,
        horizontal: Anchor.ANCHOR_RIGHT,
      }}
    />
  );
};

export default SnackbarToast;
