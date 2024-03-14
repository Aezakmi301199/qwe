import { CallStore } from '../../../../shared/lib/call-store';
import { CallDataHouse } from '../../flat-call/model/type';
import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { InitialState } from '../../../../shared/enums/pagination.enum';
import axios from 'axios';
import { handleAxiosError } from '../../../../shared/lib/handle-axios-error';
import { environments } from '../../../../environment';

export class HouseCallStore implements CallStore<CallDataHouse> {
  @observable realEstateCalls: CallDataHouse[] = [];
  @observable page: number = InitialState.FIRST;
  @observable realEstateCallsCount: number = InitialState.ZERO;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  async fetchCalls(userId: string) {
    try {
      const houseCalls = await axios.get(
        `${environments.REACT_APP_PROXY}/api/users/${userId}/house-calls?page=${this.page}`,
      );

      runInAction(() => {
        this.realEstateCalls = houseCalls.data;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  setPage(page: number) {
    this.page = page;
  }

  async fetchCallsCount(userId: string) {
    try {
      const houseCallsCount = await axios.get(`${environments.REACT_APP_PROXY}/api/users/${userId}/house-calls/count`);

      runInAction(() => {
        this.realEstateCallsCount = houseCallsCount.data.count;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }
}
