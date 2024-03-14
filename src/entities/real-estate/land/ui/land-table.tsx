import React, { Dispatch, SetStateAction, useContext, useEffect } from 'react';
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
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import { FontSize } from '../../../../shared/enums/font-size.enum';
import locationIcon from '../../../../shared/assets/icons/locationIcon.svg';
import commentIcon from '../../../../shared/assets/icons/commentIcon.svg';
import { MainTableContainer, Text } from '../../../../shared/styles/styles';
import warningBlueIcon from '../../../../shared/assets/icons/warningBlueIcon.svg';
import { ColumnVisibilityState } from '../../../../shared/types/column-visibility-state';
import copyIcon from '../../../../shared/assets/icons/copyIcon.svg';
import { InitialState, PageLimit } from '../../../../shared/enums/pagination.enum';
import { formatPrice } from '../../../../shared/lib/format-price-number';
import { Land } from '../model/type';
import UITooltipWithPrice from '../../../../shared/ui-kit/tooltips/tooltip-with-price';
import UITooltipDefault from '../../../../shared/ui-kit/tooltips/tooltip-default';
import UITooltipWithIcon from '../../../../shared/ui-kit/tooltips/tooltip-with-icon';
import { getClientNameByAuthor } from '../../../../shared/lib/get-client-name-author';
import copy from 'clipboard-copy';
import { Status } from '../../../status';
import { observer } from 'mobx-react';
import { SocketContext } from '../../../../socket';
import { WsEvent } from '../../../../shared/enums/ws-event';
import { Link } from 'react-router-dom';
import { ParserDomain } from '../../../../shared/enums/parser-domain.enum';
import { useRootStore } from '../../../../root-store.context';
import { FontFamily } from '../../../../shared/enums/font-family.enum';
import { CurrencySymbol } from '../../../../shared/enums/currency-symbol.enum';
import { FontWeight } from '../../../../shared/enums/font-weight.enum';
import { Size } from '../../../../shared/enums/size.enum';
import { formatISODate } from '../../../../shared/lib/convert-timestamp-to-dateTime';
import { calculateCostSquareMeter } from '../../../../shared/lib/calculate-cost-square-meter';
import { PhotoSize } from '../../../../shared/enums/photo-size.enum';
import { CallData } from '../../../../shared/types/call-data';
import { convertEnumWithNumberToArray } from '../../../../shared/lib/convert-enum-with-number-to-array';
import { DealType } from '../../../../shared/enums/deal-type.enum';
import { getDomain } from '../../../../shared/lib/get-domain-name';
import { environments } from '../../../../environment';
import NoDataNotification from '../../../../shared/ui-kit/no-data-notification/no-data-notification';
import { NoDataMessage } from '../../../../shared/enums/no-data-message-enum';
import IsFavoriteIcon from '../../../../shared/ui-kit/favorite-icon/is-favorite-icon';
import IsNotFavoriteIcon from '../../../../shared/ui-kit/favorite-icon/is-not-favorite-icon';
import { StatusName } from '../../../../shared/enums/status.enum';
import { DictionaryPhrase } from '../../../../shared/enums/dictionary-phrase.enum';
import { match, P } from 'ts-pattern';
import { DefaultValue } from '../../../../shared/enums/default-values.enum';
import { isPriceHistoryVisible } from '../../../../shared/lib/is-price-history-visible';
import { useUser } from '../../../../user-context';
import { TimeConvert } from '../../../../shared/enums/time-convert.enum';

export const columnViewLandTable: string[] = ['area', 'source', 'publishedAt'];

export const columnNamesLandTable: Record<string, string> = {
  publishedAt: 'Опубликован',
  source: 'Источник',
  status: 'Статус',
  area: 'Площадь участка',
};

export const initialColumnVisibilityLand: ColumnVisibilityState = {
  address: true,
  location: true,
  area: true,
  price: true,
  comment: true,
  favorite: true,
  actions: true,
  floor: true,
  publishedAt: true,
  source: true,
  status: true,
};

interface LandsGridProps {
  columnVisibility: ColumnVisibilityState;
  handleOpenSnackBar: () => void;
  statuses: Status[];
  openMakeCallDrawerId: string | null;
  openCommentDrawerId: string | null;
  setOpenedCommentDrawerId: (id: string | null) => void;
  setOpenedMakeCallDrawerId: (id: string | null) => void;
  setOpenedDuplicateDrawerId: (id: string | null) => void;
  setIsOpenDuplicateModal: Dispatch<SetStateAction<boolean>>;
  handleOpenSaveCRMSnackbar: () => void;
  setIsMySaveCrm: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenDuplicateSnackbar: () => void;
  setIsMyDuplicate: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenedMapDrawerId: (id: string | null) => void;
}

export const LandTable: React.FC<LandsGridProps> = observer(
  ({
    columnVisibility,
    setOpenedMapDrawerId,
    handleOpenSnackBar,
    statuses,
    setOpenedCommentDrawerId,
    setOpenedMakeCallDrawerId,
    openMakeCallDrawerId,
    openCommentDrawerId,
    setOpenedDuplicateDrawerId,
    setIsOpenDuplicateModal,
    handleOpenSaveCRMSnackbar,
    setIsMySaveCrm,
    handleOpenDuplicateSnackbar,
    setIsMyDuplicate,
  }) => {
    const theme = useTheme();
    const { landStore, catalogStore } = useRootStore();
    const user = useUser();
    const getStatusByLand = (land: Land): Status | null => {
      const status = statuses.find((status) => status.id === land.userStatus?.statusId);

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

        landStore.removeById(realEstateId);
      });
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

        landStore.removeById(realEstateId);
      });
    socket
      .off(WsEvent.CALL_STARTED)
      .on(WsEvent.CALL_STARTED, ({ userId, avatarUrl, fullName, realEstateId }: CallData) => {
        landStore.reserveForCall({
          realEstateId: realEstateId,
          userId,
          avatarUrl,
          fullName,
        });
      });

    socket.off(WsEvent.CALL_ENDED).on(WsEvent.CALL_ENDED, ({ realEstateId }: { realEstateId: string }) => {
      landStore.cancelReservationForCall(realEstateId);
    });

    socket.off(WsEvent.CLIENT_DISCONNECTED).on(WsEvent.CLIENT_DISCONNECTED, ({ userId }: { userId: string }) => {
      landStore.handleDisconnect(userId);
    });

    useEffect(() => {
      const fetchData = async () => {
        if (!landStore.currentFilter) {
          return;
        }

        await landStore.fetchCount(landStore.currentFilter);
        await landStore.fetchData().then(() => landStore.setChangingFilter(false));
      };

      fetchData();

      const fetchNewData = setInterval(async () => {
        await landStore.fetchNewData();
      }, TimeConvert.MILLISECONDS_IN_MINUTE);

      return () => clearInterval(fetchNewData);
    }, [landStore.currentFilter, landStore.page, landStore.rowsPerPage, landStore.currentFilter?.orderBy]);

    return (
      <>
        {match(landStore)
          .with({ loading: true }, () => null)
          .with({ isConnectedDomains: false }, () => (
            <NoDataNotification
              descriptionPrimary={DictionaryPhrase.NO_DATA_FOUND_CONNECTED_DOMAINS}
              descriptionSecondary={DictionaryPhrase.CONTACT_SUPPORT}
            />
          ))
          .with({ realEstate: P.when((lands) => !lands.length) }, () => (
            <NoDataNotification
              descriptionPrimary={NoDataMessage.NO_DATA_FOUND}
              descriptionSecondary={NoDataMessage.CHANGE_SEARCH_PARAMS}
            />
          ))
          .with({ realEstate: P.when((lands) => lands.length) }, () => (
            <>
              <MainTableContainer>
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
                      {columnVisibility.area && (
                        <TableCell
                          sx={{
                            minWidth: '130px',
                            color: theme.palette.text.primary,
                            padding: '0',
                          }}
                          align='right'
                        >
                          <Stack>
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
                                  }}
                                >
                                  <Typography
                                    fontSize={FontSize.FOURTEENTH_FONT}
                                    style={{
                                      fontWeight: 'var(--unstable_DataGrid-headWeight)',
                                      fontFamily: FontFamily.ROBOTO,
                                    }}
                                  >
                                    Площ.
                                  </Typography>
                                  <Box style={{ display: 'flex' }}>
                                    <Typography
                                      fontSize={FontSize.FOURTEENTH_FONT}
                                      style={{
                                        fontWeight: 'var(--unstable_DataGrid-headWeight)',
                                        fontFamily: FontFamily.ROBOTO,
                                      }}
                                    >
                                      cот.
                                    </Typography>
                                  </Box>
                                </Box>
                              </Stack>
                            </Box>
                          </Stack>
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
                                {landStore.currentFilter?.dealType === DealType.SALE && (
                                  <Typography
                                    fontSize={FontSize.FOURTEENTH_FONT}
                                    style={{
                                      color: theme.palette.text.secondary,
                                      fontFamily: FontFamily.ROBOTO,
                                    }}
                                  >
                                    Цена за сот, {CurrencySymbol.RUB}
                                  </Typography>
                                )}
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
                              <Typography
                                fontSize={FontSize.FOURTEENTH_FONT}
                                style={{ color: theme.palette.text.secondary }}
                              >
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
                            padding: '16px 0 36px 16px',
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
                            padding: '16px 0 36px 16px',
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
                  {!landStore.loading && (
                    <TableBody>
                      {landStore.realEstate.map((land: Land) => {
                        const status = getStatusByLand(land);

                        return (
                          <TableRow
                            key={land.id}
                            sx={{
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
                            <TableCell
                              align='left'
                              sx={{
                                verticalAlign: 'top',
                                padding: '6px 0 0 16px',
                                borderLeft: land.isNew ? '4px solid #A855F7' : 'none',
                              }}
                            >
                              <Box
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  flexDirection: 'column',
                                }}
                              >
                                {land.address.trim() ? land.address : DefaultValue.DEFAULT_ADDRESS}
                                <Box
                                  className='hoverable-cell'
                                  sx={{
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <img src={copyIcon} alt='' />
                                  <Tooltip
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
                                        copy(land.id);
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
                                <img onClick={() => setOpenedMapDrawerId(land.id)} src={locationIcon} alt={''} />
                              </Box>
                            </TableCell>
                            {columnVisibility.area && (
                              <TableCell
                                align='right'
                                sx={{
                                  verticalAlign: 'top',
                                  padding: '6px 0 0 16px',
                                }}
                              >
                                {land.area}
                              </TableCell>
                            )}
                            <TableCell
                              align='right'
                              sx={{
                                verticalAlign: 'top',
                                padding: '4px 16px 0 0px',
                              }}
                            >
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
                                      {formatPrice(land.price)}
                                    </Box>
                                  </Box>
                                  {land.dealType === DealType.SALE && (
                                    <Box
                                      style={{
                                        fontFamily: FontFamily.ROBOTO_MONO,
                                        whiteSpace: 'nowrap',
                                        color: 'gray',
                                        float: 'left',
                                      }}
                                    >
                                      {calculateCostSquareMeter({
                                        price: land.price,
                                        square: land.area,
                                        isFormatPrice: true,
                                      })}
                                    </Box>
                                  )}
                                </Stack>
                                <Box
                                  visibility={
                                    isPriceHistoryVisible(land.price, land.priceHistory) ? 'visible' : 'hidden'
                                  }
                                >
                                  <UITooltipWithPrice data={{ priceHistory: land.priceHistory }} price={land.price} />
                                </Box>
                              </Stack>
                            </TableCell>
                            {columnVisibility.source && (
                              <TableCell
                                align='left'
                                sx={{
                                  verticalAlign: 'top',
                                  padding: '6px 0 0 16px',
                                }}
                              >
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
                                    to={`https://${ParserDomain[land.domain]}${land.url}`}
                                    target={'_blank'}
                                    rel='noreferrer noopener'
                                  >
                                    {getDomain(land.domain, catalogStore.findDomains())}
                                  </Link>
                                  <Box style={{ whiteSpace: 'nowrap' }}>
                                    <UITooltipDefault
                                      text={getClientNameByAuthor({
                                        author: land.author,
                                        clientName: land.clientName,
                                      })}
                                    />
                                  </Box>
                                </Stack>
                              </TableCell>
                            )}
                            {columnVisibility.status && (
                              <TableCell
                                align='left'
                                sx={{
                                  verticalAlign: 'top',
                                  padding: '6px 0 0 0px',
                                }}
                              >
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
                              <TableCell
                                align='left'
                                sx={{
                                  verticalAlign: 'top',
                                  padding: '6px 0 0 16px',
                                }}
                              >
                                {formatISODate(land.publishedAt)}
                              </TableCell>
                            )}
                            <TableCell
                              align='left'
                              sx={{
                                verticalAlign: 'top',
                                padding: '4px 16px 0 0px',
                              }}
                            >
                              <IconButton
                                disableRipple
                                sx={{
                                  '&:hover': { backgroundColor: 'rgba(252,106,106,0.05)' },
                                  padding: '5px',
                                }}
                                onClick={() => landStore.changeFavourite(land.id)}
                                style={{ marginRight: '8px' }}
                              >
                                {land.isFavourite ? <IsFavoriteIcon /> : <IsNotFavoriteIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell
                              align='left'
                              sx={{
                                verticalAlign: 'top',
                                padding: '4px 16px 0 0px',
                              }}
                            >
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
                                  onClick={() => setOpenedCommentDrawerId(land.id)}
                                  src={commentIcon}
                                  alt={''}
                                />
                                <Badge variant='standard' badgeContent={land._count.comments} />
                              </Stack>
                            </TableCell>
                            <TableCell
                              align='left'
                              sx={{
                                verticalAlign: 'top',
                                padding: '6px 16px 0px 32px',
                              }}
                            >
                              {land.callingUser ? (
                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                  <Avatar
                                    src={`${environments.REACT_APP_CDN}${PhotoSize.EXTRA_SMALL}${land.callingUser.avatarUrl}`}
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
                                    onClick={() => setOpenedMakeCallDrawerId(land.id)}
                                    disabled={Boolean(land.callingUser)}
                                    variant={'contained'}
                                    color='primary'
                                    size={Size.SMALL}
                                    sx={{
                                      padding: '4px 10px',
                                      borderRadius: '8px',
                                      boxShadow: 'none',
                                      textTransform: 'none',
                                      '&:hover': {
                                        background: '#2b63be',
                                        boxShadow: 'none',
                                      },
                                    }}
                                  >
                                    Позвонить
                                  </Button>
                                  <Button
                                    sx={{
                                      padding: '4px 10px',
                                      borderRadius: '8px',
                                      marginBottom: '8px',
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
                                        setOpenedDuplicateDrawerId(land.id);
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
              </MainTableContainer>
              <TablePagination
                component='div'
                count={landStore.count}
                page={landStore.page - 1}
                onPageChange={(event, newPage) => landStore.setPage(newPage + 1)}
                rowsPerPage={landStore.rowsPerPage}
                onRowsPerPageChange={(event) => {
                  landStore.setRowsPerPage(+event.target.value);
                  landStore.setPage(InitialState.FIRST);
                }}
                rowsPerPageOptions={convertEnumWithNumberToArray(PageLimit)}
                sx={{ borderTop: '1px solid #E0E0E0' }}
              />
            </>
          ))
          .otherwise(() => {
            <NoDataNotification
              descriptionPrimary={DictionaryPhrase.UNKNOWN_ERROR}
              descriptionSecondary={DictionaryPhrase.CONTACT_SUPPORT}
            />;
          })}
      </>
    );
  },
);
