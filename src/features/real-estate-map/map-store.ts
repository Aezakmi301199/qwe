import DG from '2gis-maps';
import { action, makeAutoObservable, observable } from 'mobx';
import { City, CityStore } from '../../entities/city';
import { Flat, FlatFilterType } from '../../entities/real-estate/flat';
import { House, HouseFilterType } from '../../entities/real-estate/house';
import { Land, LandFilterType } from '../../entities/real-estate/land';
import { MapRealEstateState } from './real-estate-map';
import L from 'leaflet';
import { environments } from '../../environment';
import { NumberConvert } from '../../shared/enums/number-convert.enum';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { ExtremeCoordinatesType, LatLntPoint, LongitudeLatitudePoint } from '../../shared/types/geo/point';
import { debounce } from 'lodash';
import { RealEstateFilterType } from '../../entities/real-estate';
import { CoordinatesGeometryType, CoordinatesPoint, Position } from '../../shared/types/geo/coordinates-geometry';
import { GeoJsonGeometryType } from '../../shared/types/geo/geo-json-geometry-type';
import { ClusterByRealEstateDto } from '../../shared/dto/cluster-by-real-estate-dto';
import { Store } from '../../shared/lib/store';
import { getNorthWest, getSouthEast } from './lib/lib';
import { MapRealEstateSettings } from '../../shared/enums/map-real-estate-settings.enum';
import { getCenterGeometry } from '../../shared/lib/geo/get-center-geometry';
import { flipCoordinatesByGeometry, flipPointCoordinates } from '../../shared/lib/geo/flip-coordinates';
import { getMarkerIcon } from './ui/marker';
import { InitialState } from '../../shared/enums/pagination.enum';
import * as turf from '@turf/turf';
import { User } from '../../entities/user';
import { PostGisGeometry } from '../../shared/enums/geo/post-gis-geometry';
import { limitGeoParamZoomApi } from '../../shared/lib/geo/limit-geo-search-params';

const comparePolygonClusters = (selectedCluster: ClusterByRealEstateDto | null, cluster: ClusterByRealEstateDto) => {
  if (!selectedCluster) {
    return false;
  }

  return JSON.stringify(selectedCluster.polygonCoordinates) === JSON.stringify(cluster.polygonCoordinates) ?? false;
};

const rename2gisPointCoordinates = (point: LatLntPoint) => {
  return {
    longitude: point.lng,
    latitude: point.lat,
  } as LongitudeLatitudePoint;
};

const getCoordinatesByMainDiagonalCities = <T extends RealEstateFilterType>(filter: T, availableCities: City[]) => {
  const selectedCities = filter.city;
  const selectedCitiesWithCoordinates = availableCities.filter((city) => selectedCities.includes(city.id));
  const latitudeCoordinates = selectedCitiesWithCoordinates.map((city) => {
    return city.latitude;
  });
  const longitudeCoordinates = selectedCitiesWithCoordinates.map((city) => {
    return city.longitude;
  });
  const southWest = {
    lat: Math.min(...latitudeCoordinates),
    lng: Math.min(...longitudeCoordinates),
  };
  const northEast = {
    lat: Math.max(...latitudeCoordinates),
    lng: Math.max(...longitudeCoordinates),
  };

  return {
    southWest,
    northEast,
  };
};

const getCoordinatesMainCity = <T extends RealEstateFilterType>(filter: T, cityStore: CityStore, user: User) => {
  const mainUserCity = user.workAddress.city;
  const selectedCities = filter.city;
  const firstSelectedCity = cityStore.findCityById(selectedCities[0]);

  // Filter does not exist
  if (!filter || !firstSelectedCity) {
    return [mainUserCity.latitude, mainUserCity.longitude];
  }

  // Take first city from filter
  return [firstSelectedCity.latitude, firstSelectedCity.longitude];
};

const textPricePopup = (number: number) => {
  const million = NumberConvert.MILLION;
  const thousand = NumberConvert.THOUSAND;

  if (number >= NumberConvert.MILLION) {
    const numberPrice = Number((number / million).toFixed(1)).toLocaleString('en-US');

    return `от ${numberPrice} млн`;
  }

  const numberPrice = Number((number / thousand).toFixed(1)).toLocaleString('en-US');

  return `от ${numberPrice} тыс.`;
};

export class MapStore {
  @observable mapRef: typeof DG | null = null;
  @observable zoom = MapRealEstateSettings.DEFAULT_GEO_ZOOM;
  @observable filter: FlatFilterType | HouseFilterType | LandFilterType | null = null;
  @observable cityStore: CityStore;
  @observable state: MapRealEstateState = MapRealEstateState.EMPTY;
  @observable polyline: Record<string, any> | null = null;
  @observable polygonSelectedArea: Record<string, any> | null = null;
  @observable extremeValueLatAndLng: ExtremeCoordinatesType | null = null;
  @observable realEstateStore: Store<Flat | House | Land>;
  @observable selectedCluster: ClusterByRealEstateDto | null = null;
  @observable markers: L.LayerGroup = DG.featureGroup();
  @observable polygonMarker: Record<string, any> | null = null;
  @observable isShowRealEstate: boolean = true;
  @observable isDraggingMap: boolean = true;
  @observable geometry?: GeoJsonGeometryType = undefined;

  constructor(cityStore: CityStore, realEstateStore: Store<Flat | House | Land>) {
    this.cityStore = cityStore;
    this.realEstateStore = realEstateStore;
    makeAutoObservable(this);
  }

  @action showRealEstate = () => {
    this.isShowRealEstate = true;
  };

  @action hideRealEstate = () => {
    this.isShowRealEstate = false;
  };

  @action
  setSelectedCluster(cluster: ClusterByRealEstateDto | null) {
    this.selectedCluster = cluster;
  }

  @action generateViewPortPostGisPolygonGeometry() {
    const coordinates = this.mapRef.getBounds();
    const southWest = rename2gisPointCoordinates(coordinates._southWest);
    const northEast = rename2gisPointCoordinates(coordinates._northEast);
    const { geometry: geometryJson } = turf.bboxPolygon([
      southWest.longitude,
      southWest.latitude,
      northEast.longitude,
      northEast.latitude,
    ]);

    return geometryJson;
  }

  @action
  async initializeMap(user: User) {
    await DG.then(async () => {
      if (!this.filter) {
        return;
      }

      this.removeMap();

      this.mapRef = DG.map('map', {
        fullscreenControl: false,
        zoomControl: false,
        center: getCoordinatesMainCity(this.filter, this.cityStore, user),
        zoom: MapRealEstateSettings.DEFAULT_GEO_ZOOM,
        minZoom: MapRealEstateSettings.MIN_GEO_ZOOM,
        doubleClickZoom: false,
      });

      if (this.filter.city.length > 1) {
        this.scaleMapToCity();
      }

      this.customizeEventsMapRef();
      this.setExtremeValueLatAndLng();
      await this.addClusters();
      this.state = MapRealEstateState.WITHOUT_AREA;
    });

    return null;
  }

  @action
  async addClusters() {
    this.removeAllMarkers();

    const extremeValueLatAndLng = this.getExtremeValueLatAndLng();

    if (!extremeValueLatAndLng) {
      return;
    }

    this.realEstateStore.clusters.forEach((cluster: ClusterByRealEstateDto) => {
      this.addMarker(cluster);
    });
    this.markers.addTo(this.mapRef);
  }

  @action
  removeSelectedMarker() {
    const selectedMarkerEl = document.getElementsByClassName('selectedMarker')[0];

    if (selectedMarkerEl) {
      selectedMarkerEl.classList.remove('selectedMarker');
    }
  }

  @action addMarker(cluster: ClusterByRealEstateDto) {
    if (!this.markers) {
      return;
    }

    const { polygonCoordinates, count, minimalPrice } = cluster;
    const { type }: GeoJsonGeometryType = polygonCoordinates;
    const correctCoordinatesForLeaflet: CoordinatesGeometryType = flipCoordinatesByGeometry(polygonCoordinates);
    const correctCenterGeometryForLeaflet = flipPointCoordinates(getCenterGeometry(polygonCoordinates)) as [
      number,
      number,
    ];
    const popup = L.popup({
      closeButton: false,
      offset: [0, -15],
    })
      .setContent(
        `<div class='mapRealEstatePopup'>
      ${textPricePopup(minimalPrice)}
    </div>`,
      )
      .setLatLng(correctCenterGeometryForLeaflet);
    const marker = L.marker(correctCenterGeometryForLeaflet, {
      autoPanOnFocus: false,
      riseOffset: 3,
      riseOnHover: true,
      zIndexOffset: 255,
      icon: getMarkerIcon({
        count: Number(count),
        mapZoom: this.getZoom(),
        isSelectedCluster: comparePolygonClusters(this.selectedCluster, cluster),
      }),
    })
      .bindPopup(popup)
      .clearAllEventListeners()
      .addTo(this.markers);

    marker.on('mouseout', () => {
      this.mapRef.closePopup();

      if (this.selectedCluster || type === PostGisGeometry.POINT) {
        return;
      }

      this.removePolygonMarker();
    });

    marker.on('mouseover', () => {
      if (this.getZoom() < MapRealEstateSettings.MIN_GEO_CLUSTER_ZOOM) {
        return;
      }

      marker.openPopup();

      if (type === PostGisGeometry.POINT) {
        return;
      }

      if (this.polygonMarker) {
        return;
      }

      this.addPolygonMarker(correctCoordinatesForLeaflet);

      this.mapRef.addLayer(this.polygonMarker);
    });

    marker.on('click', async (event) => {
      L.DomEvent.stopPropagation(event);
      event.originalEvent.stopPropagation();
      event.originalEvent.preventDefault();

      if (this.getZoom() < MapRealEstateSettings.MIN_GEO_CLUSTER_ZOOM) {
        marker.closePopup();
        this.zoomMapByAroundDot(correctCenterGeometryForLeaflet, this.getZoom() + 1);

        return;
      }

      if (this.selectedCluster?.clusterId === cluster.clusterId) {
        return;
      }

      this.hideRealEstate();
      this.setStateMap(MapRealEstateState.WITHOUT_AREA);
      this.draggingEnable();
      this.setSelectedCluster(cluster);
      this.removeSelectedMarker();
      this.removePolygonMarker();
      this.removePolygonSelectedArea();

      if (type !== PostGisGeometry.POINT) {
        this.addPolygonMarker(correctCoordinatesForLeaflet);
      }

      marker.setIcon(
        getMarkerIcon({
          count: Number(count),
          mapZoom: this.getZoom(),
          isSelectedCluster: comparePolygonClusters(this.selectedCluster, cluster),
        }),
      );

      this.realEstateStore.setPage(InitialState.FIRST);
      await this.prepareGeometryAndZoomInFilter();
      this.showRealEstate();
    });
  }

  @action setExtremeValueLatAndLng() {
    const { _southWest: southWest, _northEast: northEast } = this.mapRef.getBounds();
    const northWest = getNorthWest(southWest, northEast);
    const southEast = getSouthEast(southWest, northEast);

    this.extremeValueLatAndLng = {
      topLatitude: northWest.lat,
      topLongitude: northWest.lng,
      bottomLatitude: southEast.lat,
      bottomLongitude: southEast.lng,
    } as ExtremeCoordinatesType;
  }

  @action
  zoomMapByAroundDot(point: LatLntPoint | CoordinatesPoint, zoom: number) {
    this.mapRef.setZoomAround(point, zoom);
  }

  @action getExtremeValueLatAndLng() {
    return this.extremeValueLatAndLng;
  }

  @action
  async createScriptInitializeMap(filter: FlatFilterType | HouseFilterType | LandFilterType | null, user: User) {
    this.filter = filter;

    const script = document.createElement('script');

    script.src = `${environments.REACT_APP_MAPS_SCRIPT_URL}`;
    script.async = true;
    script.onload = await this.initializeMap(user);
    document.body.appendChild(script);
  }

  @action
  async reRenderMap(filter: FlatFilterType | HouseFilterType | LandFilterType | null, user: User) {
    this.removeAllMarkers();
    this.removePolygonMarker();
    this.removePolygonSelectedArea();
    this.setSelectedCluster(null);
    this.filter = filter;

    if (!this.filter) {
      return;
    }

    if (this.filter.city.length > 1) {
      this.scaleMapToCity();
    } else {
      const mainCurrentCity = getCoordinatesMainCity(this.filter, this.cityStore, user);

      this.mapRef.panTo(mainCurrentCity);
      this.zoomMapByAroundDot(mainCurrentCity, MapRealEstateSettings.DEFAULT_GEO_ZOOM);
    }

    if (this.geometry && this.geometry.type !== PostGisGeometry.POINT) {
      const correctCoordinatesForLeaflet = flipCoordinatesByGeometry(this.geometry);

      this.addPolygonSelectedAreaToMap(correctCoordinatesForLeaflet as Position[]);
      this.scaleMapToPolygonSelectedArea();
    }

    this.setExtremeValueLatAndLng();
    this.realEstateStore.setChangingFilter(false);
    await this.addClusters();
  }

  @action removeAllMarkers() {
    if (!!this.markers) {
      this.markers.removeFrom(this.mapRef);
    }

    this.markers = DG.featureGroup();
  }

  @action
  customizeEventsMapRef() {
    let isProcessingDraggingMap = false;

    this.mapRef.on('mousedown', () => {
      if (this.state !== MapRealEstateState.READY_TO_DRAW) {
        return;
      }

      this.setStateMap(MapRealEstateState.DRAWING_AREA);
    });

    this.mapRef.on('dragstart', () => {
      isProcessingDraggingMap = true;
    });

    this.mapRef.on(
      'drag',
      debounce(async () => {
        this.setExtremeValueLatAndLng();

        if (this.selectedCluster || this.polygonSelectedArea) {
          if (this.extremeValueLatAndLng) {
            await this.realEstateStore.fetchDataClusters(this.zoom, this.extremeValueLatAndLng);
            await this.addClusters();
          }

          return;
        }

        this.realEstateStore.setPage(InitialState.FIRST);
        await this.prepareGeometryAndZoomInFilter();
      }, 700 * TimeConvert.MILLISECONDS_IN_MILLISECONDS),
    );

    this.mapRef.on(
      'dragend',
      debounce(() => {
        isProcessingDraggingMap = false;
      }, 100 * TimeConvert.MILLISECONDS_IN_MILLISECONDS),
    );

    this.mapRef.on('mousemove', (event: { latlng: LatLntPoint }) => {
      if (this.state !== MapRealEstateState.DRAWING_AREA) {
        return;
      }

      const { latlng } = event;

      this.drawPointOnPolyline([latlng.lat, event.latlng.lng]);
    });

    this.mapRef.on('mouseup', async () => {
      if (this.state === MapRealEstateState.DRAWING_AREA && this.polyline) {
        if (this.polyline._latlngs.length <= 2) {
          this.removePolyline();
          this.setStateMap(MapRealEstateState.WITHOUT_AREA);

          return;
        }

        this.realEstateStore.setPage(InitialState.FIRST);
        this.setSelectedCluster(null);
        this.removePolygonMarker();
        this.addPolygonSelectedAreaToMap(this.polyline._latlngs);
        this.removeAllMarkers();
        this.scaleMapToPolygonSelectedArea();
        this.setStateMap(MapRealEstateState.RENDERED_AREA);
        this.draggingEnable();
        this.removePolyline();
        this.showRealEstate();
        await this.prepareGeometryAndZoomInFilter();
      }
    });

    this.mapRef.on(
      'zoomend',
      debounce(async () => {
        this.setExtremeValueLatAndLng();
        this.removeAllMarkers();
        await this.prepareGeometryAndZoomInFilter();
      }, 700 * TimeConvert.MILLISECONDS_IN_MILLISECONDS),
    );

    this.mapRef.on('click', async (event: { latlng: LatLntPoint }) => {
      if (isProcessingDraggingMap) {
        return;
      }

      if (this.getZoom() < MapRealEstateSettings.MIN_GEO_CLUSTER_ZOOM) {
        this.zoomMapByAroundDot(event.latlng, this.getZoom() + 1);

        return;
      }
    });
  }

  @action
  addPolyline() {
    this.polyline = DG.polyline([]).addTo(this.mapRef);
  }

  @action
  removePolyline() {
    if (this.polyline) {
      this.polyline.remove();
    }
  }

  @action
  getPolygonSelectedArea() {
    return this.polygonSelectedArea;
  }

  @action
  removePolygonSelectedArea() {
    if (this.polygonSelectedArea) {
      this.polygonSelectedArea.remove();
      this.polygonSelectedArea = null;
    }
  }

  @action
  removePolygonMarker() {
    if (this.polygonMarker) {
      this.polygonMarker.remove();
      this.polygonMarker = null;
    }
  }

  @action
  addPolygonSelectedAreaToMap(coordinates: LatLntPoint[] | Position[]) {
    this.polygonSelectedArea = DG.polygon(coordinates, {
      color: 'rgba(52, 121, 232, 1)', // polygon border color
      weight: 2, // border-width
      fillColor: 'rgba(52, 121, 232, 0.60)',
    });

    if (!this.polygonSelectedArea) {
      return;
    }

    this.polygonSelectedArea.addTo(this.mapRef);
  }

  @action drawPointOnPolyline(coordinates: CoordinatesPoint) {
    if (this.polyline) {
      this.polyline.addLatLng(coordinates);
    }
  }

  @action
  zoomIn() {
    if (!this.mapRef) {
      return;
    }

    this.mapRef.setZoom(this.getZoom() + 1);
  }

  @action
  setZoom(zoom: number) {
    this.mapRef.setZoom(zoom);
  }

  @action
  getZoom(): number {
    return this.mapRef.getZoom();
  }

  @action
  setStateMap(state: MapRealEstateState) {
    this.state = state;
  }

  @action
  async prepareGeometryAndZoomInFilter() {
    if (this.selectedCluster) {
      this.setGeometryAndZoom(this.selectedCluster.polygonCoordinates, this.mapRef.getZoom());

      return;
    }

    if (this.polygonSelectedArea && !this.selectedCluster) {
      const coordinatesForTurf = this.polygonSelectedArea?._latlngs.map((ring: LatLntPoint[]) => {
        const firstPoint = rename2gisPointCoordinates(ring[0]);
        const ringWithoutFirstPoint = ring.map((point: LatLntPoint) => [point.lng, point.lat]);

        return [...ringWithoutFirstPoint, [firstPoint.longitude, firstPoint.latitude]];
      });
      const { geometry } = turf.polygon(coordinatesForTurf);

      this.setGeometryAndZoom(geometry, this.mapRef.getZoom());

      return;
    }

    this.setGeometryAndZoom(this.generateViewPortPostGisPolygonGeometry(), this.mapRef.getZoom());
  }

  @action
  zoomOut() {
    if (!this.mapRef) {
      return;
    }

    this.mapRef.setZoom(this.getZoom() - 1);
  }

  @action
  draggingEnable() {
    this.isDraggingMap = true;
    this.mapRef.dragging.enable();
  }

  @action
  draggingDisable() {
    this.isDraggingMap = false;
    this.mapRef.dragging.disable();
  }

  @action
  scaleMapToPolygonSelectedArea() {
    if (!this.polygonSelectedArea) {
      return;
    }

    const { _southWest: southWest, _northEast: northEast } = this.polygonSelectedArea._bounds;

    if (!southWest || !northEast) {
      return;
    }

    this.mapRef.fitBounds([southWest, northEast]);
  }

  @action
  scaleMapToCity() {
    if (!this.filter) {
      return;
    }

    const coordinates = getCoordinatesByMainDiagonalCities(this.filter, this.cityStore.findCities());

    this.mapRef.fitBounds([coordinates.northEast, coordinates.southWest]);
  }

  @action
  clearGeometryOnMarkerAndPolygon() {
    if (this.mapRef) {
      this.setStateMap(MapRealEstateState.WITHOUT_AREA);
      this.draggingEnable();
      this.removeSelectedMarker();
      this.removePolygonMarker();
      this.setSelectedCluster(null);
      this.removePolygonSelectedArea();
    }

    this.setGeometryAndZoom(undefined, MapRealEstateSettings.DEFAULT_GEO_ZOOM);
  }

  @action
  addPolygonMarker(polygonCoordinates: CoordinatesGeometryType) {
    DG.point();
    this.polygonMarker = DG.polygon(polygonCoordinates, {
      color: 'rgba(52, 121, 232, 1)', // polygon border color
      weight: 2, // border-width
      fillColor: 'rgba(52, 121, 232, 0.60)',
    });

    this.mapRef.addLayer(this.polygonMarker);
  }

  @action
  getGeometryAndZoomObject() {
    if (this.geometry && this.zoom) {
      return {
        geometry: this.geometry,
        zoom: limitGeoParamZoomApi(this.zoom),
      };
    }

    return {};
  }

  @action
  setGeometryAndZoom(geometry: GeoJsonGeometryType | undefined, zoom: number) {
    this.geometry = geometry;
    this.zoom = zoom;
  }

  @action
  removeMap() {
    if (this.mapRef) {
      this.mapRef.remove();
      this.mapRef = null;
    }
  }
}
