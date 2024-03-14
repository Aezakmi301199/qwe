import { CrmStore } from '../../../../shared/lib/crm-store';
import { CrmFlat } from '../../object/model/type';
import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import axios from 'axios';
import { handleAxiosError } from '../../../../shared/lib/handle-axios-error';
import { InitialState, PageLimit } from '../../../../shared/enums/pagination.enum';
import { CrmRealEstateFilter } from '../../common/type';
import { stringify } from 'qs';
import { environments } from '../../../../environment';

export class CrmFlatStore implements CrmStore<CrmFlat> {
  @observable crmRealEstate: CrmFlat[] = [];
  @observable crmRealEstateCount = InitialState.ZERO;
  loading = true;
  rowsPerPage: PageLimit = PageLimit.FIFTEEN;
  @observable isErrorData = true;
  @observable filter: CrmRealEstateFilter = {
    page: InitialState.FIRST,
  };

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setRowsPerPage(rowsPerPage: PageLimit) {
    this.rowsPerPage = rowsPerPage;
  }

  @action
  setLoadingRealEstate(loadingState: boolean) {
    this.loading = loadingState;
  }

  @action
  async fetchCrmRealEstate(userId: string) {
    this.setLoadingRealEstate(true);
    this.isErrorData = true;

    try {
      const query = stringify({
        page: this.filter.page,
        crmRealEstateStatus: this.filter.crmRealEstateStatus,
      });

      const dataFlats: CrmFlat[] = await axios
        .get(`${environments.REACT_APP_PROXY}/api/users/${userId}/crm-flats?${query}`)
        .then((res) => {
          return res.data;
        });

      runInAction(() => {
        this.crmRealEstate = dataFlats;
        this.setLoadingRealEstate(false);
        this.isErrorData = false;
      });
    } catch (error) {
      this.isErrorData = true;
      handleAxiosError(error);
    }

    this.setLoadingRealEstate(false);
    this.isErrorData = false;
  }

  @action
  incrementCrmCommentCount(realEstateId: string) {
    const crmFlat = this.findCrmRealEstateById(realEstateId);

    if (!crmFlat) {
      return;
    }

    crmFlat.flats[0].flat._count.comments++;
  }

  @action
  async fetchCrmRealEstateCount(userId: string) {
    const query = stringify({
      crmRealEstateStatus: this.filter.crmRealEstateStatus,
    });

    axios.get(`${environments.REACT_APP_PROXY}/api/users/${userId}/crm-flats/count?${query}`).then((response) => {
      runInAction(() => {
        this.crmRealEstateCount = response.data.count;
      });
    });
  }

  @action
  findCrmRealEstateById(realEstateId: string) {
    return this.crmRealEstate.find((flat) => flat.flats[0].flat.id === realEstateId);
  }

  @action
  setFilter(filter: CrmRealEstateFilter) {
    this.filter = filter;
  }
}
