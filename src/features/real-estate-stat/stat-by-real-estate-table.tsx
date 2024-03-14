import { Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { theme } from '../../app/providers/theme';
import { ContainerStat } from '../../shared/styles/styles';
import { RealEstateType } from '../../shared/enums/real-estate-type.enum';
import { StatHeader } from './ui/stat-header';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { TimeRange } from '../../shared/enums/time-range.enum';
import { reduceAccumulatorByField } from '../../shared/utils/array';
import { TimeRangeSelect } from '../../shared/components/time-range-select';
import { separateThousand } from '../../shared/lib/separate-thousand';
import { DealTypeName } from '../../shared/enums/deal-type-name';
import { DealType } from '../../shared/enums/deal-type.enum';
import { FlatRoomCount } from '../../shared/enums/flat-room-count';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { ItemCount } from '../../shared/enums/item-count';
import { TableCellForStat, TypographyForStatTableCell } from './ui/table-cell-for-stat';
import { StatTableFooter } from './ui/stat-table-footer';
import { TableRowLoadingComponent } from './ui/table-row-loading-component';
import { TableBodyLoadingContentComponent } from './ui/table-body-loading-component';
import { FirstTableCell } from './ui/first-table-cell';
import { useDebounce } from '../../shared/hooks/use-debounce';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { PositionSkeleton, Skeleton } from '../../shared/ui-kit/skeleton/skeleton';
import { getNameRowByRealEstate } from './lib/lib';
import { environments } from '../../environment';

type StatByDomainTableProps = {
  city: string;
};

type RealEstateByDomainDto = {
  _count: number;
  roomCount?: number | null;
  dealType: DealType;
};

type StatByRealEstate = Pick<ModifiedRealEstateByDomain, 'roomCount' | '_count'> & {
  nameRow: string;
};

type ModifiedRealEstateByDomain = {
  roomCount?: number | null;
  _count: {
    sale: number;
    rentShort: number;
    rentLong: number;
    total: number;
  };
  realEstate: RealEstateTypeUpperCase;
};

const addNameRow = (data: ModifiedRealEstateByDomain[]) => {
  return data.map((stat) => {
    return {
      ...stat,
      nameRow: getNameRowByRealEstate(stat.realEstate, stat.roomCount),
    };
  });
};

const uniteMultiRoomCountData = (data: RealEstateByDomainDto[]) => {
  const multiRoomCountData: RealEstateByDomainDto[] = [];
  const otherRoomCountData: RealEstateByDomainDto[] = [];

  data.forEach((stat) =>
    Number(stat.roomCount) >= FlatRoomCount.MULTI_ROOM_COUNT
      ? multiRoomCountData.push(stat)
      : otherRoomCountData.push(stat),
  );

  const unionMultiRoomCountData = reduceAccumulatorByField(multiRoomCountData, '_count');

  return unionMultiRoomCountData
    ? [...otherRoomCountData, { ...multiRoomCountData[0], _count: unionMultiRoomCountData }]
    : otherRoomCountData;
};

const getCommonCountByDealType = (data: RealEstateByDomainDto[]) => {
  const countByDealTypeSale = data.find((stat) => stat.dealType === DealType.SALE)?._count ?? ItemCount.ZERO;
  const countByDealTypeSaleRentShort =
    data.find((stat) => stat.dealType === DealType.RENT_SHORT)?._count ?? ItemCount.ZERO;
  const countByDealTypeSaleRentLong =
    data.find((stat) => stat.dealType === DealType.RENT_LONG)?._count ?? ItemCount.ZERO;

  return {
    sale: countByDealTypeSale,
    rentShort: countByDealTypeSaleRentShort,
    rentLong: countByDealTypeSaleRentLong,
    total: countByDealTypeSale + countByDealTypeSaleRentShort + countByDealTypeSaleRentLong,
  };
};

const fillAndModifyEmptyData = (data: RealEstateByDomainDto[], realEstate: RealEstateTypeUpperCase) => {
  const dealTypeValues = [DealType.SALE, DealType.RENT_SHORT, DealType.RENT_LONG];

  if (realEstate === RealEstateTypeUpperCase.FLAT) {
    const unitedMultiRoomCountData = uniteMultiRoomCountData(data);
    const flatData: ModifiedRealEstateByDomain[] = [];

    for (let i = 0; i <= FlatRoomCount.MULTI_ROOM_COUNT; i++) {
      const filteredByRoomCount: RealEstateByDomainDto[] = unitedMultiRoomCountData.filter(
        (stat) => stat.roomCount === i,
      );

      const flatDataByDealType: RealEstateByDomainDto[] = dealTypeValues.map(
        (dealType) =>
          filteredByRoomCount.find((stat) => stat.dealType === dealType) ?? {
            _count: 0,
            roomCount: i,
            dealType: dealType,
          },
      );

      flatData.push({
        _count: getCommonCountByDealType(flatDataByDealType),
        roomCount: i,
        realEstate,
      });
    }

    return flatData;
  }

  const houseDataByDealType: RealEstateByDomainDto[] = dealTypeValues.map(
    (dealType) =>
      data.find((stat) => stat.dealType === dealType) ?? {
        _count: 0,
        dealType: dealType,
      },
  );

  return [
    {
      _count: getCommonCountByDealType(houseDataByDealType),
      realEstate,
    },
  ] as ModifiedRealEstateByDomain[];
};

export const StatByRealEstateTable: React.FC<StatByDomainTableProps> = ({ city }) => {
  const loadingColumnCount = 5;
  const countRows = 4;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataRealEstateRows, setDataRealEstateRows] = useState<StatByRealEstate[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_WEEK);
  const changeTimeRangeRealEstate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TimeRange;

    setTimeRange(value);
  };

  const fetchCommonStatByRealEstate = useDebounce(async (city: string, timeRange: TimeRange) => {
    setIsLoading(true);

    const statByFlat = addNameRow(
      fillAndModifyEmptyData(await fetchStatByFlats(city, timeRange), RealEstateTypeUpperCase.FLAT),
    );

    const statByHouse = addNameRow(
      fillAndModifyEmptyData(await fetchStatByHouse(city, timeRange), RealEstateTypeUpperCase.HOUSE),
    );

    setDataRealEstateRows([...statByFlat, ...statByHouse]);
    setIsLoading(false);
  }, TimeConvert.MILLISECONDS_IN_MILLISECONDS * 200);

  const fetchStatByFlats = async (city: string, timeRange: TimeRange) => {
    return await axios
      .get(`${environments.REACT_APP_PROXY}/api/${RealEstateType.FLATS}/statByRoomCountAndDealType`, {
        params: {
          city,
          timeRange,
        },
      })
      .then((res) => res.data);
  };

  const fetchStatByHouse = async (city: string, timeRange: TimeRange) => {
    return await axios
      .get(`${environments.REACT_APP_PROXY}/api/${RealEstateType.HOUSES}/statByDealType`, {
        params: {
          city,
          timeRange,
        },
      })
      .then((res) => res.data);
  };

  const saleCountForAllRealEstate = useMemo(() => {
    return reduceAccumulatorByField(
      dataRealEstateRows.map((data) => data._count),
      'sale',
    );
  }, [dataRealEstateRows]);

  const rentShortCountForAllRealEstate = useMemo(() => {
    return reduceAccumulatorByField(
      dataRealEstateRows.map((data) => data._count),
      'rentShort',
    );
  }, [dataRealEstateRows]);

  const rentLongCountForAllRealEstate = useMemo(() => {
    return reduceAccumulatorByField(
      dataRealEstateRows.map((data) => data._count),
      'rentLong',
    );
  }, [dataRealEstateRows]);

  const totalCountForAllRealEstate = useMemo(() => {
    return reduceAccumulatorByField(
      dataRealEstateRows.map((data) => data._count),
      'total',
    );
  }, [dataRealEstateRows]);

  useEffect(() => {
    setTimeRange(TimeRange.LAST_WEEK);
  }, [city]);

  useEffect(() => {
    fetchCommonStatByRealEstate(city, timeRange);
  }, [city, timeRange]);

  if (isLoading) {
    return (
      <ContainerStat
        padding={`${theme.custom.base.module.third} ${theme.custom.base.module.third} ${theme.custom.base.module.third} ${theme.custom.base.module.third}`}
        direction={'column'}
        alignItems={'center'}
        alignSelf={'stretch'}
        gap={theme.custom.base.module.second}
      >
        <StatHeader
          title={'Статистика по типам недвижимости'}
          endButtons={<TimeRangeSelect value={timeRange} onChange={changeTimeRangeRealEstate} width={'125px'} />}
        />
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table size='small' aria-label='a dense table'>
            <TableHead>
              <TableRowLoadingComponent width={'190px'} countRows={countRows} />
            </TableHead>
            <TableBody>
              <TableBodyLoadingContentComponent
                countColumn={loadingColumnCount}
                width={'190px'}
                countRows={countRows}
                skeleton={<Skeleton position={PositionSkeleton.START} height={'28px'} animation={false} />}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </ContainerStat>
    );
  }

  return (
    <ContainerStat
      padding={`${theme.custom.base.module.third} ${theme.custom.base.module.third} ${theme.custom.base.module.third} ${theme.custom.base.module.third}`}
      direction={'column'}
      alignItems={'center'}
      alignSelf={'stretch'}
      gap={theme.custom.base.module.second}
    >
      <StatHeader
        title={'Статистика по типам недвижимости'}
        endButtons={<TimeRangeSelect value={timeRange} onChange={changeTimeRangeRealEstate} width={'125px'} />}
      />
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table size='small' aria-label='a dense table'>
          <TableHead>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCellForStat
                children={
                  <Typography variant={'body2Medium'} children={'Недвижимость'} color={theme.palette.text.primary} />
                }
              />
              <TableCellForStat
                children={<TypographyForStatTableCell variant={'body2Medium'} children={DealTypeName.SALE} />}
              />
              <TableCellForStat
                children={<TypographyForStatTableCell variant={'body2Medium'} children={DealTypeName.RENT_SHORT} />}
              />
              <TableCellForStat
                children={<TypographyForStatTableCell variant={'body2Medium'} children={DealTypeName.RENT_LONG} />}
              />
              <TableCellForStat children={<TypographyForStatTableCell variant={'body2Medium'} children={'Всего'} />} />
            </TableRow>
          </TableHead>
          <TableBody>
            {dataRealEstateRows.map((realEstateRow) => (
              <TableRow
                key={realEstateRow.nameRow}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: 'rgba(19, 29, 53, 0.04)',
                    cursor: 'pointer',
                  },
                }}
              >
                <FirstTableCell children={<Typography variant={'body2'}>{realEstateRow.nameRow}</Typography>} />
                <TableCellForStat
                  width={'260px'}
                  children={<TypographyForStatTableCell children={separateThousand(realEstateRow._count.sale)} />}
                />
                <TableCellForStat
                  width={'260px'}
                  children={<TypographyForStatTableCell children={separateThousand(realEstateRow._count.rentShort)} />}
                />
                <TableCellForStat
                  width={'260px'}
                  children={<TypographyForStatTableCell children={separateThousand(realEstateRow._count.rentLong)} />}
                />
                <TableCellForStat
                  width={'260px'}
                  children={<TypographyForStatTableCell children={separateThousand(realEstateRow._count.total)} />}
                />
              </TableRow>
            ))}
          </TableBody>
          <StatTableFooter
            cells={[
              separateThousand(saleCountForAllRealEstate),
              separateThousand(rentShortCountForAllRealEstate),
              separateThousand(rentLongCountForAllRealEstate),
              separateThousand(totalCountForAllRealEstate),
            ]}
          />
        </Table>
      </TableContainer>
    </ContainerStat>
  );
};
