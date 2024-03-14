import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { InitialState } from '../../../../shared/enums/pagination.enum';
import axios from 'axios';
import { handleAxiosError } from '../../../../shared/lib/handle-axios-error';
import { CallStore } from '../../../../shared/lib/call-store';
import { CallDataFlat } from './type';
import { environments } from '../../../../environment';

export class FlatCallStore implements CallStore<CallDataFlat> {
  @observable realEstateCalls: CallDataFlat[] = [];
  @observable page: number = InitialState.FIRST;
  @observable realEstateCallsCount: number = InitialState.ZERO;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchCallsCount(userId: string) {
    try {
      const flatCallsCount = await axios.get(`${environments.REACT_APP_PROXY}/api/users/${userId}/flat-calls/count`);

      runInAction(() => {
        this.realEstateCallsCount = flatCallsCount.data.count;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  async fetchCalls(userId: string) {
    try {
      const flatCalls = await axios.get(
        `${environments.REACT_APP_PROXY}/api/users/${userId}/flat-calls?page=${this.page}`,
      );

      runInAction(() => {
        this.realEstateCalls = flatCalls.data;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  setPage(page: number) {
    this.page = page;
  }
}
