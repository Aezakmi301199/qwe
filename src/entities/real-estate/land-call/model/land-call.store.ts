import { CallStore } from '../../../../shared/lib/call-store';
import { CallDataLand } from '../../flat-call/model/type';
import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { InitialState } from '../../../../shared/enums/pagination.enum';
import axios from 'axios';
import { handleAxiosError } from '../../../../shared/lib/handle-axios-error';
import { environments } from '../../../../environment';

export class LandCallStore implements CallStore<CallDataLand> {
  @observable realEstateCalls: CallDataLand[] = [];
  @observable page: number = InitialState.FIRST;
  @observable realEstateCallsCount: number = InitialState.ZERO;
  constructor() {
    makeAutoObservable(this);
  }

  @action
  async fetchCalls(userId: string) {
    try {
      const landCalls = await axios.get(
        `${environments.REACT_APP_PROXY}/api/users/${userId}/land-calls?page=${this.page}`,
      );

      runInAction(() => {
        this.realEstateCalls = landCalls.data;
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
      const landCallsCount = await axios.get(`${environments.REACT_APP_PROXY}/api/users/${userId}/land-calls/count`);

      runInAction(() => {
        this.realEstateCallsCount = landCallsCount.data.count;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }
}
