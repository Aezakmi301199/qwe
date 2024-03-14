import { CrmTableContainer, DataGridContainer } from '../../../shared/styles/styles';
import React, { useEffect } from 'react';
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
import { CrmLand } from '../../../entities/real-estate/object/model/type';
import { ObjectButton } from '../../../entities/real-estate/object/ui/ui';
import { DealType } from '../../../shared/enums/deal-type.enum';
import { getDomain } from '../../../shared/lib/get-domain-name';
import { CrmStatus } from '../../../entities/crm-status';
import { useUser } from '../../../user-context';
import CommentButton from '../../../shared/ui-kit/table/comment-button';
import { isPriceHistoryVisible } from '../../../shared/lib/is-price-history-visible';
import Address from '../../../shared/ui-kit/table/address';
import LabelContainer from '../../../shared/ui-kit/table/label-container';
import { getRiesPathUrl } from '../../../shared/lib/get-ries-path-url';

type HouseObjectTableProps = {
  value: number;
  index: number;
  setOpenedCommentDrawerId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsOpenCopySnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenedMapDrawerId: React.Dispatch<React.SetStateAction<string | null>>;
};

const LandObjectTable: React.FC<HouseObjectTableProps> = observer(
  ({ value, index, setOpenedCommentDrawerId, setOpenedMapDrawerId, setIsOpenCopySnackbar }) => {
    const { crmLandStore } = useRootStore();
    const { catalogStore } = useRootStore();
    const { getRiesRealEstateLink } = getRiesPathUrl();
    const user = useUser();

    useEffect(() => {
      crmLandStore.fetchCrmRealEstateCount(user.id);
    }, [crmLandStore.filter]);

    const statuses = catalogStore.findCrmStatuses();

    const getStatusByCrmLand = (land: CrmLand): CrmStatus | null => {
      const status = statuses.find((status) => status.value === land.status);

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
                  <TableCell width={'43px'} align='right'>
                    <LabelContainer label={'Площ. сот.'} />
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
              {!crmLandStore.loading ? (
                <TableBody sx={{ height: '62px' }}>
                  {crmLandStore.crmRealEstate.map((crmLand: CrmLand) => {
                    const status = getStatusByCrmLand(crmLand);

                    return (
                      <TableRow
                        key={crmLand.id}
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
                            address={crmLand.address}
                            copyId={crmLand.id}
                            onClickMap={() => setOpenedMapDrawerId(crmLand.lands[0].land.id)}
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
                          {crmLand.area}
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
                                  {formatPrice(crmLand.price)}
                                </Typography>
                              </Box>
                              {crmLand.lands[0].land.dealType === DealType.SALE && (
                                <Box
                                  style={{
                                    fontFamily: FontFamily.ROBOTO_MONO,
                                    whiteSpace: 'nowrap',
                                    color: 'gray',
                                    float: 'left',
                                  }}
                                >
                                  {calculateCostSquareMeter({
                                    price: crmLand.price,
                                    square: crmLand.area,
                                    isFormatPrice: true,
                                  })}
                                </Box>
                              )}
                            </Stack>
                            <Box
                              visibility={
                                isPriceHistoryVisible(crmLand.lands[0].land.price, crmLand.lands[0].land.priceHistory)
                                  ? 'visible'
                                  : 'hidden'
                              }
                            >
                              <UITooltipWithPrice
                                data={{ priceHistory: crmLand.lands[0].land.priceHistory }}
                                price={crmLand.price}
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
                              to={`https://${ParserDomain[crmLand.lands[0].land.domain]}${crmLand.lands[0].land.url}`}
                              target={'_blank'}
                              rel='noreferrer noopener'
                            >
                              {getDomain(crmLand.lands[0].land.domain, catalogStore.findDomains())}
                            </Link>
                            <Box style={{ whiteSpace: 'nowrap' }}>
                              <UITooltipDefault
                                text={getClientNameByAuthor({
                                  author: crmLand.lands[0].land.author,
                                  clientName: crmLand.lands[0].land.clientName,
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
                          {formatISODate(crmLand.createdAt)}
                        </TableCell>
                        <TableCell size={'small'} align='left' sx={{ verticalAlign: 'top' }}>
                          <CommentButton
                            onClick={() => setOpenedCommentDrawerId(crmLand.lands[0].land.id)}
                            commentCount={crmLand.lands[0].land._count.comments}
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
                            {crmLand.lands[0].land.dealType === DealType.SALE
                              ? formatPrice(crmLand.saleCommission)
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
                              to={getRiesRealEstateLink(crmLand.internalId)}
                              target={'_blank'}
                              rel={'noopener noreferrer'}
                            >
                              <ObjectButton variant={'contained'} color={'primary'}>
                                Объект
                              </ObjectButton>
                            </Link>
                            <Typography color={theme.palette.text.secondary} fontSize={FontSize.FOURTEENTH_FONT}>
                              от {formatISODateTooltip(crmLand.createdAt)}
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
          count={crmLandStore.crmRealEstateCount}
          page={crmLandStore.filter.page - 1}
          onPageChange={(_, newPage) => crmLandStore.setFilter({ ...crmLandStore.filter, page: newPage + 1 })}
          rowsPerPage={PageLimit.FIFTEEN}
          rowsPerPageOptions={[PageLimit.FIFTEEN]}
          sx={{ borderTop: '1px solid #E0E0E0' }}
        />
      </DataGridContainer>
    );
  },
);

export default LandObjectTable;
