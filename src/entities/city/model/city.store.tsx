import axios from 'axios';
import { useState } from 'react';
import { City, MetroStationCity } from './types';
import { action, computed, makeAutoObservable, runInAction } from 'mobx';
import { AutoCompleteOptionDto } from '../../../shared/types/auto-complete-option';
import { Task } from '../../task';
import qs from 'qs';
import { RealEstateTypeUpperCase } from '../../../shared/enums/real-estate-type-upper-case.enum';
import { DomainSource } from '../../domain';
import { MetroOptionDto } from '../ui/city-metro-station-multi-autocomplete';
import { handleAxiosError } from '../../../shared/lib/handle-axios-error';
import { environments } from '../../../environment';

export const useCity = (initialStateCity?: City[], initialStateMetroStation?: MetroStationCity[]) => {
  const [cities, setCities] = useState<City[]>(initialStateCity ?? []);
  const [metroStations, setMetroStations] = useState<MetroStationCity[]>(initialStateMetroStation ?? []);
  const loadCities = async () => {
    const dataCities: City[] = await axios.get(`${environments.REACT_APP_PROXY}/api/cities`).then((res) => res.data);

    setCities(dataCities);

    return dataCities;
  };

  return {
    cities,
    loadCities,
    metroStations,
    setMetroStations,
  };
};

export class CityStore {
  city: City[] = [];
  metroStations: MetroStationCity[] = [];
  tasks: Task[] = [];
  loadingCity = true;
  loadingTask = true;
  loadingMetroStations = true;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  async fetchData() {
    try {
      const dataCities: City[] = await axios.get(`${environments.REACT_APP_PROXY}/api/cities`).then((res) => res.data);

      runInAction(() => {
        this.city = dataCities;
        this.loadingCity = false;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  async fetchMetroStationByCityId(cityId: string) {
    try {
      const metroStationsDataByCity = await axios
        .get(`${environments.REACT_APP_PROXY}/api/cities/${cityId}/metro-stations`)
        .then((res) => res.data);

      runInAction(() => {
        this.metroStations = metroStationsDataByCity;
        this.loadingMetroStations = false;
      });
    } catch (error) {
      handleAxiosError(error);
    }
  }

  @action
  setMetroStations = (metroStations: MetroStationCity[]) => {
    this.metroStations = metroStations;
  };

  @action
  findCities = () => {
    return this.city;
  };

  @action
  findCityById = (id: string) => {
    return this.city.find((city) => city.id === id);
  };

  @action
  findAutoCompleteOptionCity = (availableCity?: City[]): AutoCompleteOptionDto[] => {
    const city = availableCity ?? this.city;

    return city.map((city: City) => {
      return {
        label: city.name,
        id: city.id,
      };
    });
  };

  @action
  findAutoCompleteOptionMetroCity = (): MetroOptionDto[] => {
    return this.metroStations.map((metroStation: MetroStationCity) => {
      return {
        label: metroStation.name,
        id: metroStation.id,
        metroLine: metroStation.metroLine,
      };
    });
  };

  @action
  async fetchTasksByCities(city: string[]) {
    this.loadingTask = true;

    try {
      const dataTasks: Task[] = await axios
        .get(`${environments.REACT_APP_PROXY}/api/cities/tasks`, {
          params: { 'city[]': city },
          paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
        })
        .then((res) => res.data);

      runInAction(() => {
        this.tasks = dataTasks;
        this.loadingTask = false;
      });
    } catch (error) {
      handleAxiosError(error);
    }

    this.loadingTask = false;
  }

  @action findCitiesByIds(ids: string[]) {
    return this.city.filter((city) => ids.includes(city.id));
  }

  @computed
  findTasksByCities() {
    return this.tasks;
  }

  @computed
  findTasksByCity(city: string) {
    return this.tasks.filter((task) => task.cityId === city && task.isActive);
  }

  @computed
  findConnectedDomainsByParams({
    city,
    domains,
    realEstateType,
  }: {
    city: string[];
    domains: DomainSource[];
    realEstateType: RealEstateTypeUpperCase;
  }) {
    return domains.filter((domain: DomainSource) =>
      this.tasks.some(
        (task: Task) =>
          task.script === domain.value &&
          task.params.realEstateType === realEstateType &&
          city.includes(task.cityId) &&
          task.isActive,
      ),
    );
  }

  @computed
  filterAutoCompleteOptionByCity(citiesOptions: AutoCompleteOptionDto[], selectedCityValue: string[]) {
    return citiesOptions.filter((city: AutoCompleteOptionDto) => selectedCityValue.includes(city.id));
  }

  @computed
  findAutoCompleteOptionByCity(citiesOptions: AutoCompleteOptionDto[], selectedCityValue: string) {
    return citiesOptions.find((city: AutoCompleteOptionDto) => city.id === selectedCityValue);
  }

  @computed
  filterAutoCompleteOptionByMetroLine(metroOptions: MetroOptionDto[], selectedMetroValue: string[]) {
    return metroOptions.filter((metro: MetroOptionDto) => selectedMetroValue.includes(metro.id));
  }
}
