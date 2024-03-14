import React, { useEffect } from 'react';
import markerIcon from '../assets/icons/mapPinIcon.svg';
import { Box } from '@mui/material';
import { MapContainer } from '../styles/styles';
import DG from '2gis-maps';
import { environments } from '../../environment';

type LocationMapPointProps = {
  borderRadius: string;
  marginRight: string;
  coordinates: { longitude: number; latitude: number };
  hasZoom: boolean;
};

const LocationMapPoint: React.FC<LocationMapPointProps> = ({ borderRadius, marginRight, coordinates }) => {
  useEffect(() => {
    const loadMap = () => {
      DG.then(function () {
        const map = DG.map('map', {
          zoomControl: false,
          fullscreenControl: false,
          center: [coordinates.latitude, coordinates.longitude],
          zoom: 10,
        });
        const customIcon = DG.icon({
          iconUrl: markerIcon,
          iconSize: [32, 32],
        });

        DG.marker([coordinates.latitude, coordinates.longitude], { icon: customIcon }).addTo(map);
      });
    };
    const script = document.createElement('script');

    script.src = `${environments.REACT_APP_MAPS_SCRIPT_URL}`;
    script.async = true;
    script.onload = loadMap;
    document.body.appendChild(script);
  }, []);

  return (
    <MapContainer>
      <Box height={'100%'} marginRight={marginRight} borderRadius={borderRadius} id='map'></Box>
    </MapContainer>
  );
};

export default LocationMapPoint;
