import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { handleAxiosError } from '../../../shared/lib/handle-axios-error';
import axios, { AxiosError } from 'axios';
import { environments } from '../../../environment';
import { stringify } from 'qs';
import { InitialState, PageLimit } from '../../../shared/enums/pagination.enum';
import { PaymentStatus } from '../../../shared/enums/payment-status.enum';

export type Payment = {
  id: string;
  userId: string;
  subscriptionPlanId: string;
  bankTransactionId: string;
  paymentUrl: string;
  status: PaymentStatus;
  amount: number;
  createdAt: string;
  updatedAt: string;
  subscriptionPlan: {
    name: string;
  };
};

export class PaymentStore {
  @observable paymentInfo: Payment[] = [];
  @observable paymentCount: number = InitialState.ZERO;
  @observable rowsPerPage: PageLimit = PageLimit.FIFTY;
  page: number = InitialState.FIRST;
  constructor() {
    makeAutoObservable(this);
  }

  @action
  async fetchPaymentInfo(userId: string) {
    try {
      const query = stringify({
        page: this.page,
      });
      const response = await axios.get<Payment[]>(
        `${environments.REACT_APP_PROXY}/api/users/${userId}/payments?${query}`,
      );

      runInAction(() => {
        this.paymentInfo = response.data;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  async fetchPaymentById(paymentId: string) {
    try {
      const paymentLink = await axios.get<{
        id: string;
        paymentUrl: string;
        createdAt: string;
        subscriptionPlanId: string;
        status: string;
      }>(`${environments.REACT_APP_PROXY}/api/user-payment/${paymentId}`);

      if (paymentLink.data.status !== 'WAITING') {
        throw new AxiosError();
      }

      return paymentLink.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }

  @action
  async fetchPaymentLink(id: string, userId: string) {
    try {
      const paymentLink = await axios.post<{ id: string; paymentUrl: string; createdAt: string }>(
        `${environments.REACT_APP_PROXY}/api/users/${userId}/subscription-plan`,
        { subscriptionPlanId: id },
      );

      return paymentLink.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }

  @action
  async fetchPaymentCount(userId: string) {
    try {
      const response = await axios.get(`${environments.REACT_APP_PROXY}/api/users/${userId}/payments/count`);

      runInAction(() => {
        this.paymentCount = response.data.count;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  setPage(page: number) {
    this.page = page;
  }

  @action
  setRowsPerPage(rowsPerPage: PageLimit) {
    this.rowsPerPage = rowsPerPage;
  }
}
