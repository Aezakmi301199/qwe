import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import statByWeekChartPlug from '../../shared/assets/images/stat-by-week-chart-plug.png';
import { theme } from '../../app/providers/theme';
import { FontSize } from '../../shared/enums/font-size.enum';
import { Link } from 'react-router-dom';
import { PagePath } from '../../shared/enums/page-path';

const StatByWeekChartPlug = () => {
  return (
    <Box
      borderRadius={'12px'}
      className={'statByWeekChartPlug'}
      width={'1526px'}
      padding={'32px 32px 48px 32px'}
      display={'flex'}
      gap={'32px'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <img width={'510px'} alt={'Статистика за неделю по частным лицам'} src={statByWeekChartPlug}></img>
      <Stack gap={'32px'}>
        <Stack width={'440px'} gap={'12px'} color={theme.palette.common.white}>
          <Typography variant={'headline5'}>Планируйте свой рабочий день</Typography>
          <Typography variant={'body2'} fontSize={FontSize.SIXTEENTH_FONT} lineHeight={'24px'}>
            Вы будете знать, когда выкладывается большинство новых объявлений от частных лиц и многое другое
          </Typography>
        </Stack>
        <Link to={PagePath.ACCOUNT_TARIFFS}>
          <Button
            sx={{
              width: 'max-content',
              borderRadius: '8px',
              backgroundColor: theme.palette.common.white,
              boxShadow: 'none',
              color: theme.palette.text.primary,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.common.white,
                boxShadow: 'none',
              },
            }}
            disableRipple
            variant={'contained'}
            size={'large'}
          >
            Подключить график
          </Button>
        </Link>
      </Stack>
    </Box>
  );
};

export default StatByWeekChartPlug;
