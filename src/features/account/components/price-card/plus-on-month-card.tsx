import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { DefaultCard, GetPlusOnMonthButton } from '../../ui/ui';
import { FontSize } from '../../../../shared/enums/font-size.enum';
import { FontWeight } from '../../../../shared/enums/font-weight.enum';
import { theme } from '../../../../app/providers/theme';
import { CurrencySymbol } from '../../../../shared/enums/currency-symbol.enum';
import { Size } from '../../../../shared/enums/size.enum';
import { SubscriptionPlan } from '../../../../shared/types/subscription-plan';
import { CheckCircleOutlined } from '@mui/icons-material';
import { formatISODateTooltip } from '../../../../shared/lib/convert-timestamp-to-dateTime';
import { User } from '../../../../entities/user';
import { TimeConvert } from '../../../../shared/enums/time-convert.enum';

type PlusOnMonthCardProps = {
  subscriptionPlan: SubscriptionPlan;
  handlePaymentClick: (subscriptionId: string) => void;
  user: User;
};

const PlusOnMonthUI: React.FC<PlusOnMonthCardProps> = ({ subscriptionPlan, handlePaymentClick, user }) => {
  return (
    <DefaultCard
      sx={{
        backgroundColor: '#6366F2',
        boxSizing: 'border-box',
        width: '400px',
        borderRadius: '0 16px 16px 0',
      }}
    >
      <Box>
        <Typography
          fontFamily={'Roboto'}
          fontWeight={FontWeight.SEMI_BOLD}
          fontSize={FontSize.TWENTY_FOUR_FONT}
          color={theme.palette.common.white}
        >
          {subscriptionPlan.name}
        </Typography>
        <Typography
          fontWeight={FontWeight.MEDIUM}
          color={theme.palette.common.white}
          fontSize={FontSize.THIRTY_FOUR_FONT}
        >
          {subscriptionPlan.price} {CurrencySymbol.RUB} в месяц
        </Typography>
        {subscriptionPlan.priceWithoutDiscount && (
          <Typography color={'#FFFFFF99'} fontSize={FontSize.FOURTEENTH_FONT}>
            <s>
              {subscriptionPlan.priceWithoutDiscount} {CurrencySymbol.RUB}
            </s>{' '}
            {subscriptionPlan.price} {CurrencySymbol.RUB} за первый месяц
          </Typography>
        )}
      </Box>
      <Stack gap={'8px'}>
        {subscriptionPlan.features.map((feature, index) => (
          <ul key={index} style={{ padding: '0 0 8px 16px', margin: '0' }}>
            <li style={{ color: theme.palette.common.white }}>{feature.description}</li>
          </ul>
        ))}
      </Stack>
      <Box
        width={'100%'}
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={'4px'}
      >
        {subscriptionPlan.id !== user.subscriptionPlanId ? (
          <>
            {user.subscriptionPlan.isDefault ? (
              <>
                <GetPlusOnMonthButton size={Size.LARGE} onClick={() => handlePaymentClick(subscriptionPlan.id)}>
                  Подключить за {Math.round(subscriptionPlan.price / TimeConvert.MONTHS_IN_ONE_YEAR)}{' '}
                  {CurrencySymbol.RUB}
                  /мес
                </GetPlusOnMonthButton>
                {subscriptionPlan.priceWithoutDiscount && (
                  <Typography color={'#FFFFFF99'} fontSize={FontSize.TWELFTH_FONT}>
                    {subscriptionPlan.priceWithoutDiscount} {CurrencySymbol.RUB} со второго года
                  </Typography>
                )}
              </>
            ) : (
              user.subscriptionPlanExpiresAt && (
                <Typography fontSize={FontSize.THIRTEENTH_FONT} color={theme.palette.common.white} padding={'16px'}>
                  Можно будет подключить после {formatISODateTooltip(user.subscriptionPlanExpiresAt)}
                </Typography>
              )
            )}
          </>
        ) : (
          user.subscriptionPlanExpiresAt && (
            <Chip
              sx={{
                width: 'fit-content',
                display: 'flex',
                padding: '2px',
                alignItems: 'center',
                backgroundColor: '#FFFFFF3D',
                color: theme.palette.common.white,
              }}
              icon={<CheckCircleOutlined style={{ color: '#FFFFFF8F' }} />}
              label={`Подключен до ${formatISODateTooltip(user.subscriptionPlanExpiresAt)}`}
              variant='filled'
            />
          )
        )}
      </Box>
    </DefaultCard>
  );
};

export default PlusOnMonthUI;
