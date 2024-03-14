import React, { useContext, useState } from 'react';
import SliderComponent from '../../../shared/ui-kit/slider/slider';
import { Badge, Box, Chip, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { FontFamily } from '../../../shared/enums/font-family.enum';
import { FontSize } from '../../../shared/enums/font-size.enum';
import { FontWeight } from '../../../shared/enums/font-weight.enum';
import { formatPrice } from '../../../shared/lib/format-price-number';
import { CurrencySymbol } from '../../../shared/enums/currency-symbol.enum';
import UITooltipWithPrice from '../../../shared/ui-kit/tooltips/tooltip-with-price';
import { formatISODate } from '../../../shared/lib/convert-timestamp-to-dateTime';
import { Size } from '../../../shared/enums/size.enum';
import commentIcon from '../../../shared/assets/icons/commentIcon.svg';
import warningIcon from '../../../shared/assets/icons/warningGrayIcon.svg';
import { RealEstateType } from '../../../shared/enums/real-estate-type.enum';
import {
  CallCardButton,
  CardButtonContainer,
  CardStatusCommentBox,
  CommentBox,
  FooterButtonContainer,
} from '../../../shared/styles/styles';
import { getItemDeclension } from '../../../shared/lib/get-item-declension';
import { Flat } from '../../../entities/real-estate/flat';
import { House } from '../../../entities/real-estate/house';
import { Land } from '../../../entities/real-estate/land';
import { calculateCostSquareMeter } from '../../../shared/lib/calculate-cost-square-meter';
import { Status } from '../../../entities/status';
import { observer } from 'mobx-react';
import { Store } from '../../../shared/lib/store';
import { SocketContext } from '../../../socket';
import { WsEvent } from '../../../shared/enums/ws-event';
import { InitialState } from '../../../shared/enums/pagination.enum';
import { useRootStore } from '../../../root-store.context';
import IsFavoriteIcon from '../../../shared/ui-kit/favorite-icon/is-favorite-icon';
import IsNotFavoriteIcon from '../../../shared/ui-kit/favorite-icon/is-not-favorite-icon';
import { DealType } from '../../../shared/enums/deal-type.enum';
import { StatusName } from '../../../shared/enums/status.enum';
import { DefaultValue } from '../../../shared/enums/default-values.enum';
import { isPriceHistoryVisible } from '../../../shared/lib/is-price-history-visible';
import { useUser } from '../../../user-context';

type CardProps = {
  type: RealEstateType;
  realEstate: Flat | House | Land;
  setOpenedMakeCallDrawerId: (id: string | null) => void;
  setOpenedCommentDrawerId: (id: string | null) => void;
  handleOpenDoubleModal: (id: string) => void;
  store: Store<Flat | House | Land>;
  openMakeCallDrawerId: string | null;
  openCommentDrawerId: string | null;
  setIsOpenSaveCRMSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMySaveCrm: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenDuplicateSnackbar: () => void;
  setIsMyDuplicate: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenDuplicateModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Card: React.FC<CardProps> = observer(
  ({
    realEstate,
    type,
    setOpenedMakeCallDrawerId,
    setOpenedCommentDrawerId,
    handleOpenDoubleModal,
    store,
    openCommentDrawerId,
    openMakeCallDrawerId,
    setIsOpenSaveCRMSnackbar,
    setIsMySaveCrm,
    handleOpenDuplicateSnackbar,
    setIsMyDuplicate,
    setIsOpenDuplicateModal,
  }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const theme = useTheme();
    const { catalogStore } = useRootStore();
    const user = useUser();
    const getStatusByRealEstate = (): Status | null => {
      const status = catalogStore.findStatusByUserId(realEstate.userStatus?.statusId || null);

      if (!status) {
        return null;
      }

      return status;
    };

    const status = getStatusByRealEstate();

    const handleOpenMySaveCrmSnackbar = () => {
      setIsMySaveCrm(true);
      setIsOpenSaveCRMSnackbar(true);
    };

    const handleOpenOtherSaveCrmSnackbar = () => {
      setIsMySaveCrm(false);
      setIsOpenSaveCRMSnackbar(true);
    };
    const socket = useContext(SocketContext);

    socket
      .off(WsEvent.REAL_ESTATE_SAVED)
      .on(WsEvent.REAL_ESTATE_SAVED, async ({ realEstateId, userId }: { realEstateId: string; userId: string }) => {
        if (openCommentDrawerId === realEstateId || openMakeCallDrawerId === realEstateId) {
          handleOpenOtherSaveCrmSnackbar();

          setOpenedMakeCallDrawerId(null);
          setOpenedCommentDrawerId(null);
        }

        if (user.id === userId) {
          handleOpenMySaveCrmSnackbar();
        }

        store.removeById(realEstateId);
      });

    const handleOpenMyDuplicateSnackbar = () => {
      setIsMyDuplicate(true);
      handleOpenDuplicateSnackbar();
    };

    const handleOpenOtherDuplicateSnackbar = () => {
      setIsMyDuplicate(false);
      handleOpenDuplicateSnackbar();
    };

    socket
      .off(WsEvent.DUPLICATE_ADDED)
      .on(WsEvent.DUPLICATE_ADDED, ({ realEstateId, userId }: { realEstateId: string; userId: string }) => {
        if (openCommentDrawerId === realEstateId || openMakeCallDrawerId === realEstateId) {
          handleOpenOtherDuplicateSnackbar();

          setOpenedMakeCallDrawerId(null);
          setOpenedCommentDrawerId(null);
        }

        setIsOpenDuplicateModal(false);

        if (userId === user.id) {
          handleOpenMyDuplicateSnackbar();
        }

        store.removeById(realEstateId);
      });

    return (
      <Box
        marginBottom={'0'}
        width={'240px'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SliderComponent
          cursor={'default'}
          store={store}
          width={'240px'}
          marginTop={'0'}
          marginBottom={'4px'}
          realEstateId={realEstate.id}
        />
        <Typography
          color={theme.palette.text.primary}
          fontFamily={FontFamily.ROBOTO}
          fontSize={FontSize.SIXTEENTH_FONT}
          fontWeight={FontWeight.REGULAR}
        >
          {type === RealEstateType.FLATS &&
            `${getItemDeclension((realEstate as Flat).roomCount, ['комната', 'комнаты', 'комнат'])}, ${
              realEstate.area ? (realEstate as Flat).area : InitialState.ZERO
            } м², этаж ${(realEstate as Flat).floor ? (realEstate as Flat).floor : InitialState.ZERO}/${
              (realEstate as Flat).floorCount ? (realEstate as Flat).floorCount : InitialState.ZERO
            }`}

          {type === RealEstateType.HOUSES &&
            `${realEstate.area ? (realEstate as House).landArea : InitialState.ZERO} сот., ${
              (realEstate as House).area ? (realEstate as House).area : InitialState.ZERO
            } м²`}
          {type === RealEstateType.LANDS &&
            `${(realEstate as Land).area ? (realEstate as Land).area : InitialState.ZERO} сот.`}
        </Typography>
        <Box>
          <Stack flexDirection={'row'} alignItems={'center'} gap={'4px'}>
            <Typography
              sx={{
                height: '32px',
              }}
              color={theme.palette.text.primary}
              fontFamily={FontFamily.ROBOTO}
              fontSize={FontSize.TWENTY_FONT}
              fontWeight={FontWeight.MEDIUM}
            >
              {formatPrice(realEstate.price)} {CurrencySymbol.RUB}
            </Typography>
            {isPriceHistoryVisible(realEstate.price, realEstate.priceHistory) && (
              <UITooltipWithPrice data={{ priceHistory: realEstate.priceHistory }} price={realEstate.price} />
            )}
          </Stack>
          <Typography
            color={theme.palette.text.primary}
            fontFamily={FontFamily.ROBOTO}
            fontSize={FontSize.SIXTEENTH_FONT}
            fontWeight={FontWeight.REGULAR}
          >
            {realEstate.dealType === DealType.SALE &&
              [
                calculateCostSquareMeter({
                  price: realEstate.price,
                  square: realEstate.area,
                  isFormatPrice: true,
                }),
                `${CurrencySymbol.RUB} за м²`,
              ].join(' ')}
          </Typography>
        </Box>
        <Typography
          marginTop={'4px'}
          className={'truncate-text-card'}
          color={theme.palette.text.primary}
          fontFamily={FontFamily.ROBOTO}
          fontSize={FontSize.FOURTEENTH_FONT}
          fontWeight={FontWeight.REGULAR}
        >
          {realEstate.address.trim() ? realEstate.address : DefaultValue.DEFAULT_ADDRESS}
        </Typography>
        <Typography
          marginTop={'4px'}
          color={theme.palette.text.secondary}
          fontFamily={FontFamily.ROBOTO}
          fontSize={FontSize.FOURTEENTH_FONT}
          fontWeight={FontWeight.REGULAR}
        >
          Опубликован: {formatISODate(realEstate.publishedAt)}
        </Typography>
        <CardStatusCommentBox>
          <Chip
            sx={{
              width: 'fit-content',
              backgroundColor: `#${status?.hexColor}`,
              display: 'flex',
              padding: '3px',
              color: status?.id == null ? theme.palette.text.primary : 'white',
              alignItems: 'center',
            }}
            label={!status ? StatusName.NOT_SELECTED : status?.name}
            size={Size.SMALL}
            variant='filled'
          />
          <CommentBox onClick={() => setOpenedCommentDrawerId(realEstate.id)}>
            <img className={'commentButton'} src={commentIcon} alt={''} />
            <Badge variant={'standard'} badgeContent={realEstate._count.comments} />
          </CommentBox>
        </CardStatusCommentBox>
        <FooterButtonContainer>
          <IconButton
            disableRipple
            sx={{
              display: isHovered || realEstate.isFavourite ? 'visible' : 'hidden',
              '&:hover': { backgroundColor: 'rgba(252,106,106,0.05)' },
              padding: '5px',
            }}
            onClick={() => store.changeFavourite(realEstate.id)}
            style={{ marginRight: '8px' }}
          >
            {realEstate.isFavourite ? <IsFavoriteIcon fontSize={'small'} /> : <IsNotFavoriteIcon fontSize={'small'} />}
          </IconButton>
          <CardButtonContainer visibility={isHovered ? 'visible' : 'hidden'}>
            <CallCardButton
              onClick={() => setOpenedMakeCallDrawerId(realEstate.id)}
              variant={'contained'}
              color={'primary'}
              size={Size.SMALL}
            >
              Позвонить
            </CallCardButton>
            <img onClick={() => handleOpenDoubleModal(realEstate.id)} src={warningIcon} alt={''} />
          </CardButtonContainer>
        </FooterButtonContainer>
      </Box>
    );
  },
);

export default Card;
