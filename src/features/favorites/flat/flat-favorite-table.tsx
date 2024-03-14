import React, { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { useRootStore } from '../../../root-store.context';
import { observer } from 'mobx-react';
import { MainTableFavoriteContainer, Text } from '../../../shared/styles/styles';
import {
  Avatar,
  Badge,
  Button,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { FontSize } from '../../../shared/enums/font-size.enum';
import { FontFamily } from '../../../shared/enums/font-family.enum';
import { CurrencySymbol } from '../../../shared/enums/currency-symbol.enum';
import UITooltipWithIcon from '../../../shared/ui-kit/tooltips/tooltip-with-icon';
import { Flat } from '../../../entities/real-estate/flat';
import copyIcon from '../../../shared/assets/icons/copyIcon.svg';
import copy from 'clipboard-copy';
import { FontWeight } from '../../../shared/enums/font-weight.enum';
import locationIcon from '../../../shared/assets/icons/locationIcon.svg';
import UITooltipWithPrice from '../../../shared/ui-kit/tooltips/tooltip-with-price';
import { formatPrice } from '../../../shared/lib/format-price-number';
import { DealType } from '../../../shared/enums/deal-type.enum';
import { calculateCostSquareMeter } from '../../../shared/lib/calculate-cost-square-meter';
import { Link } from 'react-router-dom';
import { ParserDomain } from '../../../shared/enums/parser-domain.enum';
import { getDomain } from '../../../shared/lib/get-domain-name';
import UITooltipDefault from '../../../shared/ui-kit/tooltips/tooltip-default';
import { getClientNameByAuthor } from '../../../shared/lib/get-client-name-author';
import { Size } from '../../../shared/enums/size.enum';
import { formatISODate } from '../../../shared/lib/convert-timestamp-to-dateTime';
import commentIcon from '../../../shared/assets/icons/commentIcon.svg';
import { environments } from '../../../environment';
import { PhotoSize } from '../../../shared/enums/photo-size.enum';
import warningBlueIcon from '../../../shared/assets/icons/warningBlueIcon.svg';
import { InitialState, PageLimit } from '../../../shared/enums/pagination.enum';
import { convertEnumWithNumberToArray } from '../../../shared/lib/convert-enum-with-number-to-array';
import { theme } from '../../../app/providers/theme';
import { ColumnVisibilityState } from '../../../shared/types/column-visibility-state';
import { Status } from '../../../entities/status';
import { SocketContext } from '../../../socket';
import { WsEvent } from '../../../shared/enums/ws-event';
import { CallData } from '../../../shared/types/call-data';
import { hasFullDuplicate } from '../../../shared/lib/has-full-duplicate';
import { ListingStatus } from '../../../shared/enums/listing-status.enum';
import IsFavoriteIcon from '../../../shared/ui-kit/favorite-icon/is-favorite-icon';
import IsNotFavoriteIcon from '../../../shared/ui-kit/favorite-icon/is-not-favorite-icon';
import { renderRoomCount } from '../../../shared/lib/get-room-count';
import { StatusName } from '../../../shared/enums/status.enum';
import { DefaultValue } from '../../../shared/enums/default-values.enum';
import { isPriceHistoryVisible } from '../../../shared/lib/is-price-history-visible';
import { useUser } from '../../../user-context';

type FlatFavoriteTableProps = {
  columnVisibility: ColumnVisibilityState;
  setOpenedCommentDrawerId: (id: string | null) => void;
  handleOpenSnackBar: () => void;
  setOpenedMakeCallDrawerId: (id: string | null) => void;
  setOpenedDuplicateDrawerId: (id: string | null) => void;
  setIsOpenDuplicateModal: Dispatch<SetStateAction<boolean>>;
  statuses: Status[];
  openMakeCallDrawerId: string | null;
  openCommentDrawerId: string | null;
  setIsMySaveCrm: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenSaveCRMSnackbar: () => void;
  setIsMyDuplicate: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenDuplicateSnackbar: () => void;
  setOpenedMapDrawerId: (id: string | null) => void;
};

const FlatFavoriteTable: React.FC<FlatFavoriteTableProps> = observer(
  ({
    columnVisibility,
    setOpenedCommentDrawerId,
    handleOpenSnackBar,
    setOpenedMakeCallDrawerId,
    setOpenedDuplicateDrawerId,
    setIsOpenDuplicateModal,
    statuses,
    openCommentDrawerId,
    openMakeCallDrawerId,
    setIsMySaveCrm,
    handleOpenSaveCRMSnackbar,
    setIsMyDuplicate,
    handleOpenDuplicateSnackbar,
    setOpenedMapDrawerId,
  }) => {
    const { flatStore, catalogStore } = useRootStore();
    const user = useUser();

    useEffect(() => {
      catalogStore.fetchDomains();
      flatStore.fetchFavoriteCount(user.id);
    }, [flatStore.page, flatStore.rowsPerPage]);

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

        flatStore.removeById(realEstateId);
        await flatStore.removeFromFavourites(realEstateId);
      });
    socket
      .off(WsEvent.CALL_STARTED)
      .on(WsEvent.CALL_STARTED, ({ userId, avatarUrl, fullName, realEstateId }: CallData) => {
        flatStore.reserveForCall({
          realEstateId: realEstateId,
          userId,
          avatarUrl,
          fullName,
        });
      });
    socket.off(WsEvent.CALL_ENDED).on(WsEvent.CALL_ENDED, ({ realEstateId }: { realEstateId: string }) => {
      flatStore.cancelReservationForCall(realEstateId);
    });
    socket.off(WsEvent.CLIENT_DISCONNECTED).on(WsEvent.CLIENT_DISCONNECTED, ({ userId }: { userId: string }) => {
      flatStore.handleDisconnect(userId);
    });
    socket
      .off(WsEvent.DUPLICATE_ADDED)
      .on(WsEvent.DUPLICATE_ADDED, async ({ realEstateId, userId }: { realEstateId: string; userId: string }) => {
        if (openCommentDrawerId === realEstateId || openMakeCallDrawerId === realEstateId) {
          handleOpenOtherDuplicateSnackbar();

          setOpenedMakeCallDrawerId(null);
          setOpenedCommentDrawerId(null);
        }

        setIsOpenDuplicateModal(false);

        if (userId === user.id) {
          handleOpenMyDuplicateSnackbar();
        }

        flatStore.removeById(realEstateId);
        await flatStore.removeFromFavourites(realEstateId);
      });

    const getStatusByFlat = (flat: Flat): Status | null => {
      const status = statuses.find((status) => status.id === flat.userStatus?.statusId);

      return status ?? null;
    };

    const handleOpenMySaveCrmSnackbar = () => {
      setIsMySaveCrm(true);
      handleOpenSaveCRMSnackbar();
    };

    const handleOpenOtherSaveCrmSnackbar = () => {
      setIsMySaveCrm(false);
      handleOpenSaveCRMSnackbar();
    };

    const handleOpenMyDuplicateSnackbar = () => {
      setIsMyDuplicate(true);
      handleOpenDuplicateSnackbar();
    };

    const handleOpenOtherDuplicateSnackbar = () => {
      setIsMyDuplicate(false);
      handleOpenDuplicateSnackbar();
    };

    return (
      <>
        <MainTableFavoriteContainer>
          <Table stickyHeader>
            <TableHead sx={{ maxHeight: '30px' }}>
              <TableRow>
                <TableCell
                  sx={{
                    minWidth: '300px',
                    color: theme.palette.text.primary,
                    padding: '16px 0 36px 16px',
                  }}
                >
                  Адрес
                </TableCell>
                <TableCell
                  sx={{
                    minWidth: '50px',
                    color: theme.palette.text.primary,
                    padding: '16px 0 36px 16px',
                  }}
                ></TableCell>
                {columnVisibility.floor && (
                  <TableCell
                    sx={{
                      minWidth: '68px',
                      color: theme.palette.text.primary,
                      padding: '16px 0 36px 0px',
                    }}
                    align='right'
                  >
                    Этаж
                  </TableCell>
                )}
                {columnVisibility.area && (
                  <TableCell
                    sx={{
                      minWidth: '93px',
                      color: theme.palette.text.primary,
                      padding: '16px 0 36px 0px',
                    }}
                    align='right'
                  >
                    Площ, м²
                  </TableCell>
                )}
                {columnVisibility.rooms && (
                  <TableCell
                    sx={{
                      minWidth: '64px',
                      color: theme.palette.text.primary,
                      padding: '16px 0 36px 0px',
                    }}
                    align='right'
                  >
                    Ком.
                  </TableCell>
                )}
                <TableCell
                  sx={{
                    minWidth: '150px',
                    verticalAlign: 'top',
                    padding: '16px 16px 36px 0px',
                  }}
                  align='right'
                >
                  <Stack sx={{ marginBottom: '-20px' }}>
                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                      }}
                    >
                      <Stack alignItems={'flex-start'} flexDirection={'row'}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            marginTop: '2px',
                          }}
                        >
                          <Typography
                            fontSize={FontSize.FOURTEENTH_FONT}
                            style={{
                              fontWeight: 'var(--unstable_DataGrid-headWeight)',
                              fontFamily: FontFamily.ROBOTO,
                            }}
                          >
                            Цена, {CurrencySymbol.RUB}
                          </Typography>
                          <Box style={{ display: 'flex' }}>
                            <Typography
                              fontSize={FontSize.FOURTEENTH_FONT}
                              style={{
                                color: theme.palette.text.secondary,
                                fontFamily: FontFamily.ROBOTO,
                              }}
                            >
                              Цена за м², {CurrencySymbol.RUB}
                            </Typography>
                          </Box>
                        </Box>
                        <UITooltipWithIcon
                          text={'Мы постоянно проверяем информацию об актуальности цен на агрегаторах'}
                          width={'226px'}
                          icon={{
                            sx: {
                              marginLeft: '4px',
                            },
                          }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </TableCell>
                {columnVisibility.source && (
                  <TableCell sx={{ minWidth: '190px', padding: '16px 0 36px 16px' }} align='left'>
                    <Stack sx={{ marginBottom: '-20px' }}>
                      <Box style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          fontSize={FontSize.FOURTEENTH_FONT}
                          style={{
                            fontWeight: 'var(--unstable_DataGrid-headWeight)',
                          }}
                        >
                          Источник
                        </Typography>
                        <Typography fontSize={FontSize.FOURTEENTH_FONT} style={{ color: theme.palette.text.secondary }}>
                          Автор
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                )}
                {columnVisibility.status && (
                  <TableCell
                    sx={{
                      minWidth: '150px',
                      color: theme.palette.text.primary,
                      padding: '16px 0 36px 0px',
                    }}
                    align='left'
                  >
                    Статус
                  </TableCell>
                )}
                {columnVisibility.publishedAt && (
                  <TableCell
                    sx={{
                      minWidth: '150px',
                      color: theme.palette.text.primary,
                      padding: '16px 0 36px 0px',
                    }}
                    align='left'
                  >
                    <Stack
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexDirection: 'row',
                      }}
                    >
                      <Box style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          fontSize={FontSize.FOURTEENTH_FONT}
                          style={{
                            fontWeight: 'var(--unstable_DataGrid-headWeight)',
                          }}
                        >
                          Опубликован
                        </Typography>
                      </Box>
                      <UITooltipWithIcon text={'Дата публикации на агрегаторе'} />
                    </Stack>
                  </TableCell>
                )}
                <TableCell sx={{ maxWidth: '66px' }}></TableCell>
                <TableCell sx={{ maxWidth: '91px' }}></TableCell>
                <TableCell sx={{ maxWidth: '130px' }}></TableCell>
              </TableRow>
            </TableHead>
            {!flatStore.loading && (
              <TableBody>
                {flatStore.realEstate.map((flat: Flat) => {
                  const status = getStatusByFlat(flat);

                  return (
                    <TableRow
                      key={flat.id}
                      sx={{
                        height: '48px',
                        '&:last-child td, &:last-child th': { borderBottom: '1px solid rgba(19, 29, 53, 0.12)' },
                        '&:hover': {
                          backgroundColor: 'rgba(19, 29, 53, 0.04)',
                          cursor: 'pointer',
                        },
                        '&:hover .hoverable-cell': {
                          opacity: 1,
                          display: 'flex',
                        },
                      }}
                    >
                      <TableCell align='left' sx={{ verticalAlign: 'top', padding: '6px 0 0 16px' }}>
                        <Box
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            flexDirection: 'column',
                          }}
                        >
                          {flat.address.trim() ? flat.address : DefaultValue.DEFAULT_ADDRESS}
                          <Box
                            className='hoverable-cell'
                            sx={{
                              alignItems: 'center',
                              gap: '10px',
                            }}
                          >
                            <img src={copyIcon} alt='' />
                            <Tooltip
                              componentsProps={{
                                tooltip: {
                                  sx: {
                                    borderRadius: '8px',
                                  },
                                },
                              }}
                              classes={{ tooltip: 'custom-tooltip' }}
                              title={
                                <Typography fontFamily={FontFamily.ROBOTO} fontSize={FontSize.FOURTEENTH_FONT}>
                                  Скопировать код объекта
                                </Typography>
                              }
                              arrow={true}
                            >
                              <Typography
                                onClick={() => {
                                  copy(flat.id);
                                  handleOpenSnackBar();
                                }}
                                fontSize={FontSize.FOURTEENTH_FONT}
                                fontWeight={FontWeight.REGULAR}
                                fontFamily={FontFamily.ROBOTO}
                                sx={{
                                  whiteSpace: 'nowrap',
                                  color: theme.palette.primary.main,
                                }}
                              >
                                Скопировать код
                              </Typography>
                            </Tooltip>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align='left' sx={{ verticalAlign: 'top', padding: '6px 0 0 16px' }}>
                        <Box
                          className='hoverable-cell'
                          style={{
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <img onClick={() => setOpenedMapDrawerId(flat.id)} src={locationIcon} alt={''} />
                        </Box>
                      </TableCell>
                      {columnVisibility.floor && (
                        <TableCell align='right' sx={{ verticalAlign: 'top', padding: '6px 0 0 0px' }}>
                          {flat.floor ? flat.floor : '-'}
                        </TableCell>
                      )}
                      {columnVisibility.area && (
                        <TableCell align='right' sx={{ verticalAlign: 'top', padding: '6px 0 0 0px' }}>
                          {flat.area}
                        </TableCell>
                      )}
                      {columnVisibility.rooms && (
                        <TableCell align='right' sx={{ verticalAlign: 'top', padding: '6px 0 0 0px' }}>
                          {renderRoomCount(flat.roomCount)}
                        </TableCell>
                      )}
                      <TableCell align='right' sx={{ verticalAlign: 'top', padding: '4px 16px 0 0px' }}>
                        <Stack flexDirection={'row'} alignItems={'flex-start'} justifyContent={'end'}>
                          <Stack sx={{ float: 'right' }}>
                            <Box
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Box
                                style={{
                                  fontFamily: FontFamily.ROBOTO_MONO,
                                  fontWeight: FontWeight.MEDIUM,
                                  width: '110px',
                                }}
                              >
                                {formatPrice(flat.price)}
                              </Box>
                            </Box>
                            {flat.dealType === DealType.SALE && (
                              <Box
                                style={{
                                  fontFamily: FontFamily.ROBOTO_MONO,
                                  whiteSpace: 'nowrap',
                                  color: 'gray',
                                  float: 'left',
                                }}
                              >
                                {calculateCostSquareMeter({
                                  price: flat.price,
                                  square: flat.area,
                                  isFormatPrice: true,
                                })}
                              </Box>
                            )}
                          </Stack>
                          <Box visibility={isPriceHistoryVisible(flat.price, flat.priceHistory) ? 'visible' : 'hidden'}>
                            <UITooltipWithPrice data={{ priceHistory: flat.priceHistory }} price={flat.price} />
                          </Box>
                        </Stack>
                      </TableCell>
                      {columnVisibility.source && (
                        <TableCell align='left' sx={{ verticalAlign: 'top', padding: '6px 0 0 16px' }}>
                          <Stack
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <Link
                              style={{
                                color: theme.palette.primary.main,
                                textDecoration: 'underline',
                              }}
                              to={`https://${ParserDomain[flat.domain]}${flat.url}`}
                              target={'_blank'}
                              rel='noreferrer noopener'
                            >
                              {getDomain(flat.domain, catalogStore.findDomains())}
                            </Link>
                            <Box style={{ whiteSpace: 'nowrap' }}>
                              <UITooltipDefault
                                text={getClientNameByAuthor({
                                  author: flat.author,
                                  clientName: flat.clientName,
                                })}
                              />
                            </Box>
                          </Stack>
                        </TableCell>
                      )}
                      {columnVisibility.status && (
                        <TableCell align='left' sx={{ verticalAlign: 'top', padding: '6px 0 0 0px' }}>
                          <Chip
                            sx={{
                              width: 'fit-content',
                              backgroundColor: `#${status?.hexColor}`,
                              display: 'flex',
                              padding: '3px',
                              color: !status ? theme.palette.text.primary : 'white',
                              alignItems: 'center',
                            }}
                            label={!status ? StatusName.NOT_SELECTED : status.name}
                            size={Size.SMALL}
                            variant='filled'
                          />
                        </TableCell>
                      )}
                      {columnVisibility.publishedAt && (
                        <TableCell align='left' sx={{ verticalAlign: 'top', padding: '6px 0 0 0px' }}>
                          {formatISODate(flat.publishedAt)}
                        </TableCell>
                      )}
                      <TableCell align='left' sx={{ verticalAlign: 'top', padding: '4px 16px 0 0px' }}>
                        <IconButton
                          disableRipple
                          sx={{
                            '&:hover': { backgroundColor: 'rgba(252,106,106,0.05)' },
                            padding: '5px',
                          }}
                          onClick={() => flatStore.changeFavourite(flat.id)}
                          style={{ marginRight: '8px' }}
                        >
                          {flat.isFavourite ? <IsFavoriteIcon /> : <IsNotFavoriteIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell align='left' sx={{ verticalAlign: 'top', padding: '4px 16px 0 0px' }}>
                        <Stack
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <img
                            className={'commentButton'}
                            onClick={() => setOpenedCommentDrawerId(flat.id)}
                            src={commentIcon}
                            alt={''}
                          />
                          <Badge variant='standard' badgeContent={flat._count.comments} />
                        </Stack>
                      </TableCell>
                      <TableCell align='left' sx={{ verticalAlign: 'top', padding: '6px 16px 0px 32px' }}>
                        {flat.callingUser ? (
                          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                            <Avatar
                              src={`${environments.REACT_APP_CDN}${PhotoSize.EXTRA_SMALL}${flat.callingUser.avatarUrl}`}
                            />
                            <Typography
                              sx={{ padding: '6px 0' }}
                              color={theme.palette.text.secondary}
                              fontSize={FontSize.FOURTEENTH_FONT}
                            >
                              Звонит
                            </Typography>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: 'flex',
                              gap: '4px',
                              alignItems: 'center',
                              flexDirection: 'column',
                            }}
                          >
                            <Button
                              onClick={() => setOpenedMakeCallDrawerId(flat.id)}
                              disabled={
                                Boolean(flat.callingUser) || hasFullDuplicate(flat.duplicates) || !flat.isActive
                              }
                              variant={'contained'}
                              size={Size.SMALL}
                              sx={{
                                padding: '4px 10px',
                                boxShadow: 'none',
                                fontSize: '13px',
                                fontWeight: '400',
                                color:
                                  hasFullDuplicate(flat.duplicates) || !flat.isActive
                                    ? `${theme.palette.text.primary} !important`
                                    : 'white',

                                borderRadius: `${flat.isActive && !hasFullDuplicate(flat.duplicates) ? '8px' : '45px'}`,
                                textTransform: 'none',
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                  background: '#2b63be',
                                  boxShadow: 'none',
                                },
                              }}
                            >
                              {(hasFullDuplicate(flat.duplicates) && ListingStatus.DUPLICATE) ||
                                (flat.isActive ? ListingStatus.CALL : ListingStatus.NOT_ACTIVE)}
                            </Button>
                            <Button
                              sx={{
                                padding: '4px 10px',
                                borderRadius: '8px',
                                marginBottom: '8px',
                                visibility: `${hasFullDuplicate(flat.duplicates) && 'hidden'}`,
                              }}
                              className={'filterButton hoverable-cell'}
                            >
                              <Text
                                sx={{
                                  whiteSpace: 'nowrap',
                                  fontFamily: FontFamily.ROBOTO,
                                  color: theme.palette.primary.main,
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  setOpenedDuplicateDrawerId(flat.id);
                                  setIsOpenDuplicateModal(true);
                                }}
                              >
                                <img src={warningBlueIcon} alt={''} />
                                Дубль
                              </Text>
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </MainTableFavoriteContainer>
        <TablePagination
          component='div'
          count={flatStore.count}
          page={flatStore.page - 1}
          onPageChange={(event, newPage) => flatStore.setPage(newPage + 1)}
          rowsPerPage={flatStore.rowsPerPage}
          onRowsPerPageChange={(event) => {
            flatStore.setRowsPerPage(+event.target.value);
            flatStore.setPage(InitialState.FIRST);
          }}
          rowsPerPageOptions={convertEnumWithNumberToArray(PageLimit)}
          sx={{ borderTop: '1px solid #E0E0E0' }}
        />
      </>
    );
  },
);

export default FlatFavoriteTable;
