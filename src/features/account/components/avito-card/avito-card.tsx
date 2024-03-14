import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { FirstFakeContainer, InfoCardContainer, InfoPlusContainer, SecondFakeContainer } from '../../ui/ui';
import rhoodPlusIcon from '../../../../shared/assets/icons/rhoodPlusIcon.svg';
import { FontWeight } from '../../../../shared/enums/font-weight.enum';
import { FontSize } from '../../../../shared/enums/font-size.enum';
import { theme } from '../../../../app/providers/theme';
import subModal from '../../../../shared/assets/images/subModal.png';

const AvitoCard = () => {
  return (
    <Box position={'relative'} display={'flex'} justifyContent={'center'}>
      <FirstFakeContainer />
      <SecondFakeContainer />
      <InfoPlusContainer>
        <Box display={'flex'} gap={'12px'}>
          <Box height={'100%'} width={'48px'}>
            <img alt={''} src={rhoodPlusIcon}></img>
          </Box>
          <Stack width={'100%'}>
            <Stack>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography
                  color={'rgba(99, 102, 242, 1)'}
                  fontWeight={FontWeight.MEDIUM}
                  fontSize={FontSize.FOURTEENTH_FONT}
                >
                  RHOOD bot
                </Typography>
                <Typography color={theme.palette.text.secondary} fontSize={FontSize.FOURTEENTH_FONT}>
                  12:40
                </Typography>
              </Box>
              <Box>
                <Typography fontSize={FontSize.FOURTEENTH_FONT} color={theme.palette.text.primary}>
                  На AVITO новый объект по фильтру{' '}
                  <Typography
                    display={'inline'}
                    fontSize={FontSize.FOURTEENTH_FONT}
                    color={theme.palette.text.primary}
                    fontWeight={FontWeight.MEDIUM}
                  >
                    Студия в Восточном
                  </Typography>
                </Typography>
                <Box display={'flex'} margin={'8px 0'} gap={'8px'} flexDirection={'column'}>
                  <Typography color={theme.palette.primary.main} marginTop={'16px'} fontSize={FontSize.FOURTEENTH_FONT}>
                    Перейти к объявлению →
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Box>
        <InfoCardContainer>
          <Box display={'flex'} flexDirection={'column'}>
            <Typography
              color={'rgba(99, 102, 242, 1)'}
              fontWeight={FontWeight.MEDIUM}
              fontSize={FontSize.FOURTEENTH_FONT}
            >
              AVITO
            </Typography>
            <Typography fontSize={FontSize.FOURTEENTH_FONT} fontWeight={FontWeight.MEDIUM}>
              Квартира-студия, 22,6 м², 2/15 эт. на <br /> продажу в Тюмени | Купить квартиру <br /> | Авито
            </Typography>
            <Typography fontSize={FontSize.FOURTEENTH_FONT} fontWeight={FontWeight.REGULAR}>
              Квартира-студия, 22,6 м, 2/15 эт. продаётся в Тюмени. Объявление на Авито. Продается студия с современным
              ремонтом в новом жилом комплексе Ленинград. На полу...
            </Typography>
          </Box>
          <img
            style={{ position: 'absolute', top: '8px', right: '8px' }}
            alt={''}
            width={'70px'}
            height={'70px'}
            src={subModal}
          ></img>
        </InfoCardContainer>
      </InfoPlusContainer>
    </Box>
  );
};

export default AvitoCard;
