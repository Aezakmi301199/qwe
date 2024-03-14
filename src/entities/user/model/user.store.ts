import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { RealEstateFilters, User, UserStat, UserStatDto } from './type';
import axios from 'axios';
import { filterFieldFromObject } from '../../../shared/lib/remove-empty-field-from-object';
import { spyObjectByFieldValue } from '../../../shared/lib/spy-object-by-field-value';
import { HttpStatusCode } from '../../../shared/enums/http-status-code';
import { RealEstateTypeUpperCase } from '../../../shared/enums/real-estate-type-upper-case.enum';
import { FlatFilterType } from '../../real-estate/flat';
import { HouseFilterType } from '../../real-estate/house';
import { LandFilterType } from '../../real-estate/land';
import { handleAxiosError } from '../../../shared/lib/handle-axios-error';
import { PagePath } from '../../../shared/enums/page-path';
import { DateTime } from 'luxon';
import { SubscriptionPlan } from '../../../shared/types/subscription-plan';
import { TimeConvert } from '../../../shared/enums/time-convert.enum';
import { environments } from '../../../environment';
import { InitialState } from '../../../shared/enums/pagination.enum';

export class UserStore {
  statAction: UserStat = {} as UserStat;
  loadingStat: boolean = true;
  subscriptionPlans: SubscriptionPlan[] = [];
  userFilters: RealEstateFilters<FlatFilterType | HouseFilterType | LandFilterType>[] = [];
  @observable
  activeUserFiltersCount: number = InitialState.ZERO;

  @observable
  isUserFilterLoading: boolean = true;

  isFilterRecentlyAdded: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  logout() {
    axios
      .post(`${environments.REACT_APP_PROXY}/api/users/logout`)
      .then(() => {
        window.location.href = PagePath.LOGIN;
        localStorage.clear();
      })
      .catch((error) => {
        handleAxiosError(error);
      });
  }

  @action
  setLoadingStat(loadingStatus: boolean) {
    this.loadingStat = loadingStatus;
  }

  @action
  async fetchStat(userId: string) {
    this.setLoadingStat(true);

    try {
      const userStat: UserStatDto = await axios
        .get(`${environments.REACT_APP_PROXY}/api/users/${userId}/statistics`)
        .then((response) => {
          return response.data;
        });

      runInAction(() => {
        this.statAction = userStat;
      });
    } catch (error) {
      handleAxiosError(error);
    }

    this.setLoadingStat(false);
  }

  @action
  findUserStat() {
    return this.statAction;
  }

  async saveFilter({
    filter,
    name,
    realEstateType,
  }: {
    filter: FlatFilterType | HouseFilterType | LandFilterType;
    name: string;
    realEstateType: RealEstateTypeUpperCase;
  }): Promise<HttpStatusCode> {
    const filteredObjectFilter = spyObjectByFieldValue({
      object: filterFieldFromObject({
        object: {
          ...filter,
          name,
          realEstateType,
        },
        isFilterEmptyString: true,
        isEmptyArray: true,
        isFilterNull: true,
      }),
      exceptionTransformField: ['address', 'name'],
    });

    return await axios
      .post(`${environments.REACT_APP_PROXY}/api/user-filters`, {
        ...filteredObjectFilter,
        isNotificationEnabled: false,
      })
      .then((res) => {
        this.isFilterRecentlyAdded = true;

        return res.status;
      })
      .catch((err) => err.response.status);
  }

  @action
  async updateFilter({
    filter,
    name,
    realEstateType,
    isNotificationEnabled,
  }: {
    filter: RealEstateFilters<FlatFilterType | HouseFilterType | LandFilterType>;
    name: string;
    realEstateType: RealEstateTypeUpperCase;
    isNotificationEnabled: boolean;
  }): Promise<HttpStatusCode> {
    const filteredObjectFilter = spyObjectByFieldValue({
      object: filterFieldFromObject({
        object: {
          ...filter.params,
          name,
          realEstateType,
        },
        isFilterEmptyString: false,
        isEmptyArray: false,
        isFilterNull: false,
      }),
      exceptionTransformField: ['address', 'name'],
    });

    return await axios
      .put(`${environments.REACT_APP_PROXY}/api/user-filters/${filter.id}`, {
        ...filteredObjectFilter,
        isNotificationEnabled: isNotificationEnabled,
      })
      .then((res) => {
        runInAction(() => {
          const updatedFilter = this.userFilters.find((updatedFilter) => updatedFilter.id === filter.id);

          if (isNotificationEnabled) {
            this.activeUserFiltersCount++;

            return;
          }

          if (updatedFilter?.isNotificationEnabled) {
            this.activeUserFiltersCount--;
          }
        });

        return res.status;
      })
      .catch((err) => err.response.status);
  }

  isSubscriptionPlanExpiring(user: User) {
    const calculateSubscriptionPlanDaysLeft = (expirationDate: string | null) => {
      if (!expirationDate) {
        return null;
      }

      const daysLeft = DateTime.fromISO(expirationDate).diff(DateTime.now(), ['days']).toObject().days;

      if (!daysLeft) {
        return null;
      }

      return Math.ceil(daysLeft);
    };
    const fiveDays = 5;
    const oneDay = 1;
    const subscriptionPlanDaysLeft = calculateSubscriptionPlanDaysLeft(user.subscriptionPlanExpiresAt);
    const isSubscriptionPlanExpiring = Boolean(subscriptionPlanDaysLeft && subscriptionPlanDaysLeft <= fiveDays);
    const isLastDay = Boolean(subscriptionPlanDaysLeft && subscriptionPlanDaysLeft <= oneDay);

    return {
      isSubscriptionPlanExpiring,
      isLastDay,
      subscriptionPlanDaysLeft,
    };
  }

  @action
  async fetchSubscriptionPlan() {
    try {
      const subscriptionPlans = await axios.get<SubscriptionPlan[]>(
        `${environments.REACT_APP_PROXY}/api/subscription-plan`,
      );

      runInAction(() => {
        const yearRate = subscriptionPlans.data.find(
          (rate) => !rate.isDefault && rate.durationMonths === TimeConvert.MONTHS_IN_ONE_YEAR,
        );

        if (yearRate && yearRate.priceWithoutDiscount) {
          const oneHundredPercent = 100;
          const discountForYearRate =
            oneHundredPercent - Math.ceil((yearRate.price * oneHundredPercent) / yearRate.priceWithoutDiscount);
          const generateDiscountString = (percentage: number) => `Выгода ${percentage}%`;

          yearRate.features.unshift({ description: generateDiscountString(discountForYearRate) });
        }

        this.subscriptionPlans = subscriptionPlans.data;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action findSubscriptionPlanById(id: string) {
    return this.subscriptionPlans.find((plan) => plan.id === id);
  }

  @action
  deleteFilter = async (filterId: string) => {
    try {
      await axios.delete(`${environments.REACT_APP_PROXY}/api/user-filters/${filterId}`);

      runInAction(() => {
        const deletedFilter = this.userFilters.find((filter) => filter.id === filterId);

        if (deletedFilter && deletedFilter.isNotificationEnabled) {
          this.activeUserFiltersCount--;
        }

        this.userFilters = this.userFilters.filter((filter) => filter.id !== filterId);
      });
    } catch (error) {
      handleAxiosError(error);
    }
  };

  @action
  fetchRealEstateFilterData = async (realEstateType: RealEstateTypeUpperCase) => {
    try {
      this.isUserFilterLoading = true;

      const response = await axios.get(
        `${environments.REACT_APP_PROXY}/api/user-filters?realEstateType=${realEstateType}`,
      );

      runInAction(() => {
        this.userFilters = response.data;
        this.isUserFilterLoading = false;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  };

  @action
  fetchActiveFiltersCount = async () => {
    try {
      const response = await axios.get<{ count: number }>(
        `${environments.REACT_APP_PROXY}/api/user-filters/active-count`,
      );

      runInAction(() => {
        this.activeUserFiltersCount = response.data.count;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  };
}
