import { Stack, useTheme } from '@mui/material';
import LandGrid from '../../features/grid/land-grid';
import { defaultLandFilter, LandFilterType } from '../../entities/real-estate/land';
import { FilterLandComponent } from '../../widgets/filter-component/filter-land-component';
import { useEffect, useState } from 'react';
import { City } from '../../entities/city';
import { DomainSource } from '../../entities/domain';
import { useRootStore } from '../../root-store.context';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import { SpinnerUiProvider } from '../../shared/ui-kit/spinner/spinner';
import { observer } from 'mobx-react-lite';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { useUser } from '../../user-context';

const LandPage = observer(() => {
  const theme = useTheme();
  const { catalogStore, cityStore, landStore } = useRootStore();
  const user = useUser();
  const { getItemStorage } = useLocalStorage(LocalStorageName.LAND_FILTER);
  const [loading, setLoading] = useState<boolean>(true);

  const processingDataFilter = async () => {
    landStore.resetStore();
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

    const landFilterLocalStorage: LandFilterType = getItemStorage();

    const cities = landFilterLocalStorage ? landFilterLocalStorage.city : [user.workAddress.cityId];

    cities.length === 1 && (await cityStore.fetchMetroStationByCityId(cities[0]));

    const connectedDomains = cityStore.findConnectedDomainsByParams({
      city: cities,
      domains: catalogStore.findDomains(),
      realEstateType: RealEstateTypeUpperCase.LAND,
    });

    const filter = landStore.currentFilter ??
      landFilterLocalStorage ?? {
        ...defaultLandFilter,
        statusId: catalogStore.findStatuses().map((status) => status.id),
        city: cities,
        domain: connectedDomains.map((domain: DomainSource) => domain.value),
      };

    landStore.setCurrentFilter(filter);
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
            <FilterLandComponent />
            <LandGrid />
          </>
        }
      />
    </Stack>
  );
});

export default LandPage;
