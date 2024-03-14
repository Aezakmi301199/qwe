import React, { useContext, useState } from 'react';
import { Box, Button, FormHelperText, Modal, Stack, TextField, Typography } from '@mui/material';
import { FontSize } from '../../shared/enums/font-size.enum';
import { FontWeight } from '../../shared/enums/font-weight.enum';
import { FontFamily } from '../../shared/enums/font-family.enum';
import { ShowObjectsButton } from '../../shared/styles/styles';
import { SocketContext } from '../../socket';
import { WsEvent } from '../../shared/enums/ws-event';
import { HttpStatusCode } from 'axios';
import { Store } from '../../shared/lib/store';
import { Flat } from '../../entities/real-estate/flat';
import { House } from '../../entities/real-estate/house';
import { Land } from '../../entities/real-estate/land';

type DoubleObjectModalProps = {
  open: boolean;
  onClose: (event: React.MouseEvent) => void;
  setIsChecked?: (value: boolean) => void;
  style: object;
  realEstateId: string;
  store: Store<Flat | House | Land>;
};

const DuplicateObjectModal: React.FC<DoubleObjectModalProps> = ({ open, onClose, style, realEstateId, store }) => {
  const [crmId, setCrmId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const socket = useContext(SocketContext);

  socket.on(WsEvent.EXCEPTION, (data, event) => {
    if (data.eventName === WsEvent.ADD_DUPLICATE) {
      if (data.statusCode === HttpStatusCode.NotFound) {
        setErrorMessage('Такого объекта не существует');
      } else {
        setErrorMessage('Произошла ошибка, попробуйте еще раз');
      }
    }
  });

  const saveObjectModal = (event: React.MouseEvent) => {
    store.addDuplicateEmit(realEstateId, crmId);
  };

  return (
    <Modal open={open} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Stack sx={style}>
        <Box sx={{ width: '100%' }}>
          <Typography fontSize={FontSize.TWENTY_FONT} fontWeight={FontWeight.MEDIUM} fontFamily={FontFamily.ROBOTO}>
            Отметить как дубль
          </Typography>
          <TextField
            type={'number'}
            onChange={(e) => setCrmId(e.target.value)}
            sx={{
              width: '100%',
              marginTop: '24px',
            }}
            InputProps={{
              sx: {
                borderRadius: '8px',
              },
            }}
            id='outlined-basic'
            label='Укажите код в РИЭС'
            variant='outlined'
          />
          {errorMessage && <FormHelperText sx={{ color: '#EE4343' }}>{errorMessage}</FormHelperText>}
        </Box>
        <Stack flexDirection={'column'} gap={'8px'}>
          <ShowObjectsButton onClick={saveObjectModal}>Готово</ShowObjectsButton>
          <Button
            sx={{
              textTransform: 'none',
              padding: '9px 22px',
              fontSize: '15px',
              borderRadius: '8px',
              height: '42px',
            }}
            onClick={(event: React.MouseEvent) => {
              onClose(event);
              setErrorMessage(null);
            }}
          >
            Отменa
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default DuplicateObjectModal;
