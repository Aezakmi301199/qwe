import React, { useEffect } from 'react';
import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { NewQRButton, TitleTypography } from '../ui/ui';
import { FontFamily } from '../../../shared/enums/font-family.enum';
import { useRootStore } from '../../../root-store.context';
import { useUser } from '../../../user-context';
import { observer } from 'mobx-react';
import { formatISODate } from '../../../shared/lib/convert-timestamp-to-dateTime';
import { PaymentStatus } from '../../../shared/enums/payment-status.enum';
import { theme } from '../../../app/providers/theme';
import { Payment } from '../../../entities/payment/model/payment.store';
import { CancelOutlined, CheckCircleOutline, ErrorOutline, Schedule } from '@mui/icons-material';
import { Size } from '../../../shared/enums/size.enum';
import { PaymentTableContainer } from '../../../shared/styles/styles';
import { PageLimit } from '../../../shared/enums/pagination.enum';
import { PagePath } from '../../../shared/enums/page-path';
import { formatPrice } from '../../../shared/lib/format-price-number';
import { CurrencySymbol } from '../../../shared/enums/currency-symbol.enum';
import { FontSize } from '../../../shared/enums/font-size.enum';
import { FontWeight } from '../../../shared/enums/font-weight.enum';
import NoDataNotification from '../../../shared/ui-kit/no-data-notification/no-data-notification';
import { NoDataMessage } from '../../../shared/enums/no-data-message-enum';

const Payments = () => {
  const { paymentStore } = useRootStore();
  const user = useUser();
  const statusColorMap: Record<PaymentStatus, string> = {
    [PaymentStatus.SUCCESS]: theme.custom.base.success.main,
    [PaymentStatus.FAILED]: theme.custom.base.error.main,
    [PaymentStatus.CANCELLED]: theme.custom.border.default,
    [PaymentStatus.WAITING]: theme.custom.base.yellow.main,
  };

  const statusIconMap: Record<PaymentStatus, React.JSX.Element> = {
    [PaymentStatus.SUCCESS]: <CheckCircleOutline fontSize={Size.SMALL} color={'success'} />,
    [PaymentStatus.FAILED]: <ErrorOutline fontSize={Size.SMALL} color={'error'} />,
    [PaymentStatus.CANCELLED]: <CancelOutlined fontSize={Size.SMALL} color={'action'} />,
    [PaymentStatus.WAITING]: (
      <Schedule fontSize={Size.SMALL} color={'warning'} sx={{ color: theme.custom.base.yellow.main }} />
    ),
  };

  const readableStatusMap: Record<PaymentStatus, string> = {
    [PaymentStatus.SUCCESS]: 'Оплачен',
    [PaymentStatus.FAILED]: 'Ошибка',
    [PaymentStatus.CANCELLED]: 'Отменен',
    [PaymentStatus.WAITING]: 'Ожидает оплаты',
  };

  useEffect(() => {
    paymentStore.fetchPaymentCount(user.id);
    paymentStore.fetchPaymentInfo(user.id);
  }, [paymentStore.page]);

  return (
    <Stack width={'800px'}>
      <TitleTypography>История платежей</TitleTypography>
      <PaymentTableContainer sx={{ marginTop: '40px' }}>
        {paymentStore.paymentInfo.length ? (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width={'272px'} align={'left'}>
                  Дата
                </TableCell>
                <TableCell width={'240px'} align={'left'}>
                  Назначение
                </TableCell>
                <TableCell width={'240px'} align={'left'}>
                  Статус
                </TableCell>
                <TableCell width={'276px'} align={'right'}>
                  Сумма, ₽
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentStore.paymentInfo.map((row: Payment) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontFamily: FontFamily.ROBOTO }} align='left'>
                    {formatISODate(row.createdAt)}
                  </TableCell>
                  <TableCell sx={{ fontFamily: FontFamily.ROBOTO }} align='left'>
                    {row.subscriptionPlan.name}
                  </TableCell>
                  <TableCell sx={{ fontFamily: FontFamily.ROBOTO }} align='left'>
                    <Chip
                      icon={statusIconMap[row.status]}
                      variant={'outlined'}
                      label={readableStatusMap[row.status]}
                      sx={{
                        width: 'fit-content',
                        display: 'flex',
                        padding: '0px',
                        height: '24px',
                        textTransform: 'none',
                        color: [PaymentStatus.CANCELLED] ? theme.palette.text.primary : statusColorMap[row.status],
                        borderColor: statusColorMap[row.status],
                        alignItems: 'center',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontFamily: FontFamily.ROBOTO_MONO }} align='right'>
                    {row.status === PaymentStatus.WAITING ? (
                      <NewQRButton
                        variant={'contained'}
                        color={'primary'}
                        sx={{ height: '30px', width: '140px', whiteSpace: 'nowrap' }}
                        onClick={() => (window.location.href = `${PagePath.ACCOUNT_TARIFFS}/${row.id}`)}
                      >
                        Оплатить {formatPrice(row.amount)} {CurrencySymbol.RUB}
                      </NewQRButton>
                    ) : (
                      <Typography
                        fontFamily={FontFamily.ROBOTO_MONO}
                        fontSize={FontSize.FOURTEENTH_FONT}
                        fontWeight={FontWeight.MEDIUM}
                      >
                        {formatPrice(row.amount)}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <NoDataNotification descriptionPrimary={NoDataMessage.NO_DATA_PAYMENTS} descriptionSecondary={''} />
        )}
      </PaymentTableContainer>
      <TablePagination
        component='div'
        count={paymentStore.paymentCount}
        page={paymentStore.page - 1}
        onPageChange={(_, newPage) => paymentStore.setPage(newPage + 1)}
        rowsPerPage={PageLimit.FIFTEEN}
        rowsPerPageOptions={[PageLimit.FIFTEEN]}
        sx={{ borderTop: '1px solid #E0E0E0' }}
      />
    </Stack>
  );
};

export default observer(Payments);
