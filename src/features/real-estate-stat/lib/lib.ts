import { FlatRoomCount } from '../../../shared/enums/flat-room-count';
import { RealEstateTypeUpperCase } from '../../../shared/enums/real-estate-type-upper-case.enum';

export const getNameRowByRealEstate = (realEstate: RealEstateTypeUpperCase, roomCount?: number | undefined | null) => {
  if (realEstate === RealEstateTypeUpperCase.HOUSE) {
    return 'Загородный дом';
  }

  if (roomCount === FlatRoomCount.MULTI_ROOM_COUNT) {
    return `Квартира ${FlatRoomCount.MULTI_ROOM_COUNT}-ком.+`;
  }

  return roomCount === FlatRoomCount.STUDIO ? `Студия` : `Квартира ${roomCount}-ком.`;
};
