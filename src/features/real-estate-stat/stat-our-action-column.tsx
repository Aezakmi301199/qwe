import { useEffect, useState } from 'react';
import { ContainerStat } from '../../shared/styles/styles';
import { Divider, Stack, Typography, useTheme } from '@mui/material';
import { ButtonTable } from './ui/button-table';
import PhoneIcon from '@mui/icons-material/Phone';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';
import { CurrencySymbol } from '../../shared/enums/currency-symbol.enum';
import { userStore } from '../../user-store.context';
import { observer } from 'mobx-react-lite';
import { separateThousand } from '../../shared/lib/separate-thousand';
import { UserStat } from '../../entities/user/model/type';
import { useUser } from '../../user-context';

export const StatOurActionColumn = observer(() => {
  const theme = useTheme();
  const user = useUser();
  const isLoadingStat = userStore.loadingStat;
  const [userStat, setUserStat] = useState<UserStat>();

  useEffect(() => {
    const prepareStat = async () => {
      await userStore.fetchStat(user.id);
    };

    prepareStat().then(() => {
      setUserStat(userStore.statAction);
    });
  }, []);

  return userStat ? (
    <ContainerStat
      padding={theme.custom.layout.padding.lg}
      alignItems={'center'}
      gap={theme.custom.base.module.fourth}
      alignSelf={'stretch'}
      direction={'row'}
      border={'0px'}
    >
      <Typography variant={'headline5'} color={theme.palette.text.primary}>
        Ваша статистика
      </Typography>
      {!isLoadingStat && (
        <Stack
          direction={'row'}
          divider={
            <Divider
              orientation='vertical'
              flexItem
              sx={{
                borderColor: theme.custom.divider.divider,
              }}
            />
          }
          spacing={'24px'}
        >
          <ButtonTable
            background={theme.custom.plus.main}
            text={separateThousand(userStat.realEstateCallsCount)}
            startIcon={<PhoneIcon />}
            tooltip={{
              text: 'Звонки, совершенные через АТС за последние 30 дней',
              width: '230px',
            }}
          />
          <ButtonTable
            background={theme.palette.error.main}
            text={separateThousand(userStat.crmRealEstateCount)}
            startIcon={<BookmarkOutlinedIcon />}
            tooltip={{
              text: 'Объекты, сохраненные из парсера в РИЭС',
              width: '277px',
            }}
          />
          <ButtonTable
            background={theme.palette.success.main}
            text={`${separateThousand(userStat.crmRealEstateCommission)} ${CurrencySymbol.RUB}`}
            startIcon={<FunctionsOutlinedIcon />}
            tooltip={{
              text: 'Ожидаемая комиссия с продажи объектов, сохраненных в РИЭС',
              width: '240px',
            }}
          />
        </Stack>
      )}
    </ContainerStat>
  ) : null;
});
