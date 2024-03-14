import { CrmFlat, CrmHouse, CrmLand } from '../../entities/real-estate/object/model/type';
import { PageLimit } from '../enums/pagination.enum';
import { CrmRealEstateFilter } from '../../entities/real-estate/common/type';

export interface CrmStore<T extends CrmFlat | CrmHouse | CrmLand | undefined> {
  rowsPerPage: PageLimit;
  loading: boolean;
  crmRealEstate: T[];
  crmRealEstateCount: number;
  isErrorData: boolean;
  filter: CrmRealEstateFilter;

  setLoadingRealEstate(loadingState: boolean): void;

  setFilter(filter: CrmRealEstateFilter): void;

  setRowsPerPage(rowsPerPage: PageLimit): void;

  incrementCrmCommentCount(realEstateId: string): void;

  fetchCrmRealEstate(userId: string): Promise<void>;

  findCrmRealEstateById(realEstateId: string): T | undefined;

  fetchCrmRealEstateCount(userId: string): Promise<void>;
}
