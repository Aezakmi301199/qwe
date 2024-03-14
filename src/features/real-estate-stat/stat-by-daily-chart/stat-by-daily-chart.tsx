import 'chartjs-adapter-date-fns';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import { UiToggleButtonGroup } from '../../../shared/ui-kit/group-toggle-button/group-toggle-button';
import { ContainerStat } from '../../../shared/styles/styles';
import { StatHeader } from '../ui/stat-header';
import { StatByDailyAuthorContentChart } from './stat-by-daily-author-content-chart';
import { StatByDailyDealTypeContentChart } from './stat-by-daily-deal-type-content-chart';
import { useRootStore } from '../../../root-store.context';
import { observer } from 'mobx-react-lite';

type StatByWeekChartProps = {
  city: string;
};

export enum RealEstateToggleButtonByDaily {
  AUTHOR = 'author',
  DEAL_TYPE = 'dealType',
}

const realEstateDailyOptions = [
  { value: RealEstateToggleButtonByDaily.AUTHOR, text: 'По автору' },
  { value: RealEstateToggleButtonByDaily.DEAL_TYPE, text: 'По типу сделки' },
];

export const StatByDailyChart: React.FC<StatByWeekChartProps> = observer(({ city }) => {
  const theme = useTheme();
  const [toggleButtonDaily, setToggleButtonDaily] = useState(RealEstateToggleButtonByDaily.AUTHOR);
  const [isLoading, setIsLoading] = useState(true);
  const { cityStore } = useRootStore();
  const counterWorkedSite = new Set(cityStore.findTasksByCity(city).map((task) => task.script)).size;
  const [totalCountRealEstate, setTotalCountRealEstate] = useState<number>(0);
  const changeToggleButtonDaily = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    stateToggleButton: RealEstateToggleButtonByDaily,
  ) => {
    setToggleButtonDaily(stateToggleButton);
  };

  useEffect(() => {
    setToggleButtonDaily(RealEstateToggleButtonByDaily.AUTHOR);
  }, [city]);

  return (
    <ContainerStat
      padding={`${theme.custom.base.module.third} ${theme.custom.base.module.fifth} ${theme.custom.base.module.third} ${theme.custom.base.module.third}`}
      direction={'column'}
      alignItems={'center'}
      gap={theme.custom.base.module.third}
    >
      <StatHeader
        title={'Объявления за текущий день'}
        secondaryText={`Обрабатывается сайтов: ${counterWorkedSite}, Всего объявлений обработано: ${totalCountRealEstate}`}
        secondaryTypographyProps={{
          visibility: !isLoading ? 'visible' : 'hidden',
        }}
        endButtons={
          !isLoading && (
            <UiToggleButtonGroup
              value={toggleButtonDaily}
              onChange={changeToggleButtonDaily}
              options={realEstateDailyOptions}
              sx={{
                width: 'fit-content',
              }}
              exclusive={true}
            />
          )
        }
      />
      {toggleButtonDaily === RealEstateToggleButtonByDaily.AUTHOR ? (
        <StatByDailyAuthorContentChart
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          city={city}
          setTotalCountRealEstate={setTotalCountRealEstate}
        />
      ) : (
        <StatByDailyDealTypeContentChart
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          city={city}
          setTotalCountRealEstate={setTotalCountRealEstate}
        />
      )}
    </ContainerStat>
  );
});
