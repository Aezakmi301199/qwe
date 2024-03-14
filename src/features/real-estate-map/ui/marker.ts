import { DgDivIcon } from '../../../shared/types/2gis';
import { MapRealEstateGeoSearchParam } from '../map-real-estate-geo-search-param';
import DG from '2gis-maps';

const adaptMarkerIconContent = (markerIcon: DgDivIcon, contentCount: number, defaultSizeMarkerIcon: number) => {
  const countFigureCount = String(contentCount).length;
  const additionalVolumeContentPx = countFigureCount * MapRealEstateGeoSearchParam.MIN_ADDITION_VOLUME_CONTENT;
  const currentIconSizeMarkerIcon = defaultSizeMarkerIcon + additionalVolumeContentPx;
  const iconAnchorSize = Math.round(currentIconSizeMarkerIcon) / 2;
  const popupAnchorSize = (Math.round(currentIconSizeMarkerIcon) / 3) * -1;

  markerIcon.options.iconSize = [currentIconSizeMarkerIcon, currentIconSizeMarkerIcon];
  markerIcon.options.iconAnchor = [iconAnchorSize, iconAnchorSize];
  markerIcon.options.popupAnchor = [0, popupAnchorSize];

  return markerIcon;
};

const changeSizeMarker = (zoom: number, markerIcon: DgDivIcon, contentCount: number) => {
  const zoomToContentCount: Record<typeof zoom, number> = {
    18: 26,
    17: 23,
    16: 20,
    15: 18,
    14: 16,
    13: 15,
    12: 14,
    11: 14,
    10: 16,
    9: 18,
    8: 22,
    7: 22,
    6: 22,
    5: 22,
    4: 22,
    3: 22,
    2: 22,
    1: 22,
  };

  return adaptMarkerIconContent(markerIcon, contentCount, zoomToContentCount[zoom]);
};

export const getMarkerIcon = ({
  count,
  mapZoom,
  isSelectedCluster,
}: {
  count: number;
  mapZoom: number;
  isSelectedCluster: boolean;
}) => {
  let markerIcon: DgDivIcon = DG.divIcon({
    className: `circleMapMarker ${isSelectedCluster ? 'selectedMarker' : ''}`,
    html: `<div class="marker-count">${count}</div>`,
  });

  markerIcon = changeSizeMarker(mapZoom, markerIcon, count);

  return markerIcon;
};
