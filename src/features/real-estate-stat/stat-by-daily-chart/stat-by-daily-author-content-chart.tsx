import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { primary, teal } from '../../../shared/colors';
import { ParserDefaultAuthorName } from '../../../shared/enums/parser-default-author-name';
import { ChipWithCircle } from '../ui/chip-with-circle';
import { ScaleRatioLineBar } from '../../../shared/components/scale-ratio-line-bar';
import { AlignText } from '../../../shared/enums/align-text';
import { filterArrayByField, reduceAccumulatorByField } from '../../../shared/utils/array';
import { getPercentage } from '../../../shared/lib/get-percentage';
import { Author } from '../../../shared/enums/author.enum';
import axios from 'axios';
import { ItemCount } from '../../../shared/enums/item-count';
import { RealEstateTypeUpperCase } from '../../../shared/enums/real-estate-type-upper-case.enum';
import { RealEstateType } from '../../../shared/enums/real-estate-type.enum';
import { FlatRoomCount } from '../../../shared/enums/flat-room-count';
import { getNameRowByRealEstate } from '../lib/lib';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { PositionSkeleton, Skeleton } from '../../../shared/ui-kit/skeleton/skeleton';
import { FontFamily } from '../../../shared/enums/font-family.enum';
import { environments } from '../../../environment';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type StatByDailyAuthorContentChartProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  city: string;
  setTotalCountRealEstate: React.Dispatch<React.SetStateAction<number>>;
};

export const optionsDailyChart: ChartOptions<'bar'> = {
  responsive: true,
  devicePixelRatio: 2,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  elements: { point: { radius: 0 } },
  scales: {
    x: {
      grace: '30%',
      suggestedMax: 20,
      offset: false,
      border: {
        display: false,
      },
    },
    y: {
      grace: '30%',
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgba(26, 26, 26, 0.87)',
        font: {
          family: FontFamily.ROBOTO,
          size: 14,
          style: 'normal',
          weight: 400,
          lineHeight: '143%',
        },
      },
    },
  },
  interaction: {
    mode: 'index' as const,
    intersect: true,
  },
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    tooltip: {
      usePointStyle: true,
      boxPadding: 4,
      boxWidth: 8,
      boxHeight: 8,
      position: 'nearest',
      xAlign: 'left',
      backgroundColor: 'rgba(69, 69, 69, 1)',
    },
  },
};

export const optionsLoadingDailyChart: ChartOptions<'bar'> = {
  responsive: true,
  devicePixelRatio: 2,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  elements: { point: { radius: 0 } },
  scales: {
    x: {
      grace: '50%',
      suggestedMax: 20,
      offset: true,
      border: {
        display: false,
      },
      ticks: {
        color: 'rgba(26, 26, 26, 0.87)',
        font: {
          family: FontFamily.ROBOTO,
          size: 14,
          style: 'normal',
          weight: 400,
          lineHeight: '143%',
        },
      },
    },
    y: {
      grace: '50%',
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
  },
  interaction: {
    mode: 'index' as const,
    intersect: true,
  },
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    tooltip: {
      usePointStyle: true,
      boxPadding: 4,
      boxWidth: 8,
      boxHeight: 8,
      position: 'nearest',
      xAlign: 'left',
      backgroundColor: 'rgba(69, 69, 69, 1)',
    },
  },
};

type RealEstateByAuthorDailyDto = {
  _count: number;
  roomCount?: number | null;
  author: Author;
};

type StatByRealEstateAuthorDaily = Omit<RealEstateByAuthorDailyDto, '_count' | 'author'> & {
  _count: {
    owner: number;
    agency: number;
    total: number;
  };
  nameRow: string;
};

const getCommonCountByAuthor = (data: RealEstateByAuthorDailyDto[]) => {
  const countByOwner = data.find((stat) => stat.author === Author.OWNER)?._count ?? ItemCount.ZERO;
  const countByAgency = data.find((stat) => stat.author === Author.AGENCY)?._count ?? ItemCount.ZERO;

  return {
    owner: countByOwner,
    agency: countByAgency,
    total: countByOwner + countByAgency,
  };
};

const uniteMultiRoomCountData = (data: RealEstateByAuthorDailyDto[]) => {
  const multiRoomCountData: RealEstateByAuthorDailyDto[] = [];
  const otherRoomCountData: RealEstateByAuthorDailyDto[] = [];

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

const modifyDataByAuthor = (data: RealEstateByAuthorDailyDto[], realEstate: RealEstateTypeUpperCase) => {
  if (realEstate === RealEstateTypeUpperCase.FLAT) {
    const unitedMultiRoomCountData = uniteMultiRoomCountData(data);
    const flatData: StatByRealEstateAuthorDaily[] = [];

    for (let i = 0; i <= FlatRoomCount.MULTI_ROOM_COUNT; i++) {
      const flatByRoomCount = filterArrayByField(unitedMultiRoomCountData, 'roomCount', i);

      flatData.push({
        _count: getCommonCountByAuthor(flatByRoomCount),
        roomCount: i,
        nameRow: getNameRowByRealEstate(realEstate, i),
      });
    }

    return flatData;
  }

  return [
    {
      _count: getCommonCountByAuthor(data),
      nameRow: getNameRowByRealEstate(realEstate),
    },
  ] as StatByRealEstateAuthorDaily[];
};

export const StatByDailyAuthorContentChart: React.FC<StatByDailyAuthorContentChartProps> = ({
  city,
  isLoading,
  setIsLoading,
  setTotalCountRealEstate,
}) => {
  const theme = useTheme();
  const [dataStat, setDataStat] = useState<StatByRealEstateAuthorDaily[]>([]);
  const [displayDataAuthor, setDisplayDataAuthor] = useState({
    owner: true,
    agency: true,
  });

  const percentage = useMemo(() => {
    const totalCountByOwner = displayDataAuthor.owner
      ? reduceAccumulatorByField(
          dataStat.map((data) => data._count),
          'owner',
        )
      : ItemCount.ZERO;

    const totalCountByAgency = displayDataAuthor.agency
      ? reduceAccumulatorByField(
          dataStat.map((data) => data._count),
          'agency',
        )
      : ItemCount.ZERO;

    const totalCount = totalCountByOwner + totalCountByAgency;

    setTotalCountRealEstate(totalCount);

    if (!totalCount) {
      return null;
    }

    return {
      owner: getPercentage(totalCountByOwner, totalCount),
      agency: getPercentage(totalCountByAgency, totalCount),
    };
  }, [dataStat, displayDataAuthor.agency, displayDataAuthor.owner]);

  const dataChart = {
    labels: dataStat.map((stat) => stat.nameRow),
    datasets: [
      {
        axis: 'y',
        label: ParserDefaultAuthorName.OWNER,
        data: dataStat.map((stat) => stat._count.owner),
        fill: false,
        backgroundColor: teal[300],
        hoverBackgroundColor: teal[300],
      },
      {
        axis: 'y',
        label: ParserDefaultAuthorName.AGENCY,
        data: dataStat.map((stat) => stat._count.agency),
        fill: false,
        backgroundColor: primary[400],
        hoverBackgroundColor: primary[400],
      },
    ],
  };

  const fetchStatByAuthor = async () => {
    setIsLoading(true);

    const flatDailyStatByAuthor: RealEstateByAuthorDailyDto[] = await axios
      .get(`${environments.REACT_APP_PROXY}/api/${RealEstateType.FLATS}/statByRoomCountAndAuthor`, {
        params: {
          city,
        },
      })
      .then((res) => res.data);

    const houseDailyStatByAuthor: RealEstateByAuthorDailyDto[] = await axios
      .get(`${environments.REACT_APP_PROXY}/api/${RealEstateType.HOUSES}/statByAuthor`, {
        params: {
          city,
        },
      })
      .then((res) => res.data);

    const modifiedFlatData = modifyDataByAuthor(flatDailyStatByAuthor, RealEstateTypeUpperCase.FLAT);
    const modifiedHouseData = modifyDataByAuthor(houseDailyStatByAuthor, RealEstateTypeUpperCase.HOUSE);

    setDataStat([...modifiedFlatData, ...modifiedHouseData]);
    setIsLoading(false);
  };

  const changeDataDisplayAuthor = (author: 'owner' | 'agency', dataSetIndex: number) => {
    const isChecked = !displayDataAuthor[author];
    const chartElement = ChartJS.getChart('chartForDayByAuthor');

    if (!chartElement) {
      return;
    }

    setDisplayDataAuthor((prev) => ({ ...prev, [author]: isChecked }));
    chartElement.setDatasetVisibility(dataSetIndex, isChecked);
  };

  useEffect(() => {
    fetchStatByAuthor();
  }, [city]);

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
            id='chartForDayByAuthorLoading'
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
          </Box>
          <ScaleRatioLineBar
            dataSets={[
              {
                backgroundColor: teal[300],
                width: `50%`,
                display: true,
              },
              {
                backgroundColor: primary[400],
                width: `50%`,
                display: true,
              },
            ]}
          />
        </Stack>
      </>
    );
  }

  const dataForChipCircle = [
    {
      text: ParserDefaultAuthorName.OWNER,
      isLineThrough: !displayDataAuthor.owner,
      color: teal[300],
      author: `owner` as const,
    },
    {
      text: ParserDefaultAuthorName.AGENCY,
      isLineThrough: !displayDataAuthor.agency,
      color: primary[400],
      author: `agency` as const,
    },
  ];

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
        <Typography variant={'body1Medium'} color={theme.palette.text.primary} children='По автору' />
        <Box display={'flex'} padding={'0px'} alignItems={'flex-start'} gap={theme.custom.base.module.second}>
          {dataForChipCircle.map((data, index) => (
            <ChipWithCircle
              text={data.text}
              circle={{ color: data.color, width: '16px', height: '16px' }}
              onClick={() => changeDataDisplayAuthor(data.author, index)}
              isLineThrough={data.isLineThrough}
            />
          ))}
        </Box>
      </Box>
      <Box sx={{ pointerEvents: isLoading ? 'none' : 'auto' }} maxWidth={'1524px'}>
        <Bar
          id='chartForDayByAuthor'
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
                text: `${percentage.owner}%`,
                backgroundColor: teal[300],
                alignText: AlignText.LEFT,
                width: `${percentage.owner}%`,
                display: !!(displayDataAuthor.owner && percentage.owner),
              },
              {
                text: `${percentage.agency}%`,
                backgroundColor: primary[400],
                alignText: AlignText.RIGHT,
                width: `${percentage.agency}%`,
                display: !!(displayDataAuthor.agency && percentage.agency),
              },
            ]}
          />
        </Stack>
      )}
    </>
  );
};
