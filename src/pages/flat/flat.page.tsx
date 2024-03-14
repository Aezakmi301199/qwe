import { Stack, useTheme } from '@mui/material';
import FlatGrid from '../../features/grid/flat-grid';
import { observer } from 'mobx-react-lite';
import { FilterFlatComponent } from '../../widgets/filter-component/filter-flat-component';
import { defaultFlatFilter, FlatFilterType } from '../../entities/real-estate/flat';
import { useEffect, useState } from 'react';
import { City } from '../../entities/city';
import { DomainSource } from '../../entities/domain';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { useRootStore } from '../../root-store.context';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import { SpinnerUiProvider } from '../../shared/ui-kit/spinner/spinner';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { useUser } from '../../user-context';

const FlatPage = observer(() => {
  const theme = useTheme();
  const { catalogStore, cityStore, flatStore } = useRootStore();
  const user = useUser();
  const { getItemStorage } = useLocalStorage(LocalStorageName.FLAT_FILTER);
  const [loading, setLoading] = useState<boolean>(true);
  const processingDataFilter = async () => {
    flatStore.resetStore();
    setLoading(true);
    await (async () => {
      if (!catalogStore.findDomains().length) {
        await catalogStore.fetchDomains();
      }

      if (!catalogStore.findStatuses().length) {
        await catalogStore.fetchStatuses();
      }

      if (!cityStore.findCities().length) {
        await cityStore.fetchData();
      }

      if (!cityStore.findTasksByCities().length) {
        await cityStore.fetchTasksByCities(cityStore.city.map((city: City) => city.id));
      }
    })();

    const flatFilterLocalStorage: FlatFilterType = getItemStorage();

    const cities = flatFilterLocalStorage ? flatFilterLocalStorage.city : [user.workAddress.cityId];

    cities.length === 1 && (await cityStore.fetchMetroStationByCityId(cities[0]));

    const connectedDomains = cityStore.findConnectedDomainsByParams({
      city: cities,
      domains: catalogStore.findDomains(),
      realEstateType: RealEstateTypeUpperCase.FLAT,
    });

    const filter = flatStore.currentFilter ??
      flatFilterLocalStorage ?? {
        ...defaultFlatFilter,
        statusId: catalogStore.findStatuses().map((status) => status.id),
        city: cities,
        domain: connectedDomains.map((domain: DomainSource) => domain.value),
      };

    flatStore.setCurrentFilter(filter);
    setLoading(false);
  };

  useEffect(() => {
    processingDataFilter();
  }, []);

  return (
    <Stack bgcolor={theme.palette.common.white}>
      <SpinnerUiProvider
        statePending={loading}
        children={
          <>
            <FilterFlatComponent />
            <FlatGrid />
          </>
        }
      />
    </Stack>
  );
});

export default FlatPage;
