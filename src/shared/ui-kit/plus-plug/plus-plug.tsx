import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import RhoodIcon from '../../../features/account/components/custom-icons/rhood-icon';
import { theme } from '../../../app/providers/theme';
import { FontSize } from '../../enums/font-size.enum';
import { FontWeight } from '../../enums/font-weight.enum';
import {
  SubscriptionPlanFeatureDescriptionTypography,
  SubscriptionPlanFeatureTitleTypography,
  TryButton,
} from '../../../features/account/ui/ui';
import botAdvertImg from '../../../shared/assets/images/botAdvertImg.png';
import statistics from '../../../shared/assets/images/statistics.png';
import callPlayer from '../../../shared/assets/images/callPlayer.svg';

type PlusPlugProps = {
  scrollOnTop: () => void;
};

const PlusPlug: React.FC<PlusPlugProps> = ({ scrollOnTop }) => {
  return (
    <>
      <Stack
        flexDirection={'row'}
        alignItems={'center'}
        marginTop={'16px'}
        sx={{ backgroundColor: '#F8FAFC', borderRadius: '16px' }}
        padding={'32px'}
        justifyContent={'space-between'}
      >
        <Box width={'352px'}>
          <SubscriptionPlanFeatureTitleTypography>
            Узнавайте о новых объектах раньше остальных
          </SubscriptionPlanFeatureTitleTypography>
          <SubscriptionPlanFeatureDescriptionTypography>
            Подписывайтесь на сохраненные поиски и получайте информацию о новых объектах в Telegram-бот
          </SubscriptionPlanFeatureDescriptionTypography>
        </Box>
        <Box
          position={'relative'}
          boxSizing={'border-box'}
          sx={{ backgroundColor: '#F0F3FF', borderRadius: '16px' }}
          width={'352px'}
          height={'243px'}
          padding={'21px 21px 21px 67px'}
        >
          <Box
            position={'absolute'}
            sx={{ backgroundColor: '#6366F2', borderRadius: '100%' }}
            width={'35px'}
            height={'35px'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            left={'21px'}
            top={'21px'}
          >
            <RhoodIcon opacity={'1'} color={theme.palette.common.white}></RhoodIcon>
          </Box>
          <Stack justifyContent={'space-between'} flexDirection={'row'}>
            <Typography fontSize={FontSize.FOURTEENTH_FONT} color={'#6366F2'}>
              RHOOD bot
            </Typography>
            <Typography fontSize={FontSize.TWELFTH_FONT} color={theme.palette.text.secondary}>
              15:20
            </Typography>
          </Stack>
          <Typography fontSize={FontSize.FOURTEENTH_FONT} color={theme.palette.text.primary}>
            На AVITO новый объект по фильтру
          </Typography>
          <Typography
            fontSize={FontSize.FOURTEENTH_FONT}
            fontWeight={FontWeight.MEDIUM}
            paddingBottom={'10px'}
            color={theme.palette.text.primary}
          >
            Студия в Восточном
          </Typography>
          <Stack
            width={'264px'}
            height={'120px'}
            padding={'7px'}
            sx={{
              borderRadius: '6px',
              backgroundColor: theme.palette.common.white,
              borderLeft: '4px solid #6366F2',
            }}
            flexDirection={'row'}
            boxSizing={'border-box'}
          >
            <Stack>
              <Typography fontSize={FontSize.FOURTEENTH_FONT} fontWeight={FontWeight.MEDIUM} color={'#6366F2'}>
                AVITO
              </Typography>
              <Typography fontSize={FontSize.FOURTEENTH_FONT} color={theme.palette.text.primary}>
                Квартира-студия, 22,6 м², 2/15 эт. на продажу в Тюмени | Купить квартиру | Авито
              </Typography>
            </Stack>
            <img src={botAdvertImg} alt={''} width={'60px'} height={'60px'}></img>
          </Stack>
        </Box>
      </Stack>
      <Stack
        flexDirection={'row'}
        alignItems={'center'}
        marginTop={'16px'}
        sx={{ backgroundColor: '#F8FAFC', borderRadius: '16px' }}
        padding={'32px'}
        justifyContent={'space-between'}
      >
        <img src={statistics} alt={''} width={'352px'} />
        <Box width={'352px'}>
          <SubscriptionPlanFeatureTitleTypography>Планируйте свой рабочий день</SubscriptionPlanFeatureTitleTypography>
          <SubscriptionPlanFeatureDescriptionTypography>
            Вы будете знать, когда выкладывается большинство новых объявлений от частных лиц и многое другое
          </SubscriptionPlanFeatureDescriptionTypography>
        </Box>
      </Stack>
      <Stack
        flexDirection={'row'}
        alignItems={'center'}
        marginTop={'16px'}
        sx={{ backgroundColor: '#F8FAFC', borderRadius: '16px' }}
        padding={'32px'}
        justifyContent={'space-between'}
      >
        <Box width={'352px'}>
          <SubscriptionPlanFeatureTitleTypography>
            Звоните клиентам прямо из RHOOD
          </SubscriptionPlanFeatureTitleTypography>
          <SubscriptionPlanFeatureDescriptionTypography>
            Прослушивайте записи ваших разговоров и читайте их расшифровку
          </SubscriptionPlanFeatureDescriptionTypography>
          <TryButton onClick={scrollOnTop}>Попробовать</TryButton>
        </Box>
        <Box alignItems={'center'} justifyContent={'center'} display={'flex'} flexDirection={'column'}>
          <img src={callPlayer} alt={''} />
          <Box
            sx={{
              border: '2px solid #6366F280',
              borderRadius: '16px',
              backgroundColor: theme.palette.common.white,
              marginTop: '12px',
            }}
            padding={'16px 20px'}
            width={'352px'}
            boxSizing={'border-box'}
          >
            <Typography color={theme.palette.text.primary}>
              Здравствуйте, меня интересует двухкомнатная квартира в Тюмени. Есть ли в вашем агентстве подходящие
              варианты?
              <br /> <br />
              Здравствуйте! Могли бы вы уточнить свои предпочтения по району, бюджету и другим важным параметрам?
            </Typography>
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default PlusPlug;
