import { Box, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { theme } from '../../../app/providers/theme';
import { primary, teal } from '../../../shared/colors';
import { ChipWithCircle } from '../ui/chip-with-circle';
import { ScaleRatioLineBar } from '../../../shared/components/scale-ratio-line-bar';
import { AlignText } from '../../../shared/enums/align-text';
import { filterArrayByField, reduceAccumulatorByField } from '../../../shared/utils/array';
import { getPercentage } from '../../../shared/lib/get-percentage';
import axios from 'axios';
import { ItemCount } from '../../../shared/enums/item-count';
import { RealEstateTypeUpperCase } from '../../../shared/enums/real-estate-type-upper-case.enum';
import { RealEstateType } from '../../../shared/enums/real-estate-type.enum';
import { FlatRoomCount } from '../../../shared/enums/flat-room-count';
import { getNameRowByRealEstate } from '../lib/lib';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { DealType } from '../../../shared/enums/deal-type.enum';
import { DealTypeName } from '../../../shared/enums/deal-type-name';
import { PositionSkeleton, Skeleton } from '../../../shared/ui-kit/skeleton/skeleton';
import { optionsDailyChart, optionsLoadingDailyChart } from './stat-by-daily-author-content-chart';
import { environments } from '../../../environment';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type StatByDailyDealTypeContentChartProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  city: string;
  setTotalCountRealEstate: React.Dispatch<React.SetStateAction<number>>;
};

type RealEstateByDealTypeDailyDto = {
  _count: number;
  roomCount?: number | null;
  dealType: DealType;
};

type StatByRealEstateDealTypeDaily = Omit<RealEstateByDealTypeDailyDto, '_count' | 'dealType'> & {
  _count: {
    sale: number;
    rentShort: number;
    rentLong: number;
    total: number;
  };
  nameRow: string;
};

const getCommonCountByDealType = (data: RealEstateByDealTypeDailyDto[]) => {
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

const uniteMultiRoomCountData = (data: RealEstateByDealTypeDailyDto[]) => {
  const multiRoomCountData: RealEstateByDealTypeDailyDto[] = [];
  const otherRoomCountData: RealEstateByDealTypeDailyDto[] = [];

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

const modifyDataByDealType = (data: RealEstateByDealTypeDailyDto[], realEstate: RealEstateTypeUpperCase) => {
  if (realEstate === RealEstateTypeUpperCase.FLAT) {
    const unitedMultiRoomCountData = uniteMultiRoomCountData(data);
    const flatData: StatByRealEstateDealTypeDaily[] = [];

    for (let i = 0; i <= FlatRoomCount.MULTI_ROOM_COUNT; i++) {
      const flatByRoomCount = filterArrayByField(unitedMultiRoomCountData, 'roomCount', i);

      flatData.push({
        _count: getCommonCountByDealType(flatByRoomCount),
        roomCount: i,
        nameRow: getNameRowByRealEstate(realEstate, i),
      });
    }

    return flatData;
  }

  return [
    {
      _count: getCommonCountByDealType(data),
      nameRow: getNameRowByRealEstate(realEstate),
    },
  ] as StatByRealEstateDealTypeDaily[];
};

export const StatByDailyDealTypeContentChart: React.FC<StatByDailyDealTypeContentChartProps> = ({
  city,
  isLoading,
  setIsLoading,
  setTotalCountRealEstate,
}) => {
  const [dataStat, setDataStat] = useState<StatByRealEstateDealTypeDaily[]>([]);
  const [displayDataDealType, setDisplayDataDealType] = useState({
    sale: true,
    rentShort: true,
    rentLong: true,
  });

  const percentage = useMemo(() => {
    const totalCountBySale = displayDataDealType.sale
      ? reduceAccumulatorByField(
          dataStat.map((data) => data._count),
          'sale',
        )
      : ItemCount.ZERO;

    const totalCountByRentShort = displayDataDealType.rentShort
      ? reduceAccumulatorByField(
          dataStat.map((data) => data._count),
          'rentShort',
        )
      : ItemCount.ZERO;

    const totalCountByRentLong = displayDataDealType.rentShort
      ? reduceAccumulatorByField(
          dataStat.map((data) => data._count),
          'rentLong',
        )
      : ItemCount.ZERO;

    const totalCount = totalCountBySale + totalCountByRentShort + totalCountByRentLong;

    setTotalCountRealEstate(totalCount);

    if (!totalCount) {
      return null;
    }

    return {
      sale: getPercentage(totalCountBySale, totalCount),
      rentShort: getPercentage(totalCountByRentShort, totalCount),
      rentLong: getPercentage(totalCountByRentLong, totalCount),
    };
  }, [dataStat, displayDataDealType.sale, displayDataDealType.rentShort, displayDataDealType.rentLong]);

  const dataChart = {
    labels: dataStat.map((stat) => stat.nameRow),
    datasets: [
      {
        axis: 'y',
        label: DealTypeName.SALE,
        data: dataStat.map((stat) => stat._count.sale),
        fill: false,
        backgroundColor: teal[300],
        hoverBackgroundColor: teal[300],
      },
      {
        axis: 'y',
        label: DealTypeName.RENT_SHORT,
        data: dataStat.map((stat) => stat._count.rentShort),
        fill: false,
        backgroundColor: primary[400],
        hoverBackgroundColor: primary[400],
      },
      {
        axis: 'y',
        label: DealTypeName.RENT_LONG,
        data: dataStat.map((stat) => stat._count.rentLong),
        fill: false,
        backgroundColor: theme.custom.base.plus.main,
        hoverBackgroundColor: theme.custom.base.plus.main,
      },
    ],
  };

  const changeDataDisplayAuthor = (author: 'sale' | 'rentShort' | 'rentLong', dataSetIndex: number) => {
    const isChecked = !displayDataDealType[author];
    const chartElement = ChartJS.getChart('chartForDayByDealType');

    if (!chartElement) {
      return;
    }

    setDisplayDataDealType((prev) => ({ ...prev, [author]: isChecked }));
    chartElement.setDatasetVisibility(dataSetIndex, isChecked);
  };

  const fetchStatByDealType = async () => {
    setIsLoading(true);

    const flatDailyStatByAuthor: RealEstateByDealTypeDailyDto[] = await axios
      .get(`${environments.REACT_APP_PROXY}/api/${RealEstateType.FLATS}/statByRoomCountAndDealTypeDaily`, {
        params: {
          city,
        },
      })
      .then((res) => res.data);

    const houseDailyStatByAuthor: RealEstateByDealTypeDailyDto[] = await axios
      .get(`${environments.REACT_APP_PROXY}/api/${RealEstateType.HOUSES}/statByDealTypeDaily`, {
        params: {
          city,
        },
      })
      .then((res) => res.data);

    const modifiedFlatData = modifyDataByDealType(flatDailyStatByAuthor, RealEstateTypeUpperCase.FLAT);
    const modifiedHouseData = modifyDataByDealType(houseDailyStatByAuthor, RealEstateTypeUpperCase.HOUSE);

    setDataStat([...modifiedFlatData, ...modifiedHouseData]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStatByDealType();
  }, []);

  const dataForChipCircle = [
    {
      text: DealTypeName.SALE,
      isLineThrough: !displayDataDealType.sale,
      color: teal[300],
      dealType: 'sale' as const,
    },
    {
      text: DealTypeName.RENT_SHORT,
      isLineThrough: !displayDataDealType.rentShort,
      color: primary[400],
      dealType: 'rentShort' as const,
    },
    {
      text: DealTypeName.RENT_LONG,
      isLineThrough: !displayDataDealType.rentLong,
      color: theme.custom.base.plus.main,
      dealType: 'rentLong' as const,
    },
  ];

  if (isLoading) {
    return (
      <>
        <Box
          sx={{
            paddingTop: `${theme.custom.base.module.first} ${theme.custom.base.module.second}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: theme.custom.button.padding.px.sm,
            alignSelf: 'stretch',
          }}
        >
          <Box
            display={'flex'}
            padding={`${theme.custom.base.module.first} 0px`}
            alignItems={'center'}
            gap={theme.custom.button.padding.px.sm}
            alignSelf={'stretch'}
          >
            <Skeleton position={PositionSkeleton.START} width={'160px'} height={'24px'} animation={false} />
          </Box>
        </Box>
        <Box sx={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
          <Bar
            id='chartForDayByDealTypeLoading'
            style={{ boxSizing: 'content-box' }}
            width={'1524px'}
            height={'528px'}
            options={optionsLoadingDailyChart}
            data={dataChart}
          />
        </Box>
        <Stack
          paddingTop={theme.custom.base.module.second}
          alignItems={'flex-start'}
          gap={theme.custom.base.module.second}
          alignSelf={'stretch'}
        >
          <Divider orientation='horizontal' sx={{ width: '100%' }} />
          <Box
            display={'flex'}
            justifyContent={'end'}
            alignItems={'flex-start'}
            gap={theme.custom.base.module.second}
            alignSelf={'stretch'}
          >
            <ChipWithCircle isLoading={isLoading} circle={{ width: '16px', height: '16px', color: teal[300] }} />
            <ChipWithCircle isLoading={isLoading} circle={{ width: '16px', height: '16px', color: primary[400] }} />
            <ChipWithCircle
              isLoading={isLoading}
              circle={{ width: '16px', height: '16px', color: theme.custom.base.plus.main }}
            />
          </Box>
          <ScaleRatioLineBar
            dataSets={[
              {
                backgroundColor: teal[300],
                width: `33%`,
                display: true,
              },
              {
                backgroundColor: primary[400],
                width: `33%`,
                display: true,
              },
              {
                backgroundColor: theme.custom.base.plus.main,
                width: `33%`,
                display: true,
              },
            ]}
          />
        </Stack>
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.custom.button.padding.px.sm,
          alignSelf: 'stretch',
          padding: `${theme.custom.base.module.first} 0px`,
        }}
      >
        <Typography variant={'body1Medium'} color={theme.palette.text.primary} children='По типу сделки' />
        <Box display={'flex'} padding={'0px'} alignItems={'flex-start'} gap={theme.custom.base.module.second}>
          {dataForChipCircle.map((data, index) => (
            <ChipWithCircle
              text={data.text}
              circle={{ color: data.color, width: '16px', height: '16px' }}
              onClick={() => changeDataDisplayAuthor(data.dealType, index)}
              isLineThrough={data.isLineThrough}
            />
          ))}
        </Box>
      </Box>
      <Box sx={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
        <Bar
          id='chartForDayByDealType'
          style={{ boxSizing: 'content-box' }}
          width={'1524px'}
          height={'528px'}
          options={optionsDailyChart}
          data={dataChart}
        />
      </Box>
      {percentage && (
        <Stack
          paddingTop={theme.custom.base.module.second}
          alignItems={'flex-start'}
          gap={theme.custom.base.module.second}
          alignSelf={'stretch'}
        >
          <Divider orientation='horizontal' sx={{ width: '100%' }} />
          <Box
            display={'flex'}
            justifyContent={'end'}
            alignItems={'flex-start'}
            gap={theme.custom.base.module.second}
            alignSelf={'stretch'}
          >
            {dataForChipCircle.map((data) => (
              <ChipWithCircle
                text={data.text}
                circle={{ color: data.color, width: '16px', height: '16px' }}
                isLineThrough={data.isLineThrough}
                sx={{
                  pointerEvents: 'none',
                }}
              />
            ))}
          </Box>
          <ScaleRatioLineBar
            dataSets={[
              {
                text: `${percentage.sale}%`,
                backgroundColor: teal[300],
                alignText: AlignText.LEFT,
                width: `${percentage.sale}%`,
                display: !!(displayDataDealType.sale && percentage.sale),
              },
              {
                text: `${percentage.rentShort}%`,
                backgroundColor: primary[400],
                alignText: AlignText.RIGHT,
                width: `${percentage.rentShort}%`,
                display: !!(displayDataDealType.rentShort && percentage.rentShort),
              },
              {
                text: `${percentage.rentLong}%`,
                backgroundColor: theme.custom.base.plus.main,
                alignText: AlignText.RIGHT,
                width: `${percentage.rentLong}%`,
                display: !!(displayDataDealType.rentLong && percentage.rentLong),
              },
            ]}
          />
        </Stack>
      )}
    </>
  );
};
