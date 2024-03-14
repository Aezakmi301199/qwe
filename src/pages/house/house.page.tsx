import { Stack, useTheme } from '@mui/material';
import HouseGrid from '../../features/grid/house-grid';
import { FilterHouseComponent } from '../../widgets/filter-component/filter-house-component';
import { defaultHouseFilter, HouseFilterType } from '../../entities/real-estate/house';
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

const HousePage = observer(() => {
  const theme = useTheme();
  const user = useUser();
  const { catalogStore, cityStore, houseStore } = useRootStore();
  const { getItemStorage } = useLocalStorage(LocalStorageName.HOUSE_FILTER);
  const [loading, setLoading] = useState<boolean>(true);

  const processingDataFilter = async () => {
    houseStore.resetStore();
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

    const houseFilterLocalStorage: HouseFilterType = getItemStorage();

    const cities = houseFilterLocalStorage ? houseFilterLocalStorage.city : [user.workAddress.cityId];

    cities.length === 1 && (await cityStore.fetchMetroStationByCityId(cities[0]));

    const connectedDomains = cityStore.findConnectedDomainsByParams({
      city: cities,
      domains: catalogStore.findDomains(),
      realEstateType: RealEstateTypeUpperCase.HOUSE,
    });

    const filter = houseStore.currentFilter ??
      houseFilterLocalStorage ?? {
        ...defaultHouseFilter,
        statusId: catalogStore.findStatuses().map((status) => status.id),
        city: cities,
        domain: connectedDomains.map((domain: DomainSource) => domain.value),
      };

    houseStore.setCurrentFilter(filter);
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
            <FilterHouseComponent />
            <HouseGrid />
          </>
        }
      />
    </Stack>
  );
});

export default HousePage;
