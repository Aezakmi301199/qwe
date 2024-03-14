import { Stack, Typography, Box, Drawer, styled, useTheme, SxProps } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DrawerInfoContainer } from '../../../shared/styles/styles';
import closeButton from '../../../shared/assets/icons/closeModalIcon.svg';
import { Anchor } from '../../../shared/enums/anchor.enum';
import { UserAvatar } from '..';
import { WorkAddressUserDto } from '../../../shared/dto/work-address-user-dto';
import { Link } from 'react-router-dom';
import { environments } from '../../../environment';
import { separateThousand } from '../../../shared/lib/separate-thousand';
import { getRiesPathUrl } from '../../../shared/lib/get-ries-path-url';

type DrawerObjectInfoProps = {
  state: {
    right: boolean;
  };
  setOpenedDrawer: React.Dispatch<React.SetStateAction<string | null>>;
  userId: string;
  userData: WorkAddressUserDto;
};

const HeaderStatTeam = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.custom.base.module.first,
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: '16px 24px 8px 24px',
}));

const ContainerBodyStatTeam = styled(Stack)(({ theme }) => ({
  padding: '0px 24px',
  gap: theme.custom.base.module.first,
}));

type ContainerRealEstateStatTeamProps = {
  title: string;
  callsCount: number | string;
  saveCount: number | string;
  amountCommission: number | string;
  sx?: SxProps;
};

const ContainerRealEstateStatTeam: React.FC<ContainerRealEstateStatTeamProps> = ({
  title,
  callsCount,
  saveCount,
  amountCommission,
  sx,
}) => {
  const theme = useTheme();

  return (
    <Stack
      borderRadius={'12px'}
      border={`1px solid ${theme.custom.border.default}`}
      padding={'12px 16px'}
      gap={theme.custom.base.module.first}
      sx={sx}
    >
      <Typography variant={'body1Medium'}>{title}</Typography>
      <Box display={'grid'} gridTemplateColumns={'repeat(3,1fr)'}>
        <Stack gap={theme.custom.base.module.zero_five}>
          <Typography variant={'body2'} color={theme.palette.text.secondary}>
            Звонки
          </Typography>
          <Typography variant={'body1NumMedium'} color={theme.palette.text.primary}>
            {callsCount}
          </Typography>
        </Stack>
        <Stack gap={theme.custom.base.module.zero_five}>
          <Typography variant={'body2'} color={theme.palette.text.secondary}>
            Сохранено
          </Typography>
          <Typography variant={'body1NumMedium'} color={theme.palette.text.primary}>
            {saveCount}
          </Typography>
        </Stack>
        <Stack gap={theme.custom.base.module.zero_five}>
          <Typography variant={'body2'} color={theme.palette.text.secondary}>
            Комиссия
          </Typography>
          <Typography variant={'body1NumMedium'} color={theme.palette.text.primary}>
            {separateThousand(amountCommission)} ₽
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

export const DrawerTeamInfo: React.FC<DrawerObjectInfoProps> = observer(
  ({ state, setOpenedDrawer, userId, userData }) => {
    const theme = useTheme();
    const getContentDrawer = () => {
      const closeDrawer = () => {
        setOpenedDrawer(null);
      };

      const totalCount = {
        callsCount: userData.flatCallsCount + userData.houseCallsCount + userData.landCallsCount,
        saveCount: userData.crmFlatCount + userData.crmHouseCount + userData.crmLandCount,
        amountCommission: userData.crmFlatCommissionSum + userData.crmHouseCommission + userData.crmLandCommission,
      };
      const { getRiesUserLink } = getRiesPathUrl();

      return (
        <DrawerInfoContainer key={userId} sx={{ width: '450px' }}>
          <HeaderStatTeam>
            <UserAvatar
              sx={{ width: '40px', height: '40px', margin: '3px 4px 0px 0px' }}
              avatarUrl={userData.avatarUrl}
            />
            <Stack padding={'6px 0px'} gap={theme.custom.base.module.zero_five} flexGrow={1}>
              <Typography variant={'headline5'} color={theme.palette.text.primary}>
                {userData.fullName}
              </Typography>
              <Link
                style={{
                  color: theme.palette.primary.main,
                }}
                to={getRiesUserLink(userData.riesId)}
                target={'_blank'}
                rel='noreferrer noopener'
              >
                <Typography variant={'body2'}>Перейти в РИЭС</Typography>
              </Link>
            </Stack>
            <Box onClick={() => closeDrawer()}>
              <img className={'closeButton'} alt={''} src={closeButton} />
            </Box>
          </HeaderStatTeam>
          <ContainerBodyStatTeam padding={'0px 24px'}>
            <ContainerRealEstateStatTeam
              title={'Квартиры'}
              callsCount={separateThousand(userData.flatCallsCount)}
              saveCount={separateThousand(userData.crmFlatCount)}
              amountCommission={userData.crmFlatCommissionSum}
            />
            <ContainerRealEstateStatTeam
              title={'Дома'}
              callsCount={separateThousand(userData.houseCallsCount)}
              saveCount={separateThousand(userData.crmHouseCount)}
              amountCommission={separateThousand(userData.crmHouseCommission)}
            />
            <ContainerRealEstateStatTeam
              title={'Участок'}
              callsCount={separateThousand(userData.landCallsCount)}
              saveCount={separateThousand(userData.crmLandCount)}
              amountCommission={separateThousand(userData.crmLandCommission)}
            />
            <ContainerRealEstateStatTeam
              sx={{ border: `1px solid ${theme.custom.border.hover}` }}
              title={'Всего'}
              callsCount={separateThousand(totalCount.callsCount)}
              saveCount={separateThousand(totalCount.saveCount)}
              amountCommission={separateThousand(totalCount.amountCommission)}
            />
          </ContainerBodyStatTeam>
        </DrawerInfoContainer>
      );
    };

    return (
      <React.Fragment>
        <Drawer
          anchor={Anchor.ANCHOR_RIGHT}
          open={state[Anchor.ANCHOR_RIGHT]}
          sx={{
            width: '450px',
            right: '32px',
            left: 'auto',
            '.css-10ohwma-MuiPaper-root-MuiDrawer-paper': {
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
              right: 'auto !important',
            },
          }}
        >
          {getContentDrawer()}
        </Drawer>
      </React.Fragment>
    );
  },
);
