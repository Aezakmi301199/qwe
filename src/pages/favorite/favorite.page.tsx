import React, { useEffect, useState } from 'react';
import { TabLink } from '../../shared/enums/tab-link.enum';
import { useRootStore } from '../../root-store.context';
import FavoriteFlat from '../../features/favorites/flat/favorite-flat';
import FavoriteHouse from '../../features/favorites/house/favorite-house';
import FavoriteLand from '../../features/favorites/land/favorite-land';
import TabsUI from '../../shared/ui-kit/tab-control/tabs';
import { TitleTypography } from '../../features/account/ui/ui';

const FavoritePage = () => {
  const [value, setValue] = useState<TabLink>(TabLink.FLATS);
  const { catalogStore } = useRootStore();

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    catalogStore.fetchDomains();
  }, []);

  return (
    <>
      <TitleTypography
        sx={{
          padding: '24px 24px 8px 24px',
        }}
      >
        Избранное
      </TitleTypography>
      <TabsUI value={value} setValue={setValue} handleChange={handleChange} />
      {value === TabLink.FLATS && <FavoriteFlat />}
      {value === TabLink.HOUSES && <FavoriteHouse />}
      {value === TabLink.LANDS && <FavoriteLand />}
    </>
  );
};

export default FavoritePage;
