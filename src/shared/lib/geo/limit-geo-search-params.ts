import { FlatClusterType } from '../../../entities/real-estate/flat';
import { HouseClusterType } from '../../../entities/real-estate/house';
import { LandClusterType } from '../../../entities/real-estate/land';
import { MapRealEstateSettings } from '../../enums/map-real-estate-settings.enum';
import { ExtremePostGisCoordinatesValue } from '../../enums/geo/point';
import { isNegativeNumber } from '../number/is-negative-number';

export const limitGeoParamZoomApi = (zoom: number | undefined): number | undefined => {
  if (zoom === undefined) {
    return zoom;
  }

  return zoom > MapRealEstateSettings.MAX_GEO_CLUSTER_ZOOM ? MapRealEstateSettings.MAX_GEO_CLUSTER_ZOOM : zoom;
};

const limitGeoParamLatitude = (coordinateValue: number) => {
  if (coordinateValue > ExtremePostGisCoordinatesValue.MAX_ABS_LATITUDE) {
    return isNegativeNumber(coordinateValue)
      ? ExtremePostGisCoordinatesValue.MIN_LATITUDE
      : ExtremePostGisCoordinatesValue.MAX_LATITUDE;
  }

  return coordinateValue;
};

const limitGeoParamLongitude = (coordinateValue: number) => {
  if (coordinateValue > ExtremePostGisCoordinatesValue.MAX_ABS_LONGITUDE) {
    return isNegativeNumber(coordinateValue)
      ? ExtremePostGisCoordinatesValue.MIN_LONGITUDE
      : ExtremePostGisCoordinatesValue.MAX_LONGITUDE;
  }

  return coordinateValue;
};

export const limitGeoParamsRealEstateClusters = (
  clusterFilter: FlatClusterType | HouseClusterType | LandClusterType,
) => {
  return {
    ...clusterFilter,
    zoom: clusterFilter.zoom ? limitGeoParamZoomApi(clusterFilter.zoom) : undefined,
  };
};
