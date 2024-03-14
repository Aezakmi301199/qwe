import {
  CoordinatesMultiPolygon,
  CoordinatesLineString,
  CoordinatesPolygon,
} from '../../types/geo/coordinates-geometry';

export const transformMultiPolygonToLineString = (coordinates: CoordinatesMultiPolygon) => {
  return coordinates[0][0] as CoordinatesLineString;
};

export const transformPolygonToLineString = (coordinates: CoordinatesPolygon) => {
  return coordinates[0] as CoordinatesLineString;
};
