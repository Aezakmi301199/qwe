import { LatLntPoint } from '../../../shared/types/geo/point';

export const getNorthWest = (southWestPoint: LatLntPoint, northEastPoint: LatLntPoint) => {
  const { lat: maxYCoord } = northEastPoint;
  const { lng: minXcoord } = southWestPoint;

  return {
    lat: maxYCoord,
    lng: minXcoord,
  };
};

export const getSouthEast = (southWestPoint: LatLntPoint, northEastPoint: LatLntPoint) => {
  const { lng: maxXCoord } = northEastPoint;
  const { lat: minYCoord } = southWestPoint;

  return {
    lat: minYCoord,
    lng: maxXCoord,
  };
};
