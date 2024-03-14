import React, { SetStateAction } from 'react';
import { Box, CircularProgress, Modal, Stack, Typography } from '@mui/material';
import { stylePaymentModal } from '../../shared/styles/modal-styles';
import rhoodPlusIcon from '../../shared/assets/icons/rhoodPlusIcon.svg';
import { FontSize } from '../../shared/enums/font-size.enum';
import { FontWeight } from '../../shared/enums/font-weight.enum';
import { theme } from '../../app/providers/theme';
import { CloseRounded, QrCodeRounded } from '@mui/icons-material';
import { Size } from '../../shared/enums/size.enum';
import { PagePath } from '../../shared/enums/page-path';
import { NewQRButton } from '../../features/account/ui/ui';
import { QRCode } from 'react-qrcode-logo';
import sbp from '../../shared/assets/icons/sbp.svg';
import { environments } from '../../environment';
import Countdown, { zeroPad } from 'react-countdown';
import { DateTime } from 'luxon';
import { SubscriptionPlan } from '../../shared/types/subscription-plan';
import { PaymentLink } from '../../features/account/components/rates';

type PaymentModalProps = {
  isOpenModalPayment: boolean;
  subscriptionPlan: SubscriptionPlan | undefined;
  isExpired: boolean;
  setIsExpired: React.Dispatch<SetStateAction<boolean>>;
  paymentLink: PaymentLink | undefined;
  handlePaymentClick(id: string): Promise<void>;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpenModalPayment,
  subscriptionPlan,
  isExpired,
  setIsExpired,
  paymentLink,
  handlePaymentClick,
}) => {
  return (
    <Modal
      disableAutoFocus
      hideBackdrop={true}
      open={isOpenModalPayment}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      sx={{ backgroundColor: '#000000CC' }}
    >
      <Box sx={stylePaymentModal}>
        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Box display={'flex'} alignItems={'center'} gap={'12px'}>
            <img src={rhoodPlusIcon} alt={''} />
            <Typography
              fontSize={FontSize.TWENTY_FOUR_FONT}
              fontWeight={FontWeight.SEMI_BOLD}
              color={theme.palette.text.primary}
            >
              {subscriptionPlan?.name}
            </Typography>
          </Box>
          <CloseRounded
            fontSize={Size.LARGE}
            sx={{ color: '#131D358A', cursor: 'pointer' }}
            onClick={() => {
              window.location.href = PagePath.ACCOUNT_TARIFFS;
            }}
          />
        </Stack>
        {isExpired && subscriptionPlan ? (
          <Stack height={'338px'} justifyContent={'center'} alignItems={'center'} gap={'16px'}>
            <Typography color={theme.palette.text.secondary} fontSize={FontSize.SIXTEENTH_FONT}>
              Срок действия QR-кода истек
            </Typography>
            <NewQRButton
              size={Size.LARGE}
              variant={'contained'}
              color={'primary'}
              onClick={async () => {
                setIsExpired(false);
                await handlePaymentClick(subscriptionPlan.id);
              }}
            >
              <QrCodeRounded />
              Сгенерировать новый
            </NewQRButton>
          </Stack>
        ) : (
          <Stack marginTop={'18px'} gap={'12px'} alignItems={'center'}>
            <Typography fontSize={FontSize.SIXTEENTH_FONT} color={theme.palette.text.primary} textAlign={'center'}>
              Отсканируйте QR-код из приложения банка или через камеру телефона
            </Typography>
            {paymentLink ? (
              <>
                <QRCode
                  qrStyle={'squares'}
                  fgColor={'black'}
                  size={176}
                  quietZone={12}
                  logoImage={sbp}
                  logoPadding={2}
                  value={`${environments.REACT_APP_NSPK_URL}${paymentLink.paymentUrl}`}
                />
                <Countdown
                  zeroPadTime={1}
                  onComplete={() => {
                    setIsExpired(true);
                  }}
                  date={DateTime.fromISO(paymentLink.createdAt).plus({ minute: 10 }).toJSDate()}
                  renderer={({ minutes, seconds }) => (
                    <Stack alignItems={'center'}>
                      <Typography>Осталось</Typography>
                      <Typography fontSize={FontSize.THIRTY_FOUR_FONT} fontWeight={FontWeight.MEDIUM}>
                        {zeroPad(minutes)}:{zeroPad(seconds)}
                      </Typography>
                    </Stack>
                  )}
                />
              </>
            ) : (
              <CircularProgress />
            )}
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default PaymentModal;
