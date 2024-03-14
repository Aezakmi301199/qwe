import { GeoJsonGeometryType } from '../types/geo/geo-json-geometry-type';

export type ClusterByRealEstateDto = {
  clusterId: number;
  count: number;
  minimalPrice: number;
  polygonCoordinates: GeoJsonGeometryType;
};
