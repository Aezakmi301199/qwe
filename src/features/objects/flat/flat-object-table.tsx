import React, { useEffect } from 'react';
import { CrmTableContainer, DataGridContainer } from '../../../shared/styles/styles';
import {
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { theme } from '../../../app/providers/theme';
import { FontSize } from '../../../shared/enums/font-size.enum';
import { FontFamily } from '../../../shared/enums/font-family.enum';
import { CurrencySymbol } from '../../../shared/enums/currency-symbol.enum';
import UITooltipWithIcon from '../../../shared/ui-kit/tooltips/tooltip-with-icon';
import { FontWeight } from '../../../shared/enums/font-weight.enum';
import UITooltipWithPrice from '../../../shared/ui-kit/tooltips/tooltip-with-price';
import { formatPrice } from '../../../shared/lib/format-price-number';
import { calculateCostSquareMeter } from '../../../shared/lib/calculate-cost-square-meter';
import { Link } from 'react-router-dom';
import { ParserDomain } from '../../../shared/enums/parser-domain.enum';
import UITooltipDefault from '../../../shared/ui-kit/tooltips/tooltip-default';
import { getClientNameByAuthor } from '../../../shared/lib/get-client-name-author';
import { formatISODate, formatISODateTooltip } from '../../../shared/lib/convert-timestamp-to-dateTime';
import { Size } from '../../../shared/enums/size.enum';
import { PageLimit } from '../../../shared/enums/pagination.enum';
import { useRootStore } from '../../../root-store.context';
import { observer } from 'mobx-react';
import { CrmFlat } from '../../../entities/real-estate/object/model/type';
import { ObjectButton } from '../../../entities/real-estate/object/ui/ui';
import { DealType } from '../../../shared/enums/deal-type.enum';
import { getDomain } from '../../../shared/lib/get-domain-name';
import { CrmStatus } from '../../../entities/crm-status';
import { useUser } from '../../../user-context';
import CommentButton from '../../../shared/ui-kit/table/comment-button';
import Address from '../../../shared/ui-kit/table/address';
import { getRiesPathUrl } from '../../../shared/lib/get-ries-path-url';
import { isPriceHistoryVisible } from '../../../shared/lib/is-price-history-visible';
import LabelContainer from '../../../shared/ui-kit/table/label-container';

type FlatObjectTableProps = {
  value: number;
  index: number;
  setOpenedCommentDrawerId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsOpenCopySnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenedMapDrawerId: React.Dispatch<React.SetStateAction<string | null>>;
};

const FlatObjectTable: React.FC<FlatObjectTableProps> = observer(
  ({ value, index, setOpenedCommentDrawerId, setIsOpenCopySnackbar, setOpenedMapDrawerId }) => {
    const { crmFlatStore, catalogStore } = useRootStore();
    const { getRiesRealEstateLink } = getRiesPathUrl();
    const user = useUser();

    useEffect(() => {
      crmFlatStore.fetchCrmRealEstateCount(user.id);
    }, [crmFlatStore.filter]);

    const statuses = catalogStore.findCrmStatuses();

    const getStatusByCrmFlat = (flat: CrmFlat): CrmStatus | null => {
      const status = statuses.find((status) => status.value === flat.status);

      return status ?? null;
    };

    return (
      <DataGridContainer role='tabpanel' hidden={value !== index}>
        {value === index && (
          <CrmTableContainer>
            <Table stickyHeader>
              <TableHead sx={{ height: '74px' }}>
                <TableRow>
                  <TableCell>
                    <LabelContainer label={'Адрес'} />
                  </TableCell>
                  <TableCell width={'36px'} align='right'>
                    <LabelContainer label={'Этаж'} />
                  </TableCell>
                  <TableCell width={'61px'} align='right'>
                    <LabelContainer label={'Площ, м²'} />
                  </TableCell>
                  <TableCell width={'32px'} align='right'>
                    <LabelContainer label={'Ком.'} />
                  </TableCell>
                  <TableCell width={'118px'} align='right'>
                    <Box display={'flex'} gap={'4px'} justifyContent={'end'}>
                      <LabelContainer
                        label={`Цена, ${CurrencySymbol.RUB}`}
                        secondary={`Цена за м², ${CurrencySymbol.RUB}`}
                      />
                      <UITooltipWithIcon
                        text={'Мы постоянно проверяем информацию об актуальности цен на агрегаторах'}
                        width={'226px'}
                      />
                    </Box>
                  </TableCell>
                  <TableCell width={'158px'} align='left'>
                    <LabelContainer label={'Источник'} secondary={'Автор'} />
                  </TableCell>
                  <TableCell width={'118px'} align='left'>
                    <Box display={'flex'} gap={'4px'}>
                      <LabelContainer label={'Опубликован'} />
                      <UITooltipWithIcon text={'Дата публикации на агрегаторе'} />
                    </Box>
                  </TableCell>
                  <TableCell width={'59px'} />
                  <TableCell width={'118px'}>
                    <Box display={'flex'} gap={'4px'} justifyContent={'end'}>
                      <LabelContainer label={`Комиссия, ${CurrencySymbol.RUB}`} />
                      <UITooltipWithIcon
                        width={'240px'}
                        text={'Ожидаемая комиссия с продажи объектов, сохраненных в РИЭС'}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align={'left'} width={'138px'}>
                    <LabelContainer label={'Статус в РИЭС'} />
                  </TableCell>
                  <TableCell width={'108px'}>
                    <LabelContainer label={'Объект в РИЭС'} />
                  </TableCell>
                </TableRow>
              </TableHead>
              {!crmFlatStore.loading ? (
                <TableBody sx={{ height: '62px' }}>
                  {crmFlatStore.crmRealEstate.map((crmFlat: CrmFlat) => {
                    const status = getStatusByCrmFlat(crmFlat);

                    return (
                      <TableRow
                        key={crmFlat.id}
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
                          size={'small'}
                          align='left'
                          valign={'top'}
                          sx={{
                            verticalAlign: 'top',
                          }}
                        >
                          <Address
                            address={crmFlat.address}
                            copyId={crmFlat.id}
                            onClickMap={() => setOpenedMapDrawerId(crmFlat.flats[0].flat.id)}
                            setIsOpenCopySnackbar={setIsOpenCopySnackbar}
                          />
                        </TableCell>
                        <TableCell
                          size={'small'}
                          align='right'
                          sx={{
                            verticalAlign: 'top',
                          }}
                        >
                          {crmFlat.floor ? crmFlat.floor : '-'}
                        </TableCell>
                        <TableCell
                          size={'small'}
                          align='right'
                          sx={{
                            verticalAlign: 'top',
                          }}
                        >
                          {crmFlat.area}
                        </TableCell>
                        <TableCell
                          size={'small'}
                          align='right'
                          sx={{
                            verticalAlign: 'top',
                          }}
                        >
                          {crmFlat.roomCount}
                        </TableCell>
                        <TableCell size={'small'} align='right' sx={{ verticalAlign: 'top' }}>
                          <Box display={'flex'} alignItems={'flex-start'} justifyContent={'end'}>
                            <Stack sx={{ float: 'right' }}>
                              <Box
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Typography
                                  width={'110px'}
                                  fontFamily={FontFamily.ROBOTO_MONO}
                                  fontWeight={FontWeight.MEDIUM}
                                  fontSize={FontSize.FOURTEENTH_FONT}
                                >
                                  {formatPrice(crmFlat.price)}
                                </Typography>
                              </Box>
                              {crmFlat.flats[0].flat.dealType === DealType.SALE && (
                                <Box
                                  style={{
                                    fontFamily: FontFamily.ROBOTO_MONO,
                                    whiteSpace: 'nowrap',
                                    color: 'gray',
                                    float: 'left',
                                  }}
                                >
                                  {calculateCostSquareMeter({
                                    price: crmFlat.price,
                                    square: crmFlat.area,
                                    isFormatPrice: true,
                                  })}
                                </Box>
                              )}
                            </Stack>
                            <Box
                              visibility={
                                isPriceHistoryVisible(crmFlat.flats[0].flat.price, crmFlat.flats[0].flat.priceHistory)
                                  ? 'visible'
                                  : 'hidden'
                              }
                            >
                              <UITooltipWithPrice
                                data={{ priceHistory: crmFlat.flats[0].flat.priceHistory }}
                                price={crmFlat.price}
                              />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell
                          size={'small'}
                          align='left'
                          sx={{
                            verticalAlign: 'top',
                          }}
                        >
                          <Stack>
                            <Link
                              style={{
                                color: theme.palette.primary.main,
                                textDecoration: 'underline',
                              }}
                              to={`https://${ParserDomain[crmFlat.flats[0].flat.domain]}${crmFlat.flats[0].flat.url}`}
                              target={'_blank'}
                              rel='noreferrer noopener'
                            >
                              {getDomain(crmFlat.flats[0].flat.domain, catalogStore.findDomains())}
                            </Link>
                            <Box style={{ whiteSpace: 'nowrap' }}>
                              <UITooltipDefault
                                text={getClientNameByAuthor({
                                  author: crmFlat.flats[0].flat.author,
                                  clientName: crmFlat.flats[0].flat.clientName,
                                })}
                              />
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell
                          size={'small'}
                          sx={{
                            verticalAlign: 'top',
                          }}
                        >
                          {formatISODate(crmFlat.createdAt)}
                        </TableCell>
                        <TableCell size={'small'} align='left' sx={{ verticalAlign: 'top' }}>
                          <CommentButton
                            onClick={() => setOpenedCommentDrawerId(crmFlat.flats[0].flat.id)}
                            commentCount={crmFlat.flats[0].flat._count.comments}
                          />
                        </TableCell>
                        <TableCell
                          size={'small'}
                          align='right'
                          sx={{
                            verticalAlign: 'top',
                            whiteSpace: 'nowrap',
                            fontFamily: FontFamily.ROBOTO_MONO,
                          }}
                        >
                          <Typography
                            noWrap
                            width={'112px'}
                            fontFamily={FontFamily.ROBOTO_MONO}
                            fontWeight={FontWeight.REGULAR}
                            fontSize={FontSize.FOURTEENTH_FONT}
                          >
                            {crmFlat.flats[0].flat.dealType === DealType.SALE
                              ? formatPrice(crmFlat.saleCommission)
                              : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell
                          size={'small'}
                          align='left'
                          sx={{
                            verticalAlign: 'top',
                          }}
                        >
                          <Chip
                            sx={{
                              width: 'fit-content',
                              display: 'flex',
                              padding: '3px',
                              color: 'white',
                              backgroundColor: `#${status?.hexColor}`,
                            }}
                            label={status?.readableName}
                            size={Size.SMALL}
                            variant='filled'
                          />
                        </TableCell>
                        <TableCell size={'small'} align='left' sx={{ verticalAlign: 'top' }}>
                          <Stack>
                            <Link
                              to={getRiesRealEstateLink(crmFlat.internalId)}
                              target={'_blank'}
                              rel={'noopener noreferrer'}
                            >
                              <ObjectButton variant={'contained'} color={'primary'}>
                                Объект
                              </ObjectButton>
                            </Link>
                            <Typography color={theme.palette.text.secondary} fontSize={FontSize.FOURTEENTH_FONT}>
                              от {formatISODateTooltip(crmFlat.createdAt)}
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : null}
            </Table>
          </CrmTableContainer>
        )}
        <TablePagination
          component='div'
          count={crmFlatStore.crmRealEstateCount}
          page={crmFlatStore.filter.page - 1}
          onPageChange={(_, newPage) => crmFlatStore.setFilter({ ...crmFlatStore.filter, page: newPage + 1 })}
          rowsPerPage={PageLimit.FIFTEEN}
          rowsPerPageOptions={[PageLimit.FIFTEEN]}
          sx={{ borderTop: '1px solid #E0E0E0' }}
        />
      </DataGridContainer>
    );
  },
);

export default FlatObjectTable;
