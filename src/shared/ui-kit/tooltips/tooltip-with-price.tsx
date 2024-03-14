import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { FontSize } from '../../enums/font-size.enum';
import { FontFamily } from '../../enums/font-family.enum';
import { FontWeight } from '../../enums/font-weight.enum';
import { formatISODateTooltip } from '../../lib/convert-timestamp-to-dateTime';
import arrowUpIcon from '../../assets/icons/arrowUpIcon.svg';
import { formatPrice } from '../../lib/format-price-number';
import arrowDownIcon from '../../assets/icons/arrowDownIcon.svg';
import { Currency } from '../../enums/currency.enum';
import { theme } from '../../../app/providers/theme';
import { CurrencySymbol } from '../../enums/currency-symbol.enum';

type PriceHistory = {
  priceHistory: {
    price: string;
    createdAt: string;
    currency: Currency;
  }[];
};

type TooltipProps = {
  price: string;
  data: PriceHistory;
};

const UITooltipWithPrice: React.FC<TooltipProps> = ({ data, price }) => {
  const uniquePriceHistory = data.priceHistory.filter((item, index) => {
    return index === 0 || item.price !== data.priceHistory[index - 1].price;
  });

  return (
    <Tooltip
      componentsProps={{
        tooltip: {
          sx: {
            marginTop: '5px !important',
            bgcolor: 'white',
            boxShadow: '0px 4px 6px -2px rgba(19, 29, 53, 0.08), 0px 4px 16px -3px rgba(0, 0, 0, 0.12)',
            borderRadius: '8px',
            padding: '8px',
          },
        },
      }}
      title={
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={'8px'}>
          {uniquePriceHistory.map((item, index) => (
            <Box key={index} display={'flex'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
              <Typography
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                color={theme.palette.text.secondary}
                fontSize={FontSize.FOURTEENTH_FONT}
                fontFamily={FontFamily.ROBOTO}
                fontWeight={FontWeight.REGULAR}
              >
                {formatISODateTooltip(item.createdAt)}
                {index !== uniquePriceHistory.length - 1 ? (
                  <img
                    src={Number(uniquePriceHistory[index + 1].price) < Number(item.price) ? arrowUpIcon : arrowDownIcon}
                    alt={''}
                    style={{
                      marginLeft: '16px',
                      marginRight: '4px',
                    }}
                  />
                ) : (
                  <Box marginLeft={'16px'} marginRight={'4px'}></Box>
                )}
              </Typography>
              <Typography
                color={theme.palette.text.primary}
                fontSize={FontSize.FOURTEENTH_FONT}
                fontFamily={FontFamily.ROBOTO}
                fontWeight={FontWeight.REGULAR}
              >
                {formatPrice(item.price)} {CurrencySymbol[item.currency]}
              </Typography>
            </Box>
          ))}
        </Box>
      }
    >
      <Typography display={'flex'} alignItems={'center'}>
        {uniquePriceHistory[1] ? (
          <img
            src={Number(price) > Number(uniquePriceHistory[1].price) ? arrowUpIcon : arrowDownIcon}
            alt={''}
            style={{ marginLeft: '4px' }}
          />
        ) : (
          <Box marginLeft={'16px'} marginRight={'4px'}></Box>
        )}
      </Typography>
    </Tooltip>
  );
};

export default UITooltipWithPrice;
