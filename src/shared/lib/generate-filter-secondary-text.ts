import { RealEstateFilters } from '../../entities/user/model/type';
import { FlatFilterType } from '../../entities/real-estate/flat';
import { HouseFilterType } from '../../entities/real-estate/house';
import { LandFilterType } from '../../entities/real-estate/land';
import { renderField } from './render-field';
import { renderRoomCount } from './get-room-count';
import { CurrencySymbol } from '../enums/currency-symbol.enum';
import { getDomain } from './get-domain-name';
import { DomainSource } from '../../entities/domain';
import { City } from '../../entities/city';
import { separateThousand } from './separate-thousand';

export const generateFilterSecondaryText = (
  filter: RealEstateFilters<FlatFilterType | HouseFilterType | LandFilterType>,
  domains: DomainSource[],
  cities: City[],
) => {
  const cityNames = `г. ${cities.map((city) => city.name).join(', ')}`;
  const roomCount =
    'roomCount' in filter.params
      ? renderField(filter.params.roomCount?.map((rc) => renderRoomCount(rc)).join(', '), ' ком.')
      : null;
  const area = generateRangeParams(filter.params.areaFrom, filter.params.areaTo, 'м²');
  const price = generateRangeParams(filter.params.priceFrom, filter.params.priceTo, CurrencySymbol.RUB);
  const domain = filter.params.domain.map((domain) => getDomain(domain, domains)).join(', ');
  const geometry = filter.params.geometry ? 'Область на карте' : null;

  return [cityNames, roomCount, area, price, domain, geometry].filter(Boolean).join(', ');
};

const generateRangeParams = (valueFrom: string | undefined, valueTo: string | undefined, label: string) => {
  if (!valueFrom && !valueTo) {
    return null;
  }

  if (valueFrom && valueTo) {
    return `${separateThousand(valueFrom)}–${separateThousand(valueTo)} ${label}`;
  }

  if (valueFrom && !valueTo) {
    return `от ${separateThousand(valueFrom)} ${label}`;
  }

  if (valueTo && !valueFrom) {
    return `до ${separateThousand(valueTo)} ${label}`;
  }
};
