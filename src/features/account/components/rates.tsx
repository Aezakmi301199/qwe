import React, { useEffect, useState } from 'react';
import { Alert, Button, Stack } from '@mui/material';
import PlusOnYearUI from './price-card/plus-on-year-card';
import { TimeConvert } from '../../../shared/enums/time-convert.enum';
import PlusOnMonthUI from './price-card/plus-on-month-card';
import { theme } from '../../../app/providers/theme';
import { userStore } from '../../../user-store.context';
import { observer } from 'mobx-react';
import { SubscriptionPlan } from '../../../shared/types/subscription-plan';
import { useNavigate, useParams } from 'react-router-dom';
import { PagePath } from '../../../shared/enums/page-path';
import { socket } from '../../../socket';
import { WsEvent } from '../../../shared/enums/ws-event';
import { useUser } from '../../../user-context';
import { useRootStore } from '../../../root-store.context';
import { Payment } from '../../../entities/payment/model/payment.store';
import { PaymentStatus } from '../../../shared/enums/payment-status.enum';
import InfoIcon from '@mui/icons-material/Info';
import FeatureModal from '../../../components/modals/feature-modal';
import PlusPlug from '../../../shared/ui-kit/plus-plug/plus-plug';
import PaymentModal from '../../../components/modals/payment-modal';
import { TitleTypography } from '../ui/ui';

export type PaymentLink = {
  id: string;
  paymentUrl: string;
  createdAt: string;
};

const Rates = () => {
  const findWaitingPayment = (payments: Payment[]) => {
    return payments.find((payment) => payment.status === PaymentStatus.WAITING);
  };
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | undefined>();
  const [isOpenModalPayment, setIsOpenModalPayment] = useState<boolean>(false);
  const [isOpenFeaturesModal, setIsOpenFeaturesModal] = useState<boolean>(false);
  const [paymentLink, setPaymentLink] = useState<PaymentLink>();
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [waitingPayment, setWaitingPayment] = useState<Payment | undefined>();
  const navigate = useNavigate();
  const { id: paymentId } = useParams();
  const user = useUser();
  const { paymentStore } = useRootStore();

  const handlePaymentClick = async (subscriptionPlanId: string) => {
    setIsOpenModalPayment(true);

    const subscriptionPlan = userStore.findSubscriptionPlanById(subscriptionPlanId);

    if (!subscriptionPlan) {
      return;
    }

    setSubscriptionPlan(subscriptionPlan);

    const paymentLink = await paymentStore.fetchPaymentLink(subscriptionPlanId, user.id);

    navigate(`${PagePath.ACCOUNT_TARIFFS}/${paymentLink.id}`);

    setPaymentLink(paymentLink);
  };
  const scrollOnTop = () => {
    const parentElement = document.getElementById('ratesParent');

    if (!parentElement) {
      return;
    }

    parentElement.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const prepareData = async () => {
      await userStore.fetchSubscriptionPlan();
      await paymentStore.fetchPaymentInfo(user.id);
      setWaitingPayment(findWaitingPayment(paymentStore.paymentInfo));

      if (paymentId) {
        try {
          const payment = await paymentStore.fetchPaymentById(paymentId);
          const subscriptionPlan = userStore.findSubscriptionPlanById(payment.subscriptionPlanId);

          if (!subscriptionPlan) {
            return;
          }

          setSubscriptionPlan(subscriptionPlan);
          setPaymentLink(payment);
          setIsOpenModalPayment(true);
        } catch {
          navigate(PagePath.ACCOUNT_TARIFFS);
        }
      }
    };

    prepareData();
  }, []);

  const yearRate = userStore.subscriptionPlans.find(
    (rate) => !rate.isDefault && rate.durationMonths === TimeConvert.MONTHS_IN_ONE_YEAR,
  );
  const monthRate = userStore.subscriptionPlans.find(
    (rate) => !rate.isDefault && rate.durationMonths === TimeConvert.MONTHS_IN_ONE_MONTH,
  );

  if (!yearRate || !monthRate) {
    return null;
  }

  socket.off(WsEvent.PAYMENT_COMPLETED).on(WsEvent.PAYMENT_COMPLETED, () => {
    setIsOpenModalPayment(false);
    setIsOpenFeaturesModal(true);
  });

  return userStore.subscriptionPlans.length && user ? (
    <Stack height={'calc(100dvh - 100px)'}>
      <TitleTypography sx={{ padding: '0 0 24px 0' }}>Тарифы</TitleTypography>
      {waitingPayment && (
        <Alert
          severity={'info'}
          icon={<InfoIcon />}
          action={
            <Button
              onClick={() => (window.location.href = `${PagePath.ACCOUNT_TARIFFS}/${waitingPayment.id}`)}
              sx={{ textTransform: 'none', color: theme.custom.base.info.main }}
              size='small'
            >
              Оплатить
            </Button>
          }
        >
          {`У вас есть платеж за «${waitingPayment.subscriptionPlan.name}», ожидающий оплаты`}
        </Alert>
      )}
      <Stack flexDirection={'row'} alignItems={'center'} marginTop={'16px'}>
        <PlusOnYearUI subscriptionPlan={yearRate} handlePaymentClick={handlePaymentClick} user={user} />
        <PlusOnMonthUI subscriptionPlan={monthRate} handlePaymentClick={handlePaymentClick} user={user} />
      </Stack>
      <PlusPlug scrollOnTop={scrollOnTop} />
      <PaymentModal
        handlePaymentClick={handlePaymentClick}
        isOpenModalPayment={isOpenModalPayment}
        paymentLink={paymentLink}
        isExpired={isExpired}
        setIsExpired={setIsExpired}
        subscriptionPlan={subscriptionPlan}
      />
      {isOpenFeaturesModal && <FeatureModal isOpenFeaturesModal={isOpenFeaturesModal} />}
    </Stack>
  ) : null;
};

export default observer(Rates);
