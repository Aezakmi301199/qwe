import { Comment } from '../../entities/comment';
import { Flat, FlatFilterType } from '../../entities/real-estate/flat';
import { House, HouseFilterType } from '../../entities/real-estate/house';
import { Land, LandFilterType } from '../../entities/real-estate/land';
import { PageLimit } from '../enums/pagination.enum';
import { ClusterByRealEstateDto } from '../dto/cluster-by-real-estate-dto';
import { ExtremeCoordinatesLatLng } from '../types/geo/point';
import { GeoJsonGeometryType } from '../types/geo/geo-json-geometry-type';
import { DateTime } from 'luxon';
import { TypeOrderBy } from '../enums/type-order-by';
import { User } from '../../entities/user';

export interface Store<T extends Flat | House | Land> {
  loadingPhone: boolean;
  realEstate: T[];
  comments: Comment[];
  count: number;
  currentFilter: null | FlatFilterType | HouseFilterType | LandFilterType;
  loading: boolean;
  page: number;
  rowsPerPage: PageLimit;
  currentCommentPage: number;
  clusters: ClusterByRealEstateDto[];
  isErrorData: boolean;
  isChangingFilter: boolean;
  isConnectedDomains: boolean;

  resetStore(): void;

  fetchDataClusters(zoom: number, coordinates: ExtremeCoordinatesLatLng): Promise<void>;

  setLoadingRealEstate(loadingState: boolean): void;

  setPage(page: number): void;

  setRowsPerPage(rowsPerPage: PageLimit): void;

  setCurrentFilter(objectFilter: FlatFilterType | HouseFilterType | LandFilterType): void;

  changeValueByCurrentFilter(fieldName: string, value: any): void;

  removeFieldByFilter(fieldName: string): void;

  removeById(realEstateId: string): void;

  findById(realEstateId: string): T | undefined;

  fetchByIdFromApi(realEstateId: string): Promise<T | undefined>;

  fetchData(startTime?: DateTime, viewBox?: GeoJsonGeometryType, zoom?: number): Promise<void>;

  summaryFetchData(page: number, zoom: number, geometry?: GeoJsonGeometryType): Promise<boolean>;

  fetchCount(objectFilter: FlatFilterType | HouseFilterType | LandFilterType): Promise<number | void>;

  fetchComments(realEstateId: string, page: number, commentCount: number): Promise<void>;

  addToFavourites(realEstateId: string): Promise<void>;

  removeFromFavourites(realEstateId: string): Promise<void>;

  changeStatus(realEstateId: string, statusId: string | null, userId: string): void;

  reserveForCall(params: { realEstateId: string; userId: string; avatarUrl: string; fullName: string }): void;

  cancelReservationForCall(realEstateId: string): void;

  handleDisconnect(userId: string): void;

  addComment(comment: Comment): void;

  findPhoneById(realEstateId: string): void;

  setNewPhone(realEstateId: string, phone: string): void;

  incrementCommentCount(realEstateId: string): void;

  changeFavourite(realEstateId: string): Promise<void>;

  fetchFavourite(user: User, domain: string[], orderBy: TypeOrderBy): Promise<void>;

  changeStatusEmit(realEstateId: string, userStatusId: string | null): void;

  callEndedEmit(realEstateId: string): void;

  makeCallEmit(realEstateId: string): void;

  addDuplicateEmit(realEstateId: string, crmId: string): void;

  saveRealEstateEmit(realEstateId: string): void;

  addCommentEmit(realEstateId: string, comment: string): void;

  fetchFavoriteCount(userId: string): Promise<void>;

  clearComments(): void;

  setChangingFilter(isChangingFilter: boolean): void;

  fetchNewData(): Promise<void>;
}
