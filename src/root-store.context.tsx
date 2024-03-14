import React, { createContext, ReactElement } from 'react';
import { CatalogStore } from './entities/domain/catalog.store';
import { Store } from './shared/lib/store';
import { Flat, FlatStore } from './entities/real-estate/flat';
import { House, HouseStore } from './entities/real-estate/house';
import { Land, LandStore } from './entities/real-estate/land';
import { CityStore } from './entities/city';
import { CrmFlat, CrmHouse, CrmLand } from './entities/real-estate/object/model/type';
import { CrmFlatStore } from './entities/real-estate/crm-flat/model/crm-flat.store';
import { CrmStore } from './shared/lib/crm-store';
import { CrmHouseStore } from './entities/real-estate/crm-house/model/crm-house.store';
import { CrmLandStore } from './entities/real-estate/crm-land/model/crm-land.store';
import { FlatCallStore } from './entities/real-estate/flat-call/model/flat-call.store';
import { HouseCallStore } from './entities/real-estate/house-call/model/house-call.store';
import { CallStore } from './shared/lib/call-store';
import { CallDataFlat, CallDataHouse, CallDataLand } from './entities/real-estate/flat-call/model/type';
import { LandCallStore } from './entities/real-estate/land-call/model/land-call.store';
import { MapStore } from './features/real-estate-map/map-store';
import { PaymentStore } from './entities/payment/model/payment.store';
import { StatTeamStore } from './entities/user';
import { IStatTeamStore } from './entities/user/model/stat-team.store';

class RootStore {
  constructor(
    public readonly flatStore: Store<Flat>,
    public readonly crmFlatStore: CrmStore<CrmFlat>,
    public readonly houseStore: Store<House>,
    public readonly crmHouseStore: CrmStore<CrmHouse>,
    public readonly landStore: Store<Land>,
    public readonly crmLandStore: CrmStore<CrmLand>,
    public readonly catalogStore: CatalogStore,
    public readonly cityStore: CityStore,
    public readonly flatCallStore: CallStore<CallDataFlat>,
    public readonly houseCallStore: CallStore<CallDataHouse>,
    public readonly landCallStore: CallStore<CallDataLand>,
    public readonly flatMapStore: MapStore,
    public readonly houseMapStore: MapStore,
    public readonly landMapStore: MapStore,
    public readonly paymentStore: PaymentStore,
    public readonly statTeamStore: IStatTeamStore,
  ) {}
}

const RootStoreContext = createContext<RootStore>({} as RootStore);
const catalogStore = new CatalogStore();
const flatStore = new FlatStore(catalogStore);
const crmFlatStore = new CrmFlatStore();
const houseStore = new HouseStore(catalogStore);
const crmHouseStore = new CrmHouseStore();
const landStore = new LandStore(catalogStore);
const crmLandStore = new CrmLandStore();
const cityStore = new CityStore();
const flatCallStore = new FlatCallStore();
const houseCallStore = new HouseCallStore();
const landCallStore = new LandCallStore();
const flatMapStore = new MapStore(cityStore, flatStore);
const houseMapStore = new MapStore(cityStore, houseStore);
const landMapStore = new MapStore(cityStore, landStore);
const paymentStore = new PaymentStore();
const statTeamStore = new StatTeamStore();
const rootStore = new RootStore(
  flatStore,
  crmFlatStore,
  houseStore,
  crmHouseStore,
  landStore,
  crmLandStore,
  catalogStore,
  cityStore,
  flatCallStore,
  houseCallStore,
  landCallStore,
  flatMapStore,
  houseMapStore,
  landMapStore,
  paymentStore,
  statTeamStore,
);

export const RootStoreProvider: React.FC<React.PropsWithChildren<Record<string, ReactElement>>> = ({ children }) => {
  return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
};

export const useRootStore = () => React.useContext(RootStoreContext);
