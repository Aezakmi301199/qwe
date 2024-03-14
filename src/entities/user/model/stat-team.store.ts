import { action, computed, makeAutoObservable, observable, runInAction } from 'mobx';
import { WorkAddressUserDto } from '../../../shared/dto/work-address-user-dto';
import { PageLimit } from '../../../shared/enums/pagination.enum';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { WorkAddressManagerDto } from '../../../shared/dto/work-address-manager-dto';
import { handleAxiosError } from '../../../shared/lib/handle-axios-error';
import { AutoCompleteOptionDto } from '../../../shared/types/auto-complete-option';
import { match } from 'ts-pattern';
import { AxiosErrorData } from '../../../shared/types/axios-response-error-data';
import { HttpStatusCode } from '../../../shared/enums/http-status-code';
import qs from 'qs';
import { filterFieldFromObject } from '../../../shared/lib/remove-empty-field-from-object';
import { UserStatisticOrder } from '../../../shared/enums/user-statistic-order.enum';
import { SortOrder } from '../../../shared/enums/type-order-by';
import { capitalizeString } from '../../../shared/lib/string/capitalize-string';
import { WorkAddressUserCountDto } from '../../../shared/dto/work-address-user-count-dto';
import { PageNumber } from '../../../shared/enums/page-number';

export interface IStatTeamStore {
  orderBy: string;
  loadingManagers: boolean;
  loadingUserCount: boolean;
  users: WorkAddressUserDto[];
  userCount: number;
  loadingUsers: boolean;
  userPage: number;
  rowsPerPage: PageLimit;
  managers: WorkAddressManagerDto[];
  managerPage: number;
  searchManagerQuery: string;
  searchUserQuery: string;
  selectedManagerId: string;
  setCommonOrderBy(shortOrderBy: string, sortOrder: SortOrder): void;
  setUserPage(page: number): void;
  setRowsPerPage(page: PageLimit): void;
  setSearchManagerQuery(query: string): void;
  setSearchUserQuery(query: string): void;
  setManagerPage(page: number): void;
  setSelectedManagerId(id: string): void;
  findUsers(): WorkAddressUserDto[];
  findUserById(id: string): WorkAddressUserDto | undefined;
  findAutoCompleteOptionManagers(): AutoCompleteOptionDto[];
  findAutoCompleteOptionByManagerId(managerId: string): AutoCompleteOptionDto | undefined;
  summaryFetchManagers(address: number): Promise<void>;
  fetchUserCountData(workAddressId: number): Promise<void>;
  fetchUsers(workAddressId: number): Promise<void>;
  fetchManagers(workAddressId: number): Promise<void>;
}

export class StatTeamStore {
  @observable orderBy: string = UserStatisticOrder.COMMISSION_DESC;
  @observable users: WorkAddressUserDto[] = [];
  @observable userPage: number = PageNumber.FIRST;
  @observable loadingUsers: boolean = true;
  @observable rowsPerPage: PageLimit = PageLimit.FIFTEEN;
  @observable managers: WorkAddressManagerDto[] = [];
  @observable loadingManagers: boolean = true;
  @observable managerPage: number = PageNumber.FIRST;
  @observable searchManagerQuery: string = '';
  @observable searchUserQuery: string = '';
  @observable selectedManagerId: string = '';
  @observable userCount: number = 0;
  @observable loadingUserCount: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  fetchUserCountData = async (workAddressId: number) => {
    this.loadingUserCount = true;

    const query = qs.stringify(
      filterFieldFromObject({
        object: {
          id: workAddressId,
          fullName: this.searchUserQuery,
          managerId: this.selectedManagerId,
        },
        isFilterEmptyString: true,
        isEmptyArray: true,
        isFilterNull: true,
      }),
    );

    const response = await axios
      .get(`/api/work-address/${workAddressId}/users/count?${query}`)
      .then((response: AxiosResponse<WorkAddressUserCountDto>) => response)
      .catch((axiosError: AxiosError<AxiosErrorData>) => axiosError.response);

    match(response)
      .with({ status: HttpStatusCode.SUCCESS }, (response: AxiosResponse<WorkAddressUserCountDto>) => {
        runInAction(() => {
          this.userCount = response.data.count;
          this.loadingUserCount = false;
        });
      })
      .with({ status: HttpStatusCode.BAD_REQUEST }, (response: AxiosResponse<AxiosErrorData>) => {
        handleAxiosError(response.data.error);
        this.loadingUserCount = false;
      })
      .otherwise(() => {
        this.loadingUserCount = false;
      });
  };

  @action
  fetchUsers = async (workAddressId: number) => {
    this.loadingUsers = true;

    const query = qs.stringify(
      filterFieldFromObject({
        object: {
          id: workAddressId,
          fullName: this.searchUserQuery,
          managerId: this.selectedManagerId,
          page: this.userPage,
          orderBy: this.orderBy,
        },
        isFilterEmptyString: true,
        isEmptyArray: true,
        isFilterNull: true,
      }),
    );

    const response = await axios
      .get(`/api/work-address/${workAddressId}/users?${query}`)
      .then((response: AxiosResponse<WorkAddressUserDto[]>) => response)
      .catch((axiosError: AxiosError<AxiosErrorData>) => axiosError.response);

    match(response)
      .with({ status: HttpStatusCode.SUCCESS }, (response: AxiosResponse<WorkAddressUserDto[]>) => {
        runInAction(() => {
          this.users = response.data;
          this.loadingUsers = false;
        });
      })
      .with({ status: HttpStatusCode.BAD_REQUEST }, (response: AxiosResponse<AxiosErrorData>) => {
        handleAxiosError(response.data.error);
        this.loadingUsers = false;
      })
      .otherwise(() => {
        this.loadingUsers = false;
      });
  };

  @action
  summaryFetchManagers = async (workAddressId: number) => {
    const query = qs.stringify(
      filterFieldFromObject({
        object: {
          page: this.managerPage,
          fullName: this.searchManagerQuery,
        },
        isFilterEmptyString: true,
        isEmptyArray: true,
        isFilterNull: true,
      }),
    );

    const response = await axios
      .get(`/api/work-address/${workAddressId}/managers?${query}`)
      .then((response: AxiosResponse<WorkAddressManagerDto[]>) => response)
      .catch((axiosError: AxiosError<AxiosErrorData>) => axiosError.response);

    match(response)
      .with({ status: HttpStatusCode.SUCCESS }, (response: AxiosResponse<WorkAddressManagerDto[]>) => {
        runInAction(() => {
          this.managers = [...this.managers, ...response.data];
          this.loadingUsers = false;
        });
      })
      .with({ status: HttpStatusCode.BAD_REQUEST }, (response: AxiosResponse<AxiosErrorData>) => {
        handleAxiosError(response.data.error);
        this.loadingUsers = false;
      })
      .otherwise(() => {
        this.loadingUsers = false;
      });
  };

  @action
  setSearchUserQuery(userName: string) {
    this.searchUserQuery = userName;
  }

  @action
  setSelectedManagerId(selectedManagerId: string) {
    this.selectedManagerId = selectedManagerId;
  }

  @action
  setManagerPage(page: number) {
    this.managerPage = page;
  }

  @action
  setSearchManagerQuery(query: string) {
    this.searchManagerQuery = query;
  }

  @computed
  findAutoCompleteOptionByManagerId(managerId: string) {
    return this.findAutoCompleteOptionManagers().find((manager: AutoCompleteOptionDto) => manager.id === managerId);
  }

  @action
  findAutoCompleteOptionManagers = (): AutoCompleteOptionDto[] => {
    return this.managers.map((manager: WorkAddressManagerDto) => {
      return {
        label: manager.fullName,
        id: manager.id,
      };
    });
  };

  @action
  findUsers(): WorkAddressUserDto[] {
    return this.users;
  }

  @action
  setUserPage(page: number) {
    this.userPage = page;
  }

  @action
  setRowsPerPage(rowsPerPage: PageLimit) {
    this.rowsPerPage = rowsPerPage;
  }

  @action
  findUserById(id: string): WorkAddressUserDto | undefined {
    return this.users.find((user) => user.id === id);
  }

  @action
  fetchManagers = async (workAddressId: number) => {
    const query = qs.stringify(
      filterFieldFromObject({
        object: {
          page: this.managerPage,
          fullName: this.searchManagerQuery,
        },
        isFilterEmptyString: true,
        isEmptyArray: true,
        isFilterNull: true,
      }),
    );

    const response = await axios
      .get(`/api/work-address/${workAddressId}/managers?${query}`)
      .then((response: AxiosResponse<WorkAddressManagerDto[]>) => response)
      .catch((axiosError: AxiosError<AxiosErrorData>) => axiosError.response);

    match(response)
      .with({ status: HttpStatusCode.SUCCESS }, (response: AxiosResponse<WorkAddressManagerDto[]>) => {
        runInAction(() => {
          this.managers = response.data;
          this.loadingManagers = false;
        });
      })
      .with({ status: HttpStatusCode.BAD_REQUEST }, (response: AxiosResponse<AxiosErrorData>) => {
        handleAxiosError(response.data.error);
        this.loadingManagers = false;
      })
      .otherwise(() => {
        this.loadingManagers = false;
      });
  };

  @action
  setCommonOrderBy(shortOrderBy: string, sortOrder: SortOrder) {
    const orderBy = `${shortOrderBy}${capitalizeString(sortOrder)}` as UserStatisticOrder;

    this.orderBy = orderBy;
  }
}
