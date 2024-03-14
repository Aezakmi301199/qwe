import { City } from '../../../entities/city';

type cityGroupsProps = {
  firstLetter: string;
  cities: City[];
};

export const groupCity = (cities: City[]) => {
  const cityGrouping = cities.reduce((cityGrouping: { [firstLetter: string]: cityGroupsProps }, city: City) => {
    const firstLetter = city.name[0];

    if (!cityGrouping[firstLetter]) {
      cityGrouping[firstLetter] = { firstLetter, cities: [city] };

      return cityGrouping;
    }

    cityGrouping[firstLetter].cities.push(city);

    return cityGrouping;
  }, {});

  return Object.values(cityGrouping);
};
