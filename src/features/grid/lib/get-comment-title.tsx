import { RealEstateType } from '../../../shared/enums/real-estate-type.enum';
import { getItemDeclension } from '../../../shared/lib/get-item-declension';
import { Flat } from '../../../entities/real-estate/flat';
import { House } from '../../../entities/real-estate/house';
import { Land } from '../../../entities/real-estate/land';
import { InitialState } from '../../../shared/enums/pagination.enum';

export const getCommentTitle = (realEstateType: RealEstateType, props?: Flat | House | Land) => {
  if (!props) {
    return '';
  }

  if (realEstateType === RealEstateType.FLATS) {
    const { roomCount, floor, floorCount, area } = props as Flat;

    if (floor & floorCount) {
      return `${getItemDeclension(roomCount, ['комната', 'комнаты', 'комнат'])}, ${
        area || InitialState.ZERO
      } м², этаж ${floor}/${floorCount}`;
    }

    return `${getItemDeclension(roomCount, ['комната', 'комнаты', 'комнат'])}, ${area || InitialState.ZERO} м²`;
  }

  if (realEstateType === RealEstateType.HOUSES) {
    const { landArea, area } = props as House;

    return `Дом, участок ${landArea || InitialState.ZERO} сот., площадь дома ${area || InitialState.ZERO} м²`;
  }

  if (realEstateType === RealEstateType.LANDS) {
    const { area } = props as Land;

    return `Земельный участок, площадь участка ${area || InitialState.ZERO} сот.`;
  }

  return '';
};
