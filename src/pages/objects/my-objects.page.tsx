import React, { useEffect, useState } from 'react';
import FlatObject from '../../features/objects/flat/flat-object';
import HouseObject from '../../features/objects/house/house-object';
import LandObject from '../../features/objects/land/land-object';
import { TabLink } from '../../shared/enums/tab-link.enum';
import { useRootStore } from '../../root-store.context';
import TabsUI from '../../shared/ui-kit/tab-control/tabs';
import { TitleTypography } from '../../features/account/ui/ui';

const MyObjectsPage = () => {
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
        Мои объекты
      </TitleTypography>
      <TabsUI value={value} setValue={setValue} handleChange={handleChange} />
      {value === TabLink.FLATS && <FlatObject value={value} index={TabLink.FLATS} />}
      {value === TabLink.HOUSES && <HouseObject value={value} index={TabLink.HOUSES} />}
      {value === TabLink.LANDS && <LandObject value={value} index={TabLink.LANDS} />}
    </>
  );
};

export default MyObjectsPage;
