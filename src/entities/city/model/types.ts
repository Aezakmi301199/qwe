export { StatusCity } from '../../../shared/enums/status-city.enum';

export type MetroStationCity = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  hasProxy: boolean;
  metroLine: MetroLineCity;
};

export type MetroLineCity = {
  id: string;
  hexColor: string;
  name: string;
  cityId: string;
};

export type City = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  hasProxy: boolean;
  tasksCount: {
    active: number;
    inactive: number;
  };
};
