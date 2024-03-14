import { DealType } from '../../../shared/enums/deal-type.enum';
import { Task } from '../../../entities/task';
import { IAvailableTask } from '../../../entities/task';

const checkTaskOnAvailable = ({
  taskByDomainAndRealEstateType,
  dealType,
}: {
  taskByDomainAndRealEstateType: IAvailableTask | undefined;
  dealType: DealType;
}) => {
  return !!taskByDomainAndRealEstateType?.dealTypes.includes(dealType);
};

interface ExistingTaskProps {
  realEstateType: string;
  domain: string;
  existTaskList: Task[];
}

const getExistingTask = ({ realEstateType, domain, existTaskList }: ExistingTaskProps) => {
  return existTaskList.find(
    (existTask) =>
      existTask.params.dealType === DealType.SALE &&
      existTask.params.realEstateType === realEstateType &&
      existTask.script === domain,
  );
};

type AvailableAndExistTaskResponse = {
  taskByDomainAndRealEstateType: IAvailableTask | undefined;
  realEstateType: string;
  dealType: DealType;
  domain: string;
  existTaskList: Task[];
};

export const getAvailableAndExistTaskResponse = ({
  taskByDomainAndRealEstateType,
  realEstateType,
  dealType,
  domain,
  existTaskList,
}: AvailableAndExistTaskResponse): [isAvailableTask: boolean, availableAndExistTask: Task | undefined] => {
  const isAvailableTask = checkTaskOnAvailable({
    taskByDomainAndRealEstateType,
    dealType: dealType,
  });

  const availableAndExistTask = isAvailableTask
    ? getExistingTask({
        realEstateType,
        domain,
        existTaskList,
      })
    : undefined;

  return [isAvailableTask, availableAndExistTask];
};
