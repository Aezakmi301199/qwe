import React from 'react';
import { PagePath } from '../../shared/enums/page-path';
import { NewQRButton, TitleTypography } from '../../features/account/ui/ui';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import RhoodIcon from '../../features/account/components/custom-icons/rhood-icon';
import { theme } from '../../app/providers/theme';
import { styleFeatureModal } from '../../shared/styles/modal-styles';
import { CloseRounded, Notes, PlayCircleFilledRounded } from '@mui/icons-material';
import { Size } from '../../shared/enums/size.enum';
import { FontWeight } from '../../shared/enums/font-weight.enum';
import { FontSize } from '../../shared/enums/font-size.enum';
import AvitoCard from '../../features/account/components/avito-card/avito-card';
import soundImage from '../../shared/assets/images/callPlayerBlue.svg';
import statImage from '../../shared/assets/images/statistics.png';

type FeatureModalProps = {
  isOpenFeaturesModal: boolean;
};

const FeatureModal: React.FC<FeatureModalProps> = ({ isOpenFeaturesModal }) => {
  return (
    <Modal
      hideBackdrop={true}
      open={isOpenFeaturesModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      sx={{ backgroundColor: '#000000CC' }}
    >
      <Box sx={styleFeatureModal}>
        <Stack className={'featurePlus'}>
          <CloseRounded
            fontSize={Size.SMALL}
            sx={{
              color: 'rgba(255, 255, 255, 0.56)',
              cursor: 'pointer',
              position: 'absolute',
              top: '10px',
              right: '10px',
            }}
            onClick={() => {
              window.location.reload();
            }}
          />
          <Box marginTop={'24px'} display={'flex'} alignItems={'center'} flexDirection={'column'} gap={'24px'}>
            <RhoodIcon opacity={'1'} color={'#fff'} width={'72px'} height={'59px'} />
            <Typography
              marginBottom={'32px'}
              color={theme.palette.common.white}
              fontSize={FontSize.THIRTY_FOUR_FONT}
              fontWeight={FontWeight.BOLD}
              textAlign={'center'}
            >
              Теперь вам доступы функции RHOOD Plus
            </Typography>
          </Box>
        </Stack>
        <Stack
          sx={{
            backgroundColor: 'rgba(240, 243, 255, 1)',
            padding: '48px 24px',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <TitleTypography>Чат-бот в Telegram</TitleTypography>
          <Typography color={theme.palette.text.primary}>
            Получайте уведомления о новых объектах в Telegram Bot
          </Typography>
          <AvitoCard />
        </Stack>
        <Stack
          sx={{
            backgroundColor: theme.palette.common.white,
            padding: '48px 24px',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <TitleTypography>Статистика</TitleTypography>
          <Typography color={theme.palette.text.primary}>
            Просматривайте количество объявлений на разных площадках за месяц
          </Typography>
          <img style={{ width: '500px' }} src={statImage} alt={''} />
        </Stack>
        <Stack
          sx={{
            backgroundColor: 'rgba(240, 243, 255, 1)',
            padding: '48px 24px',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <TitleTypography>Звонки клиентам прямо из RHOOD</TitleTypography>
          <Typography marginBottom={'24px'} textAlign={'center'} color={theme.palette.text.primary}>
            Прослушивайте ваши разговоры, совершенные через наш сервис, и читайте их расшифровку
          </Typography>
          <Stack flexDirection={'row'} gap={'16px'}>
            <PlayCircleFilledRounded fontSize={Size.LARGE} sx={{ color: theme.palette.primary.main }} />
            <img src={soundImage} alt={''} />
          </Stack>
          <Button
            variant={'outlined'}
            color={'primary'}
            size={Size.SMALL}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              gap: '8px',
              marginTop: '32px',
              marginBottom: '12px',
            }}
          >
            <Notes fontSize={Size.SMALL} />
            Текст звонка
          </Button>
          <Stack
            sx={{
              backgroundColor: theme.palette.primary.main,
              padding: '8px 16px',
              borderRadius: '12px',
              gap: '24px',
            }}
          >
            <Typography color={theme.palette.common.white}>
              Здравствуйте, меня интересует двухкомнатная квартира в Тюмени. Есть ли в вашем агентстве подходящие
              варианты?
            </Typography>
            <Typography color={theme.palette.common.white}>
              Здравствуйте! Могли бы вы уточнить свои предпочтения по району, бюджету и другим важным параметрам?
            </Typography>
          </Stack>
        </Stack>
        <Box
          sx={{
            width: '100%',
            backgroundColor: 'white',
            boxSizing: 'border-box',
            borderRadius: '0px 0px 8px 8px',
            display: 'flex',
            justifyContent: 'center',
            padding: '48px 24px',
          }}
        >
          <NewQRButton
            variant={'contained'}
            color={'primary'}
            fullWidth
            onClick={() => {
              window.location.href = PagePath.FLATS;
            }}
          >
            Перейти к работе
          </NewQRButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default FeatureModal;
