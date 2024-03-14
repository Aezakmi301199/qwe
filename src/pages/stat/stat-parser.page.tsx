import { useEffect, useState } from 'react';
import { Box, List, Stack, useTheme } from '@mui/material';
import { Size } from '../../shared/enums/size.enum';
import UITabControl from '../../components/tabs/tab-control';
import { PagePath } from '../../shared/enums/page-path';
import { useRootStore } from '../../root-store.context';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { City, CityAutoComplete } from '../../entities/city';
import { ContainerChart } from '../../shared/styles/styles';
import { ListItemButton } from '../../shared/ui-kit/list-item-button/list-item-button';
import { StatByDomainTable } from '../../features/real-estate-stat/stat-by-domain-table';
import { StatOurActionColumn } from '../../features/real-estate-stat/stat-our-action-column';
import { StatByDailyChart } from '../../features/real-estate-stat/stat-by-daily-chart/stat-by-daily-chart';
import { StatByRealEstateTable } from '../../features/real-estate-stat/stat-by-real-estate-table';
import { useUser } from '../../user-context';
import { StatByWeekChart } from '../../features/real-estate-stat/stat-by-week-chart';
import StatByWeekChartPlug from '../../features/real-estate-stat/stat-by-week-chart-plug';
import { getStabDataByRole } from '../../shared/tab/stat-tab-data';

enum refChart {
  PRIVATE_STAT = 'privateStat',
  STAT_BY_WEEK = 'statChartByWeek',
  STAT_BY_DOMAINS = 'statChartByDomains',
  STAT_BY_REAL_ESTATE_TYPE = 'statChartByRealEstateType',
  STAT_BY_TODAY = 'statChartByToday',
}

const ulRefList = [
  { id: 0, label: 'Ваша статистика', value: refChart.PRIVATE_STAT },
  {
    id: 1,
    label: 'Среднее количество объявлений от частных лиц за месяц',
    value: refChart.STAT_BY_WEEK,
  },
  { id: 2, label: 'Статистика по агрегаторам', value: refChart.STAT_BY_DOMAINS },
  {
    id: 3,
    label: 'Статистика по типам недвижимости',
    value: refChart.STAT_BY_REAL_ESTATE_TYPE,
  },
  { id: 4, label: 'Объявления за текущий день', value: refChart.STAT_BY_TODAY },
];

enum TabLinkStat {
  STATS_PARSER,
  STATS_TEAM,
}

export const StatParserPage = observer(() => {
  const theme = useTheme();
  const user = useUser();
  const [tabStat, setSetTabStat] = useState(TabLinkStat.STATS_PARSER);
  const [selectedChart, setSelectedChart] = useState(refChart.PRIVATE_STAT);
  const [selectedCity, setSelectedCity] = useState<string>(user.workAddress.cityId);
  const { catalogStore, cityStore } = useRootStore();
  const isLoadingCityAndDomain = !catalogStore.findDomains().length;
  const isLoadingTasks = !cityStore.findTasksByCities().length;
  const navigate = useNavigate();
  const changeCity = (city: string) => {
    setSelectedCity(city);
  };

  const handleChartRef = (ref: refChart) => {
    const currentRef = document.getElementById(ref);

    if (currentRef) {
      currentRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setSelectedChart(ref);
  };

  const processingDataFilter = async () => {
    await (async () => {
      if (!catalogStore.findDomains().length) {
        await catalogStore.fetchDomains();
      }

      if (!cityStore.findCities().length) {
        await cityStore.fetchData();
      }

      if (!cityStore.findTasksByCities().length) {
        await cityStore.fetchTasksByCities(cityStore.city.map((city: City) => city.id));
      }
    })();
  };

  useEffect(() => {
    processingDataFilter();
  }, []);

  return (
    <Box>
      {!isLoadingCityAndDomain && !isLoadingTasks && selectedCity && user && (
        <>
          <Box sx={{ padding: `0 ${theme.custom.layout.padding.lg}` }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'relative' }}>
              <UITabControl
                tabControl={{
                  sx: {
                    paddingTop: '0px',
                  },
                }}
                tabs={{
                  sx: {
                    marginLeft: '0px',
                  },
                }}
                selectedTab={tabStat}
                setSelectedTab={setSetTabStat}
                handleTabChange={() => navigate(PagePath.STATS_TEAM)}
                tabData={getStabDataByRole()}
              />
            </Box>
          </Box>
          <ContainerChart>
            <List dense={false} sx={{ width: '260px', paddingTop: '0px' }}>
              <CityAutoComplete
                name={'city'}
                handleChange={changeCity}
                id={'city'}
                width={'260px'}
                inputLabel={'Город'}
                size={Size.SMALL}
                value={selectedCity}
                error={!selectedCity}
              />
              <Box marginTop={'16px'}>
                {ulRefList.map((refData) => (
                  <ListItemButton
                    selected={selectedChart === refData.value}
                    key={refData.id}
                    onClick={(e) => handleChartRef(refData.value)}
                    label={refData.label}
                  />
                ))}
              </Box>
            </List>
            <Box display={'flex'} justifyContent={'center'} flexGrow={1}>
              <Stack
                alignItems={'flex-start'}
                gap={'24px'}
                flex={'1 0 0'}
                padding={'0px'}
                maxWidth={'1590px'}
                sx={{
                  overflowY: 'auto',
                  height: 'calc(100dvh - 154px)',
                  '&>div': {
                    width: '100%',
                  },
                }}
              >
                <Box id={refChart.PRIVATE_STAT}>
                  <StatOurActionColumn />
                </Box>
                <Box id={refChart.STAT_BY_WEEK}>
                  {!user.subscriptionPlan.isDefault ? <StatByWeekChart city={selectedCity} /> : <StatByWeekChartPlug />}
                </Box>
                <Box id={refChart.STAT_BY_DOMAINS}>
                  <StatByDomainTable city={selectedCity} />
                </Box>
                <Box id={refChart.STAT_BY_REAL_ESTATE_TYPE}>
                  <StatByRealEstateTable city={selectedCity} />
                </Box>
                <Box id={refChart.STAT_BY_TODAY}>
                  <StatByDailyChart city={selectedCity} />
                </Box>
              </Stack>
            </Box>
          </ContainerChart>
        </>
      )}
    </Box>
  );
});

export default StatParserPage;
