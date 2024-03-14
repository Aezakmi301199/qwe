import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { DefaultCard, GetPlusOnYearButton } from '../../ui/ui';
import { FontSize } from '../../../../shared/enums/font-size.enum';
import { FontWeight } from '../../../../shared/enums/font-weight.enum';
import { theme } from '../../../../app/providers/theme';
import { TimeConvert } from '../../../../shared/enums/time-convert.enum';
import { CurrencySymbol } from '../../../../shared/enums/currency-symbol.enum';
import { Size } from '../../../../shared/enums/size.enum';
import RhoodIcon from '../custom-icons/rhood-icon';
import { SubscriptionPlan } from '../../../../shared/types/subscription-plan';
import { CheckCircleOutlined } from '@mui/icons-material';
import { formatISODateTooltip } from '../../../../shared/lib/convert-timestamp-to-dateTime';
import { User } from '../../../../entities/user';

type PlusOnYearCardProps = {
  subscriptionPlan: SubscriptionPlan;
  handlePaymentClick: (subscriptionId: string) => void;
  user: User;
};

const PlusOnYearUI: React.FC<PlusOnYearCardProps> = ({ subscriptionPlan, handlePaymentClick, user }) => {
  return (
    <DefaultCard
      sx={{
        backgroundColor: '#292524',
        boxSizing: 'border-box',
        width: '400px',
        minHeight: '400px',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Typography
          fontFamily={'Roboto'}
          fontWeight={FontWeight.SEMI_BOLD}
          fontSize={FontSize.TWENTY_FOUR_FONT}
          color={theme.palette.common.white}
        >
          {subscriptionPlan.name}
        </Typography>
        <Box
          sx={{ position: 'absolute', outline: '6px solid #42403f' }}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          top={'-10px'}
          right={'0'}
          width={'40px'}
          height={'40px'}
          border={'6px solid #636160'}
          borderRadius={'100%'}
        >
          <RhoodIcon opacity={'1'} color={theme.palette.common.white} />
        </Box>
        <Typography
          fontWeight={FontWeight.MEDIUM}
          color={theme.palette.common.white}
          fontSize={FontSize.THIRTY_FOUR_FONT}
        >
          {Math.round(subscriptionPlan.price / TimeConvert.MONTHS_IN_ONE_YEAR)} {CurrencySymbol.RUB} в месяц
        </Typography>
        {subscriptionPlan.priceWithoutDiscount && (
          <Typography color={'#FFFFFF99'} fontSize={FontSize.FOURTEENTH_FONT}>
            <s>
              {subscriptionPlan.priceWithoutDiscount} {CurrencySymbol.RUB}
            </s>{' '}
            {subscriptionPlan.price} {CurrencySymbol.RUB} за первый год
          </Typography>
        )}
      </Box>
      <Stack gap={'8px'} flex={1}>
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
                <GetPlusOnYearButton size={Size.LARGE} onClick={() => handlePaymentClick(subscriptionPlan.id)}>
                  Подключить за {Math.round(subscriptionPlan.price / TimeConvert.MONTHS_IN_ONE_YEAR)}{' '}
                  {CurrencySymbol.RUB}
                  /мес
                </GetPlusOnYearButton>
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

export default PlusOnYearUI;
