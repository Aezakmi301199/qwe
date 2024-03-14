import { FlatRoomCount } from '../enums/flat-room-count';

export const renderRoomCount = (roomCount: number) => {
  const studio = 'Ст';

  return roomCount === FlatRoomCount.STUDIO ? studio : roomCount;
};
