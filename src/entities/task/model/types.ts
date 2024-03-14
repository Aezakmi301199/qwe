import { DealType } from '../../../shared/enums/deal-type.enum';
import { RealEstateTypeUpperCase } from '../../../shared/enums/real-estate-type-upper-case.enum';
import { Script } from '../../../shared/enums/script.enum';
import { TaskStatus } from '../../../shared/enums/status-task.enum';

export type IAvailableTask = {
  script: Script;
  dealTypes: DealType[];
};

export interface Task {
  id: string;
  cityId: string;
  isActive: boolean;
  name: string;
  interval: number;
  script: string;
  params: {
    cookie?: string;
    dealType: DealType;
    realEstateType: RealEstateTypeUpperCase;
  };
  status: TaskStatus;
  nextRunAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAvailableTaskData {
  realEstateType: RealEstateTypeUpperCase;
  availableTasks: IAvailableTask[];
}
