import L from 'leaflet';

interface DivIconOptions {
  className?: string;
  html?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  popupAnchor?: [number, number];
}

export class DgDivIcon extends L.DivIcon {
  constructor(options?: DivIconOptions) {
    super(options);
  }
}
