import { CrmStatusObject } from '../../../shared/enums/object-status.enum';

export type CrmStatus = {
  readableName: string;
  value: CrmStatusObject;
  hexColor: string;
};
