import { PostGisGeometry } from '../enums/geo/post-gis-geometry';
import { GeoJsonGeometryType } from '../types/geo/geo-json-geometry-type';

export const isGeometryViewport = (geometry: GeoJsonGeometryType) => {
  return geometry?.type === PostGisGeometry.POLYGON && geometry?.coordinates[0]?.length === 5;
};
