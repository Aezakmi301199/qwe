import React from 'react';
import { Box, Button, Modal, Stack, Typography, useTheme } from '@mui/material';
import { styleSaveObjectModal } from '../../shared/styles/modal-styles';
import { FontSize } from '../../shared/enums/font-size.enum';
import { FontWeight } from '../../shared/enums/font-weight.enum';
import { FontFamily } from '../../shared/enums/font-family.enum';
import { ShowObjectsButton } from '../../shared/styles/styles';

type SaveObjectModalProps = {
  isOpen: boolean;
  onClose: (event: React.MouseEvent) => void;
  handleSave: () => void;
};

const SaveObjectModal: React.FC<SaveObjectModalProps> = ({ isOpen, onClose, handleSave }) => {
  const theme = useTheme();

  const saveObjectModal = (event: React.MouseEvent) => {
    handleSave();
    onClose(event);
  };

  return (
    <Modal open={isOpen}>
      <Stack sx={styleSaveObjectModal}>
        <Box>
          <Typography fontSize={FontSize.TWENTY_FONT} fontWeight={FontWeight.MEDIUM} fontFamily={FontFamily.ROBOTO}>
            Сохранить в РИЭС
          </Typography>
          <Typography
            fontSize={FontSize.FOURTEENTH_FONT}
            fontWeight={FontWeight.REGULAR}
            fontFamily={FontFamily.ROBOTO}
            color={theme.palette.text.secondary}
          >
            Мы сохраним объект в РИЭС и создадим заявку на вас
          </Typography>
        </Box>
        <Stack flexDirection={'column'} gap={'8px'}>
          <ShowObjectsButton onClick={saveObjectModal}>Сохранить</ShowObjectsButton>
          <Button
            sx={{ padding: '8px 11px', fontSize: '15px', borderRadius: '8px', textTransform: 'none' }}
            onClick={onClose}
            className={'filterButton'}
          >
            Отменa
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default SaveObjectModal;
