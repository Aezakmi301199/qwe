import React, { useEffect } from 'react';
import { DrawerRecognizeContainer, HeaderCommentBox } from '../../shared/styles/styles';
import { Anchor } from '../../shared/enums/anchor.enum';
import Drawer from '@mui/material/Drawer';
import { Stack, Typography } from '@mui/material';
import { FontSize } from '../../shared/enums/font-size.enum';
import { FontWeight } from '../../shared/enums/font-weight.enum';
import Box from '@mui/material/Box';
import closeButton from '../../shared/assets/icons/closeModalIcon.svg';
import { RealEstateType } from '../../shared/enums/real-estate-type.enum';
import { getCommentTitle } from '../../features/grid/lib/get-comment-title';
import { observer } from 'mobx-react';
import { Store } from '../../shared/lib/store';
import { Flat } from '../../entities/real-estate/flat';
import { House } from '../../entities/real-estate/house';
import { Land } from '../../entities/real-estate/land';
import { theme } from '../../app/providers/theme';
import RhoodIcon from '../../features/account/components/custom-icons/rhood-icon';
import { ConnectPlus } from '../../features/account/ui/ui';
import { formatPrice } from '../../shared/lib/format-price-number';
import { CurrencySymbol } from '../../shared/enums/currency-symbol.enum';
import { userStore } from '../../user-store.context';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { Link } from 'react-router-dom';
import { PagePath } from '../../shared/enums/page-path';

type RecognizedTextItem = {
  channel: string;
  endTime: number;
  gender: string;
  sentiment: number;
  startTime: number;
  text: string;
}[];

type DrawerObjectInfoProps = {
  state: {
    right: boolean;
  };
  route: RealEstateType;
  setOpenedDrawer: (id: string | null) => void;
  realEstateId: string;
  store: Store<Flat | House | Land>;
  text: RecognizedTextItem | undefined;
  isDefaultUser: boolean;
};

const DrawerRecognition: React.FC<DrawerObjectInfoProps> = observer(
  ({ state, route, setOpenedDrawer, realEstateId, store, text, isDefaultUser }) => {
    useEffect(() => {
      const prepareData = async () => {
        if (!userStore.subscriptionPlans.length) {
          await userStore.fetchSubscriptionPlan();
        }
      };

      prepareData();
    }, []);

    const list = () => {
      const realEstate = store.findById(realEstateId);

      if (!realEstate) {
        return null;
      }

      const closeDrawer = () => {
        text = [];
        setOpenedDrawer(null);
      };

      return (
        <DrawerRecognizeContainer key={realEstate.id}>
          <HeaderCommentBox>
            <Stack direction={'column'} alignItems={'center'}>
              {isDefaultUser ? (
                <Stack>
                  <Typography fontSize={FontSize.TWENTY_FOUR_FONT} fontWeight={FontWeight.SEMI_BOLD}>
                    Текст записи
                  </Typography>
                  <Typography fontSize={FontSize.FOURTEENTH_FONT} color={theme.palette.text.secondary}>
                    {realEstate.address}
                  </Typography>
                </Stack>
              ) : (
                <Typography fontSize={FontSize.TWENTY_FOUR_FONT} fontWeight={FontWeight.SEMI_BOLD}>
                  {getCommentTitle(route, realEstate)}
                </Typography>
              )}
            </Stack>
            <Box onClick={closeDrawer}>
              <img className={'closeButton'} alt={''} src={closeButton} />
            </Box>
          </HeaderCommentBox>
          {!isDefaultUser ? (
            <Stack sx={{ padding: '0px 24px 0 24px', marginTop: '-12px' }}>
              <Typography fontSize={FontSize.FOURTEENTH_FONT} color={theme.palette.text.secondary}>
                {realEstate.address}
              </Typography>
              <Typography fontSize={FontSize.FOURTEENTH_FONT} color={theme.palette.text.secondary}>
                {formatPrice(realEstate.price)} {CurrencySymbol.RUB}
              </Typography>
            </Stack>
          ) : null}
          {isDefaultUser ? (
            <Stack sx={{ padding: '0px 24px 24px 24px', gap: '16px', marginTop: '-4px' }}>
              <Typography fontSize={FontSize.FOURTEENTH_FONT} fontWeight={FontWeight.MEDIUM}>
                Пример текста:
              </Typography>
              <Typography fontSize={FontSize.FOURTEENTH_FONT}>
                Здравствуйте, меня интересует квартира, которую вы сдаете на площадке Авито...
              </Typography>
              <Stack className={'bannerPlus'}>
                <RhoodIcon opacity={'1'} fill={'#fff'} width={'70px'} height={'57px'} />
                <Typography
                  marginTop={'12px'}
                  marginBottom={'12px'}
                  fontSize={FontSize.TWENTY_FONT}
                  fontWeight={FontWeight.MEDIUM}
                  color={theme.palette.common.white}
                  textAlign={'center'}
                >
                  Распознавание текста звонка доступно на тарифе RHOOD Plus
                </Typography>
                <Link to={PagePath.ACCOUNT_TARIFFS}>
                  <ConnectPlus>
                    Подключить за {Math.round(userStore.subscriptionPlans[0].price / TimeConvert.MONTHS_IN_ONE_YEAR)}
                    ₽/мес.
                  </ConnectPlus>
                </Link>
              </Stack>
            </Stack>
          ) : (
            <Typography
              fontSize={FontSize.FOURTEENTH_FONT}
              sx={{
                padding: '0px 24px 0 24px',
                marginTop: '12px',
                overflow: 'auto',
                maxHeight: 'calc(100dvh - 170px)',
              }}
            >
              {text ? text.map((item) => item.text) : 'Не удалось распознать текст'}
            </Typography>
          )}
        </DrawerRecognizeContainer>
      );
    };

    return (
      <React.Fragment>
        <Drawer
          anchor={Anchor.ANCHOR_RIGHT}
          open={state[Anchor.ANCHOR_RIGHT]}
          sx={{
            width: '420px',
            right: '32px',
            left: 'auto',
            '.css-10ohwma-MuiPaper-root-MuiDrawer-paper': {
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
              right: 'auto !important',
            },
          }}
        >
          {list()}
        </Drawer>
      </React.Fragment>
    );
  },
);

export default DrawerRecognition;
