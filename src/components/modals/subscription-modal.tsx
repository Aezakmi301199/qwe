import React from 'react';
import { Box, Modal, Stack, Typography } from '@mui/material';
import { styleSubscriptionModal } from '../../shared/styles/modal-styles';
import { FontSize } from '../../shared/enums/font-size.enum';
import { FontWeight } from '../../shared/enums/font-weight.enum';
import { theme } from '../../app/providers/theme';
import { CloseContainer, GetPlusButtonModal } from '../../features/account/ui/ui';
import closeIcon from '../../shared/assets/icons/closeModal.svg';
import AvitoCard from '../../features/account/components/avito-card/avito-card';
import { userStore } from '../../user-store.context';
import { formatPrice } from '../../shared/lib/format-price-number';
import { CurrencySymbol } from '../../shared/enums/currency-symbol.enum';
import { Link } from 'react-router-dom';
import { PagePath } from '../../shared/enums/page-path';
import { TimeConvert } from '../../shared/enums/time-convert.enum';

type SubscriptionModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, handleClose }) => {
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Stack sx={styleSubscriptionModal} gap={'12px'}>
        <CloseContainer onClick={handleClose}>
          <img alt={''} src={closeIcon}></img>
        </CloseContainer>
        <Stack gap={'12px'} width={'532px'}>
          <Box width={'100%'} display={'flex'} justifyContent={'center'}>
            <Typography
              fontSize={FontSize.TWENTY_FOUR_FONT}
              fontWeight={FontWeight.SEMI_BOLD}
              color={theme.palette.text.primary}
            >
              Чат-бот в Telegram
            </Typography>
          </Box>
          <Box>
            <Typography fontSize={FontSize.SIXTEENTH_FONT} fontWeight={FontWeight.REGULAR} textAlign={'center'}>
              Получайте уведомления о новых объектах в Telegram Bot
            </Typography>
          </Box>
        </Stack>
        <AvitoCard />
        <Box width={'100%'} display={'flex'} justifyContent={'center'}>
          <Link to={PagePath.ACCOUNT_TARIFFS} onClick={handleClose}>
            <GetPlusButtonModal sx={{ marginTop: '16px' }}>
              Подключить за{' '}
              {formatPrice(Math.round(userStore.subscriptionPlans[0]?.price / TimeConvert.MONTHS_IN_ONE_YEAR))}{' '}
              {CurrencySymbol.RUB}/мес.
            </GetPlusButtonModal>
          </Link>
        </Box>
      </Stack>
    </Modal>
  );
};

export default SubscriptionModal;
