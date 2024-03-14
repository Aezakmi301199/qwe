import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import rhoodPlusIcon from '../../assets/icons/rhoodPlusIcon.svg';
import { FontWeight } from '../../enums/font-weight.enum';
import { GetPlusOnYearButton, PlusContainer } from '../../../features/account/ui/ui';
import axios from 'axios';
import { SubscriptionPlan } from '../../types/subscription-plan';
import { TimeConvert } from '../../enums/time-convert.enum';
import { CurrencySymbol } from '../../enums/currency-symbol.enum';
import { Link } from 'react-router-dom';
import { PagePath } from '../../enums/page-path';

type PlusBannerProps = {
  text: string;
};

const PlusBanner: React.FC<PlusBannerProps> = ({ text }) => {
  const [rates, setRates] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    axios.get<SubscriptionPlan[]>('/api/subscription-plan').then((response) => {
      setRates(response.data);
    });
  }, []);

  const monthRate = rates.find((rate) => !rate.isDefault && rate.durationMonths === TimeConvert.MONTHS_IN_ONE_YEAR);

  if (!monthRate) {
    return null;
  }

  return (
    <PlusContainer>
      <Box display={'flex'} alignItems={'center'} gap={'12px'}>
        <img src={rhoodPlusIcon} alt={''} />
        <Typography whiteSpace={'nowrap'} fontWeight={FontWeight.MEDIUM} color={'#372FA2'}>
          {text}
        </Typography>
      </Box>
      <Link to={PagePath.ACCOUNT_TARIFFS}>
        <GetPlusOnYearButton sx={{ width: 'auto' }}>
          Подключить за {Math.round(monthRate.price / TimeConvert.MONTHS_IN_ONE_YEAR)} {CurrencySymbol.RUB}/мес.
        </GetPlusOnYearButton>
      </Link>
    </PlusContainer>
  );
};

export default PlusBanner;
