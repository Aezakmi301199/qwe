import React from 'react';
import { TabLink } from '../../shared/enums/tab-link.enum';
import Layout from './layout/layout';
import { CityFilters, CityList } from '../../features/city';
import { TaskCityConnectComponent } from '../../features/task-city-connect-component';

type TaskPageProps = {
  selectedTab: TabLink;
};

const TaskPage: React.FC<TaskPageProps> = () => {
  const [selectedCity, setSelectedCity] = React.useState<string>('1');

  return (
    <Layout
      actionFilters={<CityFilters />}
      sidebar={<CityList cityId={selectedCity} setCityId={setSelectedCity} />}
      mainContent={<TaskCityConnectComponent selectedCityId={selectedCity} />}
    />
  );
};

export default TaskPage;
