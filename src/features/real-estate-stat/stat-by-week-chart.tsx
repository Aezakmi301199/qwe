import {
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography, useTheme } from '@mui/material';
import { blue, green, lime, orange, red, yellow } from '@mui/material/colors';
import { RealEstateType } from '../../shared/enums/real-estate-type.enum';
import { RealEstateByPublishingTime, ToggleButtonRealEstate } from '../../entities/real-estate';
import axios from 'axios';
import { ContainerStat } from '../../shared/styles/styles';
import { NumerationDayWeek } from '../../shared/enums/numeration-day-week';
import { DayWeek } from '../../shared/enums/day-week';
import { FindIndexResult } from '../../shared/enums/find-index-result';
import { DateTime, Duration } from 'luxon';
import { FontFamily } from '../../shared/enums/font-family.enum';
import { getLocaleNameDayWeek } from '../../shared/lib/get-local-name-day-week';
import { filterArrayByField } from '../../shared/utils/array';
import { StatHeader } from './ui/stat-header';
import { useDebounce } from '../../shared/hooks/use-debounce';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { Skeleton } from '../../shared/ui-kit/skeleton/skeleton';
import { environments } from '../../environment';

ChartJS.register(LineElement, TimeScale, LinearScale, PointElement, Title, Tooltip, Legend);

type DayCheckBoxControlProps = {
  nameCheckbox: DayWeek;
  checked: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, day: DayWeek, dataSetIndex: number) => void;
  label: string;
  color: string;
  dataIndex: number;
  isLoading: boolean;
};

type XAxesTimeLine = {
  time: Date;
  timeHour: number;
  weekDay: number;
  _avg: number;
};

type StatByWeekChartProps = {
  city: string;
};

const DayCheckBoxControl: React.FC<DayCheckBoxControlProps> = ({
  nameCheckbox,
  checked,
  handleChange,
  label,
  color,
  dataIndex,
  isLoading,
}) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box display={'flex'} alignItems={'center'}>
        <Checkbox
          disabled
          sx={{
            '& .MuiSvgIcon-root': {
              width: '20px',
              height: '20px',
            },
          }}
        />
        <Skeleton width={'100px'} height={'24px'} />
      </Box>
    );
  }

  return (
    <FormControlLabel
      sx={{
        marginLeft: '0px',
        marginRight: '0px',
        '& .MuiTypography-root': {
          fontFamily: 'Roboto',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: '150%',
          letterSpacing: '0.15px',
        },
      }}
      control={
        <Checkbox
          name={nameCheckbox}
          checked={checked}
          onChange={(e) => handleChange(e, nameCheckbox, dataIndex)}
          sx={{
            padding: '9px',
            '&.Mui-checked': {
              color: color,
            },
            '& .MuiSvgIcon-root': {
              width: theme.custom.checkbox.icon.ic.sm,
              height: theme.custom.checkbox.icon.ic.sm,
            },
          }}
        />
      }
      label={label}
    />
  );
};

const sortStatsAndMutationByPublishTime = (statsByPublishTime: RealEstateByPublishingTime[]): XAxesTimeLine[] => {
  const sortedByTimeStat = statsByPublishTime
    .map((stat) => {
      const date = DateTime.fromISO(stat.time);
      const updatedTime = DateTime.now()
        .set({
          hour: date.hour,
          minute: 0,
        })
        .toJSDate();

      return {
        ...stat,
        weekDay: date.weekday,
        timeHour: date.hour,
        time: updatedTime,
      };
    })
    .sort((prevStat, currentStat) => prevStat.timeHour - currentStat.timeHour)
    .reduce((newArrayStats, realEstateStat) => {
      // Этот reduce нужен для суммирования _avg count для домов и квартир в одинаковые время выставленных
      const realEstateStatAlreadyExistIndex = newArrayStats.findIndex(
        (stat: XAxesTimeLine) => stat.timeHour === realEstateStat.timeHour && stat.weekDay === realEstateStat.weekDay,
      );

      if (realEstateStatAlreadyExistIndex !== FindIndexResult.NOT_FOUND) {
        // Если объект уже есть, то суммируем значения count
        newArrayStats[realEstateStatAlreadyExistIndex]._avg += realEstateStat._avg;

        return newArrayStats;
      }

      // Если объекта с таким именем еще нет, то добавляем его в аккумулятор
      newArrayStats.push(realEstateStat);

      return newArrayStats;
    }, [] as XAxesTimeLine[]);

  return sortedByTimeStat;
};

const filterAndRefactorStatisticByDay = (arrayData: XAxesTimeLine[], numberDayWeek: NumerationDayWeek) => {
  const hoursWidthData = filterArrayByField(arrayData, 'weekDay', numberDayWeek) as XAxesTimeLine[];
  const isExistDataByDay = hoursWidthData.filter((data) => !!data._avg).length;

  if (!isExistDataByDay) {
    return;
  }

  return hoursWidthData.map((element: XAxesTimeLine) => {
    return {
      y: element._avg,
      x: element.time,
    };
  });
};

const getStatisticForWeekByDays = (statsByPublishTime: XAxesTimeLine[]) => {
  const theme = useTheme();
  const weekDays = [
    {
      label: getLocaleNameDayWeek({ numerationDayWeek: NumerationDayWeek.MONDAY }),
      borderColor: blue[500],
      pointBackgroundColor: theme.custom.base.info.main,
      fill: false,
      data: filterAndRefactorStatisticByDay(statsByPublishTime, NumerationDayWeek.MONDAY),
    },
    {
      label: getLocaleNameDayWeek({ numerationDayWeek: NumerationDayWeek.TUESDAY }),
      borderColor: green[500],
      pointBackgroundColor: theme.custom.base.success.main,
      fill: false,
      data: filterAndRefactorStatisticByDay(statsByPublishTime, NumerationDayWeek.TUESDAY),
    },
    {
      label: getLocaleNameDayWeek({ numerationDayWeek: NumerationDayWeek.WEDNESDAY }),
      borderColor: orange[400],
      pointBackgroundColor: theme.custom.base.warning.main,
      fill: false,
      data: filterAndRefactorStatisticByDay(statsByPublishTime, NumerationDayWeek.WEDNESDAY),
    },
    {
      label: getLocaleNameDayWeek({ numerationDayWeek: NumerationDayWeek.THURSDAY }),
      borderColor: red[400],
      pointBackgroundColor: theme.custom.base.error.main,
      fill: false,
      data: filterAndRefactorStatisticByDay(statsByPublishTime, NumerationDayWeek.THURSDAY),
    },
    {
      label: getLocaleNameDayWeek({ numerationDayWeek: NumerationDayWeek.FRIDAY }),
      borderColor: theme.custom.base.secondary.main,
      pointBackgroundColor: theme.custom.base.secondary.main,
      fill: false,
      data: filterAndRefactorStatisticByDay(statsByPublishTime, NumerationDayWeek.FRIDAY),
    },
    {
      label: getLocaleNameDayWeek({ numerationDayWeek: NumerationDayWeek.SATURDAY }),
      borderColor: yellow[400],
      pointBackgroundColor: theme.custom.base.yellow.main,
      fill: false,
      data: filterAndRefactorStatisticByDay(statsByPublishTime, NumerationDayWeek.SATURDAY),
    },
    {
      label: getLocaleNameDayWeek({ numerationDayWeek: NumerationDayWeek.SUNDAY }),
      borderColor: lime[400],
      pointBackgroundColor: theme.custom.base.lime.main,
      fill: false,
      data: filterAndRefactorStatisticByDay(statsByPublishTime, NumerationDayWeek.SUNDAY),
    },
  ];

  return weekDays;
};

const optionsByWeekChart: ChartOptions<'line'> = {
  responsive: false,
  maintainAspectRatio: false,
  devicePixelRatio: 2,
  elements: { point: { radius: 0 } },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'hour',
        displayFormats: {
          hour: 'HH:mm',
        },
        tooltipFormat: 'HH:00',
      },
      grid: {
        display: false,
      },
      ticks: {
        color: 'transparent',
        font: {
          size: 14,
          style: 'normal',
          lineHeight: '0%',
        },
      },
    },
    y: {
      beginAtZero: true,
      grace: '50%',
      grid: {
        display: true,
      },
      suggestedMax: 10,
      ticks: {
        color: 'rgba(26, 26, 26, 0.87)',
        font: {
          family: FontFamily.ROBOTO,
          size: 14,
          style: 'normal',
          weight: 400,
          lineHeight: '143%',
        },
        precision: 0,
      },
    },
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
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

const loadingOptionsByWeekChart: ChartOptions<'line'> = {
  responsive: false,
  maintainAspectRatio: false,
  devicePixelRatio: 2,
  elements: { point: { radius: 0 } },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'hour',
        displayFormats: {
          hour: 'HH:mm',
        },
        tooltipFormat: 'HH:00',
      },
      grid: {
        display: false,
      },
      ticks: {
        color: 'transparent',
        font: {
          size: 14,
          style: 'normal',
          lineHeight: '0%',
        },
      },
    },
    y: {
      beginAtZero: true,
      grace: '50%',
      border: {
        display: false,
      },
      grid: {
        display: true,
      },
      suggestedMax: 10,
      ticks: {
        display: false,
        color: 'rgba(26, 26, 26, 0.87)',
        font: {
          family: FontFamily.ROBOTO,
          size: 14,
          style: 'normal',
          weight: 400,
          lineHeight: '143%',
        },
        precision: 0,
      },
    },
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
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

const rangeDayByHours = () => {
  const startTime = '00:00';
  const endTime = '24:00';
  const interval = '01:00';

  const dateStartTime = DateTime.fromFormat(startTime, 'H:mm');
  let datePresentTime = dateStartTime;
  const dateEndTime = DateTime.fromFormat(endTime, 'H:mm');
  const durationInterval = Duration.fromISOTime(interval);

  const hoursByDay = [];

  while (datePresentTime < dateEndTime) {
    hoursByDay.push(datePresentTime.toFormat('HH:mm'));
    datePresentTime = datePresentTime.plus(durationInterval);
  }

  return hoursByDay;
};

export const StatByWeekChart: React.FC<StatByWeekChartProps> = ({ city }) => {
  const theme = useTheme();

  const [selectedRealEstate, setSelectedRealEstate] = useState<RealEstateType>(RealEstateType.FLATS);
  const [isLoading, setIsLoading] = useState(true);
  const [dataStat, setDataStat] = useState<XAxesTimeLine[]>([]);
  const [options, setOptions] = useState(loadingOptionsByWeekChart);
  const weekDaysStat = getStatisticForWeekByDays(dataStat);

  const [displayDataDays, setDisplayDataDay] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  });

  const changeSelectedRealEstate = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    realEstate: RealEstateType | null,
  ) => {
    if (!realEstate) {
      return;
    }

    setSelectedRealEstate(realEstate);
  };

  const changeDataDisplayForDay = (event: React.ChangeEvent<HTMLInputElement>, day: DayWeek, dataSetIndex: number) => {
    const isChecked = event.target.checked;
    const chartElement = ChartJS.getChart('chartForWeek');

    if (!chartElement) {
      return;
    }

    setDisplayDataDay((prev) => ({ ...prev, [day]: isChecked }));
    chartElement.setDatasetVisibility(dataSetIndex, isChecked);
  };

  const fetchStatByPublishingTime = useDebounce(async (city: string, selectedRealEstate: RealEstateType) => {
    setIsLoading(true);
    setOptions(loadingOptionsByWeekChart);

    const StatByPublishingTime: RealEstateByPublishingTime[] = await axios
      .get(`${environments.REACT_APP_PROXY}/api/${selectedRealEstate}/statByPublishingTime`, {
        params: {
          city,
        },
      })
      .then((res) => res.data);

    setDataStat(sortStatsAndMutationByPublishTime(StatByPublishingTime));
    setIsLoading(false);
    setOptions(optionsByWeekChart);
  }, TimeConvert.MILLISECONDS_IN_MILLISECONDS * 200);

  useEffect(() => {
    setSelectedRealEstate(RealEstateType.FLATS);
  }, [city]);

  useEffect(() => {
    fetchStatByPublishingTime(city, selectedRealEstate);
  }, [city, selectedRealEstate]);

  const dataDayCheckBoxControl = [
    {
      nameCheckbox: DayWeek.MONDAY,
      checked: displayDataDays.monday,
      label: getLocaleNameDayWeek({
        numerationDayWeek: NumerationDayWeek.MONDAY,
      }),
      color: theme.custom.base.info.main,
    },
    {
      nameCheckbox: DayWeek.TUESDAY,
      checked: displayDataDays.tuesday,
      label: getLocaleNameDayWeek({
        numerationDayWeek: NumerationDayWeek.TUESDAY,
      }),
      color: theme.custom.base.success.main,
    },
    {
      nameCheckbox: DayWeek.WEDNESDAY,
      checked: displayDataDays.wednesday,
      label: getLocaleNameDayWeek({
        numerationDayWeek: NumerationDayWeek.WEDNESDAY,
      }),
      color: theme.custom.base.warning.main,
    },
    {
      nameCheckbox: DayWeek.THURSDAY,
      checked: displayDataDays.thursday,
      label: getLocaleNameDayWeek({
        numerationDayWeek: NumerationDayWeek.THURSDAY,
      }),
      color: theme.custom.base.error.main,
    },
    {
      nameCheckbox: DayWeek.FRIDAY,
      checked: displayDataDays.friday,
      label: getLocaleNameDayWeek({
        numerationDayWeek: NumerationDayWeek.FRIDAY,
      }),
      color: theme.custom.base.secondary.main,
    },
    {
      nameCheckbox: DayWeek.SATURDAY,
      checked: displayDataDays.saturday,
      label: getLocaleNameDayWeek({
        numerationDayWeek: NumerationDayWeek.SATURDAY,
      }),
      color: theme.custom.base.yellow.main,
    },
    {
      nameCheckbox: DayWeek.SUNDAY,
      checked: displayDataDays.sunday,
      label: getLocaleNameDayWeek({
        numerationDayWeek: NumerationDayWeek.SUNDAY,
      }),
      color: theme.custom.base.lime.main,
    },
  ];

  return (
    <ContainerStat
      padding={`${theme.custom.base.module.third} ${theme.custom.base.module.fifth} ${theme.custom.base.module.third} ${theme.custom.base.module.third}`}
      direction={'column'}
      alignItems={'center'}
      gap={theme.custom.base.module.second}
    >
      <StatHeader
        title={'Среднее количество объявлений от частных лиц за месяц'}
        secondaryText={
          'Изменение активности публикации объявлений частных лиц в течение суток, собранных за последний месяц.'
        }
        endButtons={
          !isLoading && (
            <ToggleButtonRealEstate
              value={selectedRealEstate}
              onChange={changeSelectedRealEstate}
              sx={{ width: 'fit-content' }}
            />
          )
        }
      />
      <Box>
        <Box
          sx={{
            paddingTop: theme.custom.base.module.second,
            display: 'flex',
            alignItems: 'flex-start',
            gap: theme.custom.base.module.first,
            alignSelf: 'stretch',
          }}
        >
          <FormGroup
            row={true}
            sx={{
              display: 'flex',
              padding: '0px',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            {dataDayCheckBoxControl.map((dayData, index) => (
              <DayCheckBoxControl
                nameCheckbox={dayData.nameCheckbox}
                checked={dayData.checked}
                handleChange={changeDataDisplayForDay}
                label={dayData.label}
                color={dayData.color}
                dataIndex={index}
                isLoading={isLoading}
              />
            ))}
          </FormGroup>
        </Box>
        <Box sx={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
          <Line
            id='chartForWeek'
            style={{ boxSizing: 'border-box' }}
            width={'1520px'}
            height={'350px'}
            options={options}
            data={{
              datasets: weekDaysStat,
            }}
          ></Line>
          <Box
            sx={{
              display: 'flex',
              padding: `8px 0px 0px 14px`,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              alignSelf: 'stretch',
            }}
          >
            {rangeDayByHours().map((hour: string) => (
              <Typography variant={'body2'}>{hour}</Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </ContainerStat>
  );
};
