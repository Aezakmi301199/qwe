import { DomainSource } from './model/type';
import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import axios from 'axios';
import { handleAxiosError } from '../../shared/lib/handle-axios-error';
import { Status } from '../status';
import { CrmStatus } from '../crm-status';
import { StatusName } from '../../shared/enums/status.enum';
import { environments } from '../../environment';

export class CatalogStore {
  @observable
  domains: DomainSource[] = [];

  @observable
  private statuses: Status[] = [];

  @observable
  private crmStatuses: CrmStatus[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action
  async fetchDomains() {
    try {
      const response = await axios.get(`${environments.REACT_APP_PROXY}/api/domains`);

      runInAction(() => {
        this.domains = response.data;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  findDomains() {
    return this.domains;
  }

  @action
  async fetchStatuses() {
    try {
      const response = await axios.get<Status[]>(`${environments.REACT_APP_PROXY}/api/statuses`);

      runInAction(() => {
        const statuses = response.data;
        const defaultStatus: Status = {
          id: null,
          name: StatusName.NOT_SELECTED,
          description: StatusName.NOT_SELECTED,
          hexColor: '',
          createdAt: '',
          updatedAt: '',
        };

        statuses.unshift(defaultStatus);

        this.statuses = statuses;
      });

      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  async fetchCrmStatuses() {
    try {
      const response = await axios.get<CrmStatus[]>(`${environments.REACT_APP_PROXY}/api/crm-statuses`);

      runInAction(() => {
        this.crmStatuses = response.data;
      });

      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  findStatuses() {
    return this.statuses;
  }

  @action
  findCrmStatuses() {
    return this.crmStatuses;
  }

  @action
  findStatusByUserId(statusId: string | null): Status | undefined {
    return this.statuses.find((status) => status.id === statusId);
  }
}
