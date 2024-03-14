import React, { useContext, useState } from 'react';
import { Button, FormControl, FormGroup, FormHelperText, Stack, Typography, useTheme } from '@mui/material';
import { FontSize } from '../../../shared/enums/font-size.enum';
import { FontFamily } from '../../../shared/enums/font-family.enum';
import { FontWeight } from '../../../shared/enums/font-weight.enum';
import Box from '@mui/material/Box';
import commentBlueIcon from '../../../shared/assets/icons/commentBlueIcon.svg';
import SliderComponent from '../../../shared/ui-kit/slider/slider';
import { CallButton, CommentObjectInfoContainer } from '../../../shared/styles/styles';
import { DrawerPositionRight } from '../../../shared/types/drawer-position';
import { Anchor } from '../../../shared/enums/anchor.enum';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../../shared/lib/format-price-number';
import { getClientNameByAuthor } from '../../../shared/lib/get-client-name-author';
import { Author } from '../../../shared/enums/author.enum';
import { Domain } from '../../../shared/enums/domain.enum';
import { Status } from '../../../entities/status';
import { observer } from 'mobx-react';
import { WsEvent } from '../../../shared/enums/ws-event';
import { SocketContext } from '../../../socket';
import { formatPhoneNumber } from '../../../shared/lib/format-phone-number';
import { ParserDomain } from '../../../shared/enums/parser-domain.enum';
import phoneIcon from '../../../shared/assets/icons/phoneIcon.svg';
import { Store } from '../../../shared/lib/store';
import { Flat } from '../../../entities/real-estate/flat';
import { House } from '../../../entities/real-estate/house';
import { Land } from '../../../entities/real-estate/land';
import { getDomain } from '../../../shared/lib/get-domain-name';
import { useRootStore } from '../../../root-store.context';
import UITooltipWithPrice from '../../../shared/ui-kit/tooltips/tooltip-with-price';
import { CurrencySymbol } from '../../../shared/enums/currency-symbol.enum';
import DrawerImages from '../../drawers/drawer-images';
import { generateMetroStationLogoUrl } from '../../../entities/city';
import { CommentDrawer } from '../../../entities/comment';
import { convertLastCallDate } from '../../../shared/lib/convert-last-call-date';
import { isPriceHistoryVisible } from '../../../shared/lib/is-price-history-visible';
import { DateTime } from 'luxon';
import StatusChip from '../../../shared/ui-kit/chip/status-chip';
import { useUser } from '../../../user-context';

type MainSectionObjectInfoContainerProps = {
  id: string;
  price: string;
  address: string;
  author: Author;
  metroStationName: string | undefined;
  metroStationLineHexColor: string | undefined;
  clientName: string;
  domain: Domain;
  statuses: Status[];
  selectedStatus: string | null;
  setSelectedStatus: React.Dispatch<React.SetStateAction<string | null>>;
  setOpenedDrawer: (id: string | null) => void;
  setIsCallInProgress: React.Dispatch<React.SetStateAction<boolean>>;
  isCallInProgress: boolean;
  store: Store<Flat | House | Land>;
  url: string;
};

const MainSectionObjectInfoContainer: React.FC<MainSectionObjectInfoContainerProps> = observer(
  ({
    id,
    price,
    address,
    author,
    metroStationName,
    clientName,
    domain,
    statuses,
    selectedStatus,
    setSelectedStatus,
    setOpenedDrawer,
    setIsCallInProgress,
    store,
    url,
    metroStationLineHexColor,
  }) => {
    const RIGHT_DRAWER_STATE = {
      right: false,
    };
    const [openImagesDrawer, setOpenImagesDrawer] = useState<DrawerPositionRight>(RIGHT_DRAWER_STATE);
    const [openCommentDrawer, setOpenCommentDrawer] = useState<DrawerPositionRight>(RIGHT_DRAWER_STATE);
    const [phoneException, setPhoneException] = useState<boolean>(false);
    const [isMyCall, setIsMyCall] = useState<boolean>(false);
    const user = useUser();
    const theme = useTheme();
    const realEstate = store.findById(id);
    const { catalogStore } = useRootStore();
    const isExistMetroParams = metroStationLineHexColor && metroStationName;
    const metroStationIcon = generateMetroStationLogoUrl(metroStationLineHexColor);

    if (!realEstate) {
      return null;
    }

    const isActualLastCallTime = (date: string) => {
      const diffFromCallInDays = DateTime.now().diff(DateTime.fromISO(date), ['days']).days;
      const floorDate = Math.floor(diffFromCallInDays);

      return !Boolean(floorDate);
    };
    const socket = useContext(SocketContext);

    socket.off(WsEvent.NEW_PHONE).on(WsEvent.NEW_PHONE, ({ phone, realEstateId }) => {
      store.setNewPhone(realEstateId, phone);
    });

    const toggleCommentDrawer =
      (anchor: Anchor.ANCHOR_RIGHT, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        event.stopPropagation();
        setOpenCommentDrawer((prevState) => ({
          ...prevState,
          [anchor]: open ? !prevState[anchor] : false,
        }));
      };

    const toggleImagesDrawer =
      (anchor: Anchor.ANCHOR_RIGHT, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent | HTMLElement) => {
        const target = (event as React.MouseEvent).target as HTMLElement;
        const isImageClick = target.tagName === 'IMG';

        if (isImageClick) {
          setOpenImagesDrawer((prevState) => ({
            ...prevState,
            [anchor]: open ? !prevState[anchor] : false,
          }));
        }
      };

    socket.off(WsEvent.EXCEPTION).on(WsEvent.EXCEPTION, ({ eventName }: { eventName: WsEvent }) => {
      if (eventName === WsEvent.GET_PHONE) {
        store.loadingPhone = false;
        setPhoneException(true);
      }
    });

    const makeCall = (realEstateId: string) => {
      setIsCallInProgress(true);
      store.makeCallEmit(realEstateId);
      store.reserveForCall({
        realEstateId: realEstateId,
        userId: user.id,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      });

      if (realEstate.callingUser?.id === user.id) {
        setIsMyCall(true);
      }
    };

    const renderCallButtonContent = () => {
      if (store.loadingPhone) {
        return (
          <Typography width={'100%'} textTransform={'none'}>
            Загрузка...
          </Typography>
        );
      }

      const conditions = [
        {
          condition: realEstate.phone,
          content: (
            <Typography
              width={'100%'}
              textTransform={'none'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              gap={'8px'}
              onClick={() => makeCall(realEstate.id)}
            >
              <img src={phoneIcon} alt={''} />
              {formatPhoneNumber(realEstate.phone)}
            </Typography>
          ),
        },
        {
          condition: !phoneException,
          content: (
            <Typography width={'100%'} textTransform={'none'} onClick={() => store.findPhoneById(realEstate.id)}>
              Запросить телефон
            </Typography>
          ),
        },
        {
          condition: true,
          content: (
            <Link
              to={`https://${ParserDomain[realEstate.domain]}${realEstate.url}`}
              target={'_blank'}
              rel={'noopener noreferrer'}
              style={{ textTransform: 'none', color: theme.palette.common.white, width: '100%' }}
            >
              Посмотреть на агрегаторе
            </Link>
          ),
        },
      ];

      const matchingCondition = conditions.find((conditionObject) => conditionObject.condition);

      return matchingCondition ? matchingCondition.content : null;
    };

    return (
      <CommentObjectInfoContainer>
        <Stack flexDirection={'row'} gap={'4px'} width={'100%'} alignItems={'baseline'}>
          <Typography
            color={theme.palette.text.primary}
            fontSize={FontSize.TWENTY_FONT}
            fontFamily={FontFamily.ROBOTO}
            fontWeight={FontWeight.MEDIUM}
          >
            {formatPrice(price)} {CurrencySymbol[realEstate.currency]}
          </Typography>
          {isPriceHistoryVisible(realEstate.price, realEstate.priceHistory) && (
            <UITooltipWithPrice data={{ priceHistory: realEstate.priceHistory }} price={realEstate.price} />
          )}
        </Stack>
        <Stack flexDirection={'column'} marginTop={'14px'}>
          <Typography
            fontSize={FontSize.SIXTEENTH_FONT}
            fontFamily={FontFamily.ROBOTO}
            color={theme.palette.text.primary}
          >
            {address}
          </Typography>
          {isExistMetroParams && (
            <Box display={'flex'} alignItems={'center'}>
              <img src={metroStationIcon} alt={''} />
              <Typography
                fontSize={FontSize.SIXTEENTH_FONT}
                fontFamily={FontFamily.ROBOTO}
                color={theme.palette.text.secondary}
              >
                {metroStationName}
              </Typography>
            </Box>
          )}
          <Box marginTop={'12px'} display={'flex'} alignItems={'center'} flexWrap={'wrap'}>
            <Typography>
              <Link
                style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}
                to={`https://${ParserDomain[domain]}${url}`}
                target={'_blank'}
                rel='noreferrer noopener'
              >
                {getDomain(domain, catalogStore.findDomains())}
              </Link>
              ,{' '}
              {getClientNameByAuthor({
                author,
                clientName,
              })}
            </Typography>
          </Box>
        </Stack>
        <Box
          display={'flex'}
          flexDirection={'row'}
          alignItems={'flex-start'}
          marginTop={'20px'}
          gap={'8px'}
          whiteSpace={'nowrap'}
          width={'100%'}
        >
          <Button
            onClick={toggleCommentDrawer(Anchor.ANCHOR_RIGHT, true)}
            variant={'outlined'}
            sx={{ borderRadius: '8px', padding: '5px 18px' }}
          >
            <img src={commentBlueIcon} alt={''} />
          </Button>
          {realEstate && (
            <FormControl fullWidth>
              <FormGroup>
                <CallButton variant={'contained'} disabled={Boolean(realEstate.callingUser)}>
                  {renderCallButtonContent()}
                </CallButton>
                {phoneException && (
                  <FormHelperText sx={{ marginLeft: '0px' }}>Получить номер не удалось</FormHelperText>
                )}
                {realEstate.callingUser &&
                  (isMyCall ? (
                    <FormHelperText sx={{ marginLeft: '0px' }}>Вы звоните</FormHelperText>
                  ) : (
                    <FormHelperText sx={{ marginLeft: '0px' }}>Кто-то уже звонит</FormHelperText>
                  ))}
                {!realEstate.callingUser &&
                  Boolean(realEstate.calls.length) &&
                  isActualLastCallTime(realEstate.calls[0].createdAt) && (
                    <FormHelperText sx={{ marginLeft: '0px' }}>
                      {convertLastCallDate(realEstate.calls[0].createdAt)}
                    </FormHelperText>
                  )}
              </FormGroup>
            </FormControl>
          )}
        </Box>
        <Box onClick={toggleImagesDrawer(Anchor.ANCHOR_RIGHT, Boolean(realEstate.images.length))}>
          <SliderComponent
            store={store}
            width={'320px'}
            marginTop={'24px'}
            marginBottom={'24px'}
            realEstateId={id}
            cursor={'pointer'}
          />
        </Box>
        <Box>
          <StatusChip statuses={statuses} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
          <CommentDrawer
            commentCount={realEstate._count.comments}
            store={store}
            realEstateId={id}
            state={openCommentDrawer}
            setOpenedDrawerCommentId={setOpenedDrawer}
            onClose={toggleCommentDrawer(Anchor.ANCHOR_RIGHT, false)}
            hideBackdrop={true}
            showHeader={false}
            isFromCallInfoDrawer={true}
          />
          <DrawerImages
            store={store}
            realEstateId={realEstate.id}
            state={openImagesDrawer}
            onClose={toggleImagesDrawer(Anchor.ANCHOR_RIGHT, false)}
          />
        </Box>
      </CommentObjectInfoContainer>
    );
  },
);

export default MainSectionObjectInfoContainer;
