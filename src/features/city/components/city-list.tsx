import React, { SetStateAction, Dispatch } from 'react';
import { StyledCityList, Title } from '../ui/ui';
import { useCity } from '../../../entities/city';
import { groupCity } from '../model/city-list.model';
import { CityItem } from '../../../entities/city';

type CityListProps = {
  cityId: string;
  setCityId: Dispatch<SetStateAction<string>>;
};

export const CityList: React.FC<CityListProps> = ({ cityId, setCityId }) => {
  const { cities } = useCity();
  const citiesGroupping = groupCity(cities);

  return (
    <StyledCityList>
      {citiesGroupping.map((cityGroup) => (
        <>
          <Title color={'text.secondary'}>{cityGroup.firstLetter}</Title>
          {cityGroup.cities.map((city) => (
            <CityItem city={city} selectedCityId={cityId} key={city.id} onClickCity={setCityId} />
          ))}
        </>
      ))}
    </StyledCityList>
  );
};
