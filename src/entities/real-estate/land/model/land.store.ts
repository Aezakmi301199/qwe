import { Store } from '../../../../shared/lib/store';
import { User } from '../../../user';
import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { Comment } from '../../../comment';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { socket } from '../../../../socket';
import { WsEvent } from '../../../../shared/enums/ws-event';
import { RealEstateTypeUpperCase } from '../../../../shared/enums/real-estate-type-upper-case.enum';
import { Land, LandClusterType } from './type';
import { LandFilters, LandFilterType } from './use-land-filters';
import { filterFieldFromObject } from '../../../../shared/lib/remove-empty-field-from-object';
import { spyObjectByFieldValue } from '../../../../shared/lib/spy-object-by-field-value';
import { InitialState, PageLimit } from '../../../../shared/enums/pagination.enum';
import { handleAxiosError } from '../../../../shared/lib/handle-axios-error';
import qs from 'qs';
import { DealType } from '../../../../shared/enums/deal-type.enum';
import { Author } from '../../../../shared/enums/author.enum';
import { TypeOrderBy } from '../../../../shared/enums/type-order-by';
import { ExtremeCoordinatesLatLng } from '../../../../shared/types/geo/point';
import { ClusterByRealEstateDto } from '../../../../shared/dto/cluster-by-real-estate-dto';
import {
  limitGeoParamsRealEstateClusters,
  limitGeoParamZoomApi,
} from '../../../../shared/lib/geo/limit-geo-search-params';
import { GeoJsonGeometryType } from '../../../../shared/types/geo/geo-json-geometry-type';
import { DateTime } from 'luxon';
import { TimeConvert } from '../../../../shared/enums/time-convert.enum';
import { environments } from '../../../../environment';
import { match, P } from 'ts-pattern';
import { HttpStatusCode } from '../../../../shared/enums/http-status-code';
import { RealEstateCountDto } from '../../../../shared/dto/real-estate-count-dto';
import { AxiosErrorData } from '../../../../shared/types/axios-response-error-data';
import { RealEstateErrorDataMessage } from '../../../../shared/enums/realEstate-error-data-message';
import { debounce } from 'lodash';
import { modifyPostBodyForRequest } from '../../../../shared/lib/modify-post-body-for-request';
import { CatalogStore } from '../../../domain/catalog.store';

export class LandStore implements Store<Land> {
  @observable realEstate: Land[] = [];
  @observable comments: Comment[] = [];
  @observable count: number = 0;
  currentFilter: LandFilterType | null = null;
  loading = true;
  loadingPhone = false;
  @observable page: InitialState = InitialState.FIRST;
  @observable rowsPerPage: PageLimit = PageLimit.FIFTY;
  loadingCount = true;
  @observable currentCommentPage: number = InitialState.FIRST;
  @observable clusters: ClusterByRealEstateDto[] = [];
  @observable isErrorData = true;
  @observable isChangingFilter: boolean = true;
  @observable isConnectedDomains: boolean = false;
  cancelTokenSource = axios.CancelToken.source();

  constructor(private readonly catalogStore: CatalogStore) {
    makeAutoObservable(this);
  }

  @action
  resetStore() {
    this.realEstate = [];
    this.comments = [];
    this.count = 0;
    this.currentFilter = null;
    this.page = InitialState.FIRST;
    this.loading = true;
    this.loadingPhone = false;
    this.loading = true;
    this.currentCommentPage = InitialState.FIRST;
    this.isErrorData = true;
    this.isChangingFilter = true;
  }

  @action
  setChangingFilter(isChangingFilter: boolean) {
    this.isChangingFilter = isChangingFilter;
  }

  @action
  async fetchDataClusters(zoom: number, coordinates: ExtremeCoordinatesLatLng, geometry?: GeoJsonGeometryType) {
    if (!this.currentFilter) {
      return;
    }

    try {
      const modifiedFilter = modifyPostBodyForRequest(this.currentFilter, this.catalogStore.findStatuses().length);
      const filteredObjectClusterFilter = spyObjectByFieldValue({
        object: filterFieldFromObject({
          object: modifiedFilter,
          isFilterEmptyString: true,
          isEmptyArray: true,
          isFilterNull: true,
        }),
        exceptionTransformField: [LandFilters.ADDRESS],
      });

      const clusterFilter = {
        ...filteredObjectClusterFilter,
        ...coordinates,
        zoom: limitGeoParamZoomApi(zoom),
      } as LandClusterType;

      const dataLands: ClusterByRealEstateDto[] = await axios
        .post(`${environments.REACT_APP_PROXY}/api/lands/clusters`, limitGeoParamsRealEstateClusters(clusterFilter))
        .then((response) => response.data);

      runInAction(() => {
        this.clusters = dataLands;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  setLoadingRealEstate(loadingState: boolean) {
    this.loading = loadingState;
  }

  @action
  clearComments() {
    this.comments = [];
  }

  @action
  setLoadingCount(loadingState: boolean) {
    this.loadingCount = loadingState;
  }

  @action
  setPage(page: InitialState) {
    this.page = page;
  }

  @action
  setRowsPerPage(rowsPerPage: PageLimit) {
    this.rowsPerPage = rowsPerPage;
  }

  @action
  setCurrentFilter(objectFilter: LandFilterType) {
    runInAction(() => {
      this.currentFilter = objectFilter;
    });
  }

  @action
  changeValueByCurrentFilter<T extends keyof LandFilterType>(fieldName: T, value: LandFilterType[T]) {
    if (!this.currentFilter) {
      return;
    }

    this.currentFilter[fieldName] = value;
  }

  @action
  removeFieldByFilter<T extends keyof LandFilterType>(fieldName: T) {
    if (!this.currentFilter) {
      return;
    }

    delete this.currentFilter[fieldName];
  }

  async addToFavourites(realEstateId: string) {
    try {
      await axios.post(`${environments.REACT_APP_PROXY}/api/lands/${realEstateId}/favourites`).then(() => {
        const land = this.findById(realEstateId);

        if (!land) {
          return;
        }

        land.isFavourite = true;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  async fetchFavourite(user: User, domain: string[], orderBy: TypeOrderBy) {
    this.loading = true;
    this.isErrorData = true;

    try {
      const dataLands: Land[] = await axios
        .get(`${environments.REACT_APP_PROXY}/api/users/${user.id}/favourite-lands`, {
          params: {
            page: this.page,
            limit: this.rowsPerPage,
            'city[]': user.workAddress.cityId,
            'domain[]': domain,
            canSeePartMatches: false,
            dealType: DealType.SALE,
            author: Author.OWNER,
            canSeeHidden: false,
            orderBy: orderBy,
          },
          paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
        })
        .then((res) => {
          return res.data.map((land: Record<string, any>) => {
            return { ...land, isFavourite: Boolean(land.usersFavourites.length) };
          });
        });

      runInAction(() => {
        this.realEstate = dataLands;
        this.loading = false;
        this.isErrorData = false;
      });
    } catch (error) {
      this.isErrorData = true;
      handleAxiosError(error);
    }

    this.loading = false;
    this.isErrorData = false;
  }

  @action
  async fetchFavoriteCount(userId: string) {
    try {
      axios.get(`${environments.REACT_APP_PROXY}/api/users/${userId}/favourite-lands/count`).then((response) => {
        runInAction(() => {
          this.count = response.data.count;
        });
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  async changeFavourite(realEstateId: string) {
    const land = this.findById(realEstateId);

    if (!land) {
      return;
    }

    if (land.isFavourite) {
      await this.removeFromFavourites(realEstateId);
    } else {
      await this.addToFavourites(realEstateId);
    }
  }

  @action
  removeById(realEstateId: string) {
    this.realEstate = this.realEstate.filter((land) => land.id !== realEstateId);
  }

  @action
  findById(realEstateId: string) {
    return this.realEstate.find((land) => land.id === realEstateId);
  }

  async fetchByIdFromApi(realEstateId: string) {
    try {
      const res = await axios.get<Land>(`${environments.REACT_APP_PROXY}/api/lands/${realEstateId}`);

      runInAction(() => {
        this.realEstate = [res.data];
      });
    } catch {
      return undefined;
    }
  }

  @action
  async fetchData(startTime?: DateTime, geometry?: GeoJsonGeometryType, zoom?: number) {
    if (!this.currentFilter) {
      return;
    }

    this.setLoadingRealEstate(true);

    const modifiedFilter = modifyPostBodyForRequest(this.currentFilter, this.catalogStore.findStatuses().length);
    const filteredObjectFilter = spyObjectByFieldValue({
      object: filterFieldFromObject({
        object: modifiedFilter,
        isFilterEmptyString: true,
        isEmptyArray: true,
        isFilterNull: true,
      }),
      exceptionTransformField: [LandFilters.ADDRESS],
    });

    this.cancelTokenSource.cancel();
    this.cancelTokenSource = axios.CancelToken.source();

    const response = await axios
      .post(
        `${environments.REACT_APP_PROXY}/api/lands`,
        {
          page: this.page,
          limit: this.rowsPerPage,
          ...filteredObjectFilter,
          geometry,
          zoom: limitGeoParamZoomApi(zoom),
        },
        {
          cancelToken: this.cancelTokenSource.token,
        },
      )
      .then((response: AxiosResponse<Land[]>) => response)
      .catch((axiosError: AxiosError<AxiosErrorData>) => axiosError.response);

    match(response)
      .with({ status: HttpStatusCode.SUCCESS }, (response: AxiosResponse<Land[]>) => {
        runInAction(() => {
          this.realEstate = response.data.map((res) => {
            res.isFavourite = !!res.usersFavourites.length;

            return res;
          });
          this.isConnectedDomains = true;

          if (startTime) {
            const debounceChangeLoading = debounce(() => {
              this.setLoadingRealEstate(false);
            }, TimeConvert.MILLISECONDS_IN_SECOND);

            debounceChangeLoading();

            return;
          }

          this.setLoadingRealEstate(false);
        });
      })
      .with({ status: HttpStatusCode.BAD_REQUEST }, (response: AxiosResponse<AxiosErrorData>) => {
        match(response.data.message)
          .with(
            P.when((message) => message.includes(RealEstateErrorDataMessage.DOMAIN_MUST_BE_ARRAY)),
            () => {
              this.isConnectedDomains = false;
              this.setLoadingRealEstate(false);
            },
          )
          .otherwise(() => {
            this.setLoadingRealEstate(false);
          });
      })
      .otherwise(() => {
        this.setLoadingRealEstate(false);
      });
  }

  @action
  async summaryFetchData(page: number, zoom: number, geometry?: GeoJsonGeometryType) {
    if (!this.currentFilter) {
      return false;
    }

    try {
      const modifiedFilter = modifyPostBodyForRequest(this.currentFilter, this.catalogStore.findStatuses().length);
      const filteredObjectFilter = spyObjectByFieldValue({
        object: filterFieldFromObject({
          object: modifiedFilter,
          isFilterEmptyString: true,
          isEmptyArray: true,
          isFilterNull: true,
        }),
        exceptionTransformField: [LandFilters.ADDRESS],
      });
      const dataLands: Land[] = await axios
        .post(`${environments.REACT_APP_PROXY}/api/lands`, {
          page: page,
          limit: this.rowsPerPage,
          ...filteredObjectFilter,
          geometry,
          zoom: limitGeoParamZoomApi(zoom),
        })
        .then((response) => response.data);

      runInAction(() => {
        this.realEstate = [...this.realEstate, ...dataLands];
      });

      return !!dataLands.length;
    } catch (error) {
      handleAxiosError(error);
    }

    return false;
  }

  @action
  async fetchCount(objectFilter: LandFilterType) {
    this.setLoadingCount(true);

    const modifiedFilter = modifyPostBodyForRequest(objectFilter, this.catalogStore.findStatuses().length);
    const filteredObjectFilter = spyObjectByFieldValue({
      object: filterFieldFromObject({
        object: modifiedFilter,
        isFilterEmptyString: true,
        isEmptyArray: true,
        isFilterNull: true,
      }),
      exceptionTransformField: [LandFilters.ADDRESS],
    });

    const response = await axios
      .post(`${environments.REACT_APP_PROXY}/api/lands/count`, {
        ...filteredObjectFilter,
      })
      .then((response: AxiosResponse<RealEstateCountDto>) => response)
      .catch((axiosError: AxiosError<AxiosErrorData>) => axiosError.response);

    match(response)
      .with({ status: HttpStatusCode.SUCCESS }, (response: AxiosResponse<RealEstateCountDto>) => {
        runInAction(() => {
          this.count = response.data.count;
          this.setLoadingCount(false);
        });
      })
      .with({ status: HttpStatusCode.BAD_REQUEST }, () => {
        this.count = 0;
        this.isConnectedDomains = false;
      })
      .otherwise(() => {
        this.setLoadingRealEstate(false);
      });
  }

  @action
  async fetchComments(realEstateId: string, page: number, commentCount: number) {
    try {
      const pageCount: number = Math.ceil(commentCount / PageLimit.FIFTEEN);

      if (pageCount <= InitialState.FIRST) {
        this.clearComments();
      }

      const hasNextPage: boolean = page <= pageCount;

      if (!hasNextPage) {
        return;
      }

      const comments: Comment[] = await axios
        .get(`${environments.REACT_APP_PROXY}/api/lands/${realEstateId}/comments?page=${page}`)
        .then((response) => {
          return response.data.reverse();
        });

      runInAction(() => {
        this.comments = [...comments, ...this.comments];
        this.currentCommentPage++;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  addComment(comment: Comment): void {
    this.comments.push(comment);
  }

  cancelReservationForCall(realEstateId: string): void {
    const land = this.findById(realEstateId);

    if (!land) {
      return;
    }

    land.callingUser = null;
  }

  changeStatus(realEstateId: string, statusId: string | null, userId: string): void {
    const land = this.findById(realEstateId);

    if (!land) {
      return;
    }

    if (statusId) {
      land.userStatus = {
        userId: userId,
        statusId: statusId,
      };

      return;
    }

    land.userStatus = null;
  }

  findPhoneById(realEstateId: string): void {
    const land = this.findById(realEstateId);

    if (!land) {
      return;
    }

    socket.emit(WsEvent.GET_PHONE, {
      id: realEstateId,
      realEstateType: RealEstateTypeUpperCase.LAND,
    });
    this.loadingPhone = true;
  }

  handleDisconnect(userId: string): void {
    this.realEstate.forEach((land) => {
      if (land.callingUser?.id === userId) {
        land.callingUser = null;
      }
    });
  }

  incrementCommentCount(realEstateId: string): void {
    const land = this.findById(realEstateId);

    if (!land) {
      return;
    }

    land._count.comments++;
  }

  reserveForCall(params: { realEstateId: string; userId: string; avatarUrl: string; fullName: string }): void {
    const land = this.findById(params.realEstateId);

    if (!land) {
      return;
    }

    land.callingUser = {
      id: params.userId,
      fullName: params.fullName,
      avatarUrl: params.avatarUrl,
    };
  }

  setNewPhone(realEstateId: string, phone: string): void {
    const land = this.findById(realEstateId);

    if (!land) {
      return;
    }

    land.phone = phone;
    this.loadingPhone = false;
  }

  @action
  changeStatusEmit(realEstateId: string, userStatusId: string | null) {
    socket.emit(WsEvent.CHANGE_STATUS, {
      id: realEstateId,
      realEstateType: RealEstateTypeUpperCase.LAND,
      statusId: userStatusId,
    });
  }

  @action
  callEndedEmit(realEstateId: string) {
    socket.emit(WsEvent.CALL_ENDED, {
      id: realEstateId,
      realEstateType: RealEstateTypeUpperCase.LAND,
    });
  }

  @action
  makeCallEmit(realEstateId: string) {
    socket.emit(WsEvent.MAKE_CALL, { id: realEstateId, realEstateType: RealEstateTypeUpperCase.LAND });
  }

  @action
  addDuplicateEmit(realEstateId: string, crmId: string) {
    socket.emit(WsEvent.ADD_DUPLICATE, {
      realEstateId: realEstateId,
      realEstateType: RealEstateTypeUpperCase.LAND,
      crmRealEstateId: Number(crmId),
    });
  }

  @action
  saveRealEstateEmit(realEstateId: string) {
    socket.emit(WsEvent.SAVE_REAL_ESTATE, { id: realEstateId, realEstateType: RealEstateTypeUpperCase.LAND });
  }

  @action
  addCommentEmit(realEstateId: string, comment: string) {
    socket.emit(WsEvent.ADD_COMMENT, {
      id: realEstateId,
      text: comment,
      realEstateType: RealEstateTypeUpperCase.LAND,
    });
  }

  @action
  async removeFromFavourites(realEstateId: string) {
    try {
      await axios.delete(`${environments.REACT_APP_PROXY}/api/lands/${realEstateId}/favourites`).then(() => {
        const land = this.findById(realEstateId);

        if (!land) {
          return;
        }

        land.isFavourite = false;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  async fetchNewData() {
    if (!this.currentFilter) {
      return;
    }

    const filteredObjectFilter = spyObjectByFieldValue({
      object: filterFieldFromObject({
        object: this.currentFilter,
        isFilterEmptyString: true,
        isEmptyArray: true,
        isFilterNull: true,
      }),
      exceptionTransformField: [LandFilters.ADDRESS],
    });

    const response = await axios
      .post('/api/lands', {
        page: this.page,
        limit: this.rowsPerPage,

        ...filteredObjectFilter,
      })
      .then((response: AxiosResponse<Land[]>) => response);

    const oldIds = new Set(this.realEstate.map((land) => land.id));
    const newLands = response.data.filter((newLand) => !oldIds.has(newLand.id));
    const newLandsWithNewProp = newLands.map((land) => {
      return { ...land, isNew: true };
    });

    runInAction(() => {
      this.realEstate.forEach((land) => {
        land.isNew = false;
      });
    });

    if (newLands.length) {
      this.realEstate = this.realEstate.filter((land) => !land.isNew);
      this.realEstate.unshift(...newLandsWithNewProp);
    }
  }
}
