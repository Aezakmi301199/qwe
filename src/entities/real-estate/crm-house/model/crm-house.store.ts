import { CrmStore } from '../../../../shared/lib/crm-store';
import { CrmHouse } from '../../object/model/type';
import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import axios from 'axios';
import { handleAxiosError } from '../../../../shared/lib/handle-axios-error';
import { InitialState, PageLimit } from '../../../../shared/enums/pagination.enum';
import { CrmRealEstateFilter } from '../../common/type';
import qs from 'qs';
import { environments } from '../../../../environment';

export class CrmHouseStore implements CrmStore<CrmHouse> {
  @observable crmRealEstate: CrmHouse[] = [];
  @observable crmRealEstateCount = 0;
  loading = true;
  @observable rowsPerPage: PageLimit = PageLimit.FIFTEEN;
  @observable isErrorData = true;
  @observable filter: CrmRealEstateFilter = {
    page: InitialState.FIRST,
  };

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setLoadingRealEstate(loadingState: boolean) {
    this.loading = loadingState;
  }

  @action
  setRowsPerPage(rowsPerPage: PageLimit) {
    this.rowsPerPage = rowsPerPage;
  }

  async fetchCrmRealEstate(userId: string) {
    this.setLoadingRealEstate(true);
    this.isErrorData = true;

    try {
      const query = qs.stringify({
        page: this.filter.page,
        crmRealEstateStatus: this.filter.crmRealEstateStatus,
      });
      const dataFlats: CrmHouse[] = await axios
        .get(`${environments.REACT_APP_PROXY}/api/users/${userId}/crm-houses?${query}`)
        .then((res) => {
          return res.data;
        });

      runInAction(() => {
        this.crmRealEstate = dataFlats;
        this.setLoadingRealEstate(false);
        this.isErrorData = false;
      });
    } catch (error) {
      handleAxiosError(error);
      this.isErrorData = true;
    }

    this.setLoadingRealEstate(false);
    this.isErrorData = false;
  }

  @action
  incrementCrmCommentCount(realEstateId: string) {
    const crmHouse = this.findCrmRealEstateById(realEstateId);

    if (!crmHouse) {
      return;
    }

    crmHouse.houses[0].house._count.comments++;
  }

  @action
  async fetchCrmRealEstateCount(userId: string) {
    axios.get(`${environments.REACT_APP_PROXY}/api/users/${userId}/crm-houses/count`).then((response) => {
      runInAction(() => {
        this.crmRealEstateCount = response.data.count;
      });
    });
  }

  @action
  findCrmRealEstateById(realEstateId: string) {
    return this.crmRealEstate.find((house) => house.houses[0].house.id === realEstateId);
  }

  @action
  setFilter(filter: CrmRealEstateFilter) {
    this.filter = filter;
  }
}
