import React, { DOMAttributes, MouseEventHandler } from 'react';
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { DefaultValue } from '../../enums/default-values.enum';
import { FontSize } from '../../enums/font-size.enum';
import { ContentCopy, PlaceRounded } from '@mui/icons-material';
import copy from 'clipboard-copy';
import { theme } from '../../../app/providers/theme';

type AddressProps = {
  address: string;
  copyId: string;
  onClickMap: React.MouseEventHandler<HTMLButtonElement>;
  setIsOpenCopySnackbar: React.Dispatch<React.SetStateAction<boolean>>;
};

const Address: React.FC<AddressProps> = ({ address, copyId, setIsOpenCopySnackbar, onClickMap }) => {
  return (
    <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
      <Stack alignItems={'flex-start'}>
        <Box width={'100%'} display={'flex'} justifyContent={'space-between'}>
          {address ? address : DefaultValue.DEFAULT_ADDRESS}
        </Box>
        <Box
          className={'hoverable-cell'}
          sx={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            gap: '10px',
          }}
        >
          <Tooltip
            componentsProps={{
              tooltip: {
                sx: {
                  borderRadius: '8px',
                },
              },
            }}
            classes={{ tooltip: 'custom-tooltip' }}
            title={<Typography fontSize={FontSize.FOURTEENTH_FONT}>Скопировать код объекта</Typography>}
            arrow={true}
          >
            <Chip
              size={'small'}
              sx={{
                border: 'none',
                '.MuiChip-icon': {
                  fontSize: '12px',
                },
              }}
              component={'button'}
              icon={<ContentCopy color={'primary'} />}
              variant={'outlined'}
              label={
                <Typography
                  onClick={() => {
                    copy(copyId);
                    setIsOpenCopySnackbar(true);
                  }}
                  fontSize={FontSize.FOURTEENTH_FONT}
                  color={theme.palette.primary.main}
                  noWrap
                >
                  Скопировать код
                </Typography>
              }
            />
          </Tooltip>
        </Box>
      </Stack>
      <IconButton
        className={'hoverable-cell'}
        onClick={onClickMap}
        disableRipple
        size={'small'}
        sx={{ marginBottom: '14px' }}
      >
        <PlaceRounded color={'primary'} fontSize={'small'} />
      </IconButton>
    </Box>
  );
};

export default Address;
