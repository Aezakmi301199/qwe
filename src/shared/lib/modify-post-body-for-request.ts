import { FlatFilterType } from '../../entities/real-estate/flat';
import { HouseFilterType } from '../../entities/real-estate/house';
import { LandFilterType } from '../../entities/real-estate/land';

export const modifyPostBodyForRequest = (
  filter: FlatFilterType | HouseFilterType | LandFilterType,
  statusLength: number,
) => {
  const filterCopy = JSON.parse(JSON.stringify(filter));

  if (filterCopy.statusId?.length === statusLength) {
    delete filterCopy.statusId;
  }

  return filterCopy;
};
