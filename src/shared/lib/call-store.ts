import { CallDataFlat, CallDataHouse, CallDataLand } from '../../entities/real-estate/flat-call/model/type';

export interface CallStore<T extends CallDataFlat | CallDataHouse | CallDataLand> {
  page: number;
  realEstateCalls: T[];
  realEstateCallsCount: number;

  fetchCalls(userId: string): Promise<void>;
  fetchCallsCount(userId: string): Promise<void>;
  setPage(page: number): void;
}
