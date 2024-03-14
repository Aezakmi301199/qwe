import { PostGisGeometry } from '../../enums/geo/post-gis-geometry';
import {
  CoordinatesPoint,
  CoordinatesLineString,
  CoordinatesLinearRing,
  CoordinatesPolygon,
} from '../../types/geo/coordinates-geometry';
import { GeoJsonGeometryType } from '../../types/geo/geo-json-geometry-type';
import { transformMultiPolygonToLineString } from './transform-coordinates';
import * as turf from '@turf/turf';

export const getCenterGeometry = ({ type, coordinates }: GeoJsonGeometryType): CoordinatesPoint => {
  if (type === PostGisGeometry.MULTI_POLYGON) {
    getCenterLineString(transformMultiPolygonToLineString(coordinates));
  } else if (type === PostGisGeometry.POLYGON) {
    return getCenterPolygon(coordinates);
  } else if (type === PostGisGeometry.LINE_STRING) {
    return getCenterLineString(coordinates);
  }

  return coordinates as CoordinatesPoint;
};

const getCenterPolygon = (polygon: CoordinatesPolygon) => {
  const turfLineString = turf.polygon(polygon);

  const {
    geometry: { coordinates },
  } = turf.centroid(turfLineString);

  return coordinates;
};

const getCenterLineString = (lineString: CoordinatesLineString | CoordinatesLinearRing) => {
  const turfLineString = turf.lineString(lineString);

  const {
    geometry: { coordinates },
  } = turf.centroid(turfLineString);

  return coordinates;
};
