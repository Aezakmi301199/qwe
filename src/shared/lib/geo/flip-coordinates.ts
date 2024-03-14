import { PostGisGeometry } from '../../enums/geo/post-gis-geometry';
import {
  CoordinatesMultiPolygon,
  CoordinatesPolygon,
  CoordinatesLineString,
  CoordinatesPoint,
} from '../../types/geo/coordinates-geometry';
import { GeoJsonGeometryType } from '../../types/geo/geo-json-geometry-type';
import * as turf from '@turf/turf';

export const flipCoordinatesByGeometry = ({ type, coordinates }: GeoJsonGeometryType) => {
  if (type === PostGisGeometry.MULTI_POLYGON) {
    return flipMultiPolygonCoordinates(coordinates);
  } else if (type === PostGisGeometry.POLYGON) {
    return flipPolygonCoordinates(coordinates);
  } else if (type === PostGisGeometry.LINE_STRING) {
    return flipLineStringCoordinates(coordinates);
  }

  return flipPointCoordinates(coordinates);
};

export const flipMultiPolygonCoordinates = (multiPolygon: CoordinatesMultiPolygon): CoordinatesMultiPolygon => {
  const turfPolygon = turf.multiPolygon(multiPolygon);

  const {
    geometry: { coordinates },
  } = turf.flip(turfPolygon);

  return coordinates;
};

export const flipPolygonCoordinates = (polygon: CoordinatesPolygon) => {
  const turfPolygon = turf.polygon(polygon);
  const {
    geometry: { coordinates },
  } = turf.flip(turfPolygon);

  return coordinates;
};

export const flipLineStringCoordinates = (lineString: CoordinatesLineString) => {
  const turfLineString = turf.lineString(lineString);
  const {
    geometry: { coordinates },
  } = turf.flip(turfLineString);

  return coordinates;
};

export const flipPointCoordinates = (point: CoordinatesPoint): CoordinatesPoint => {
  const turfPoint = turf.point(point);
  const {
    geometry: { coordinates },
  } = turf.flip(turfPoint);

  return coordinates;
};
