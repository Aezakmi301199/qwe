import React, { ReactNode } from 'react';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { MapContainer } from '../../shared/styles/styles';
import drawOnMapIcon from '../../shared/assets/icons/draw_on_map.svg';
import 'leaflet/dist/leaflet.css';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { FontFamily } from '../../shared/enums/font-family.enum';
import { observer } from 'mobx-react-lite';
import { MapStore } from './map-store';

type LocationMapPointProps = {
  borderRadius: string;
  marginRight: string;
};

export enum MapRealEstateState {
  EMPTY = 'empty',
  WITHOUT_AREA = 'withoutArea',
  READY_TO_DRAW = 'readyToDraw',
  DRAWING_AREA = 'drawingArea',
  RENDERED_AREA = 'renderedArea',
}

interface ButtonHighlightAreaProps {
  mapStore: MapStore;
}

const ButtonHighlightArea: React.FC<ButtonHighlightAreaProps> = observer(({ mapStore }) => {
  return (
    <Button
      variant='contained'
      color='inherit'
      size='medium'
      sx={{
        background: 'white',
        '&:hover': {
          background: 'white',
        },
      }}
      startIcon={<img src={drawOnMapIcon} />}
      disableRipple
      onClick={
        {
          [MapRealEstateState.EMPTY]: () => {
            return;
          },
          [MapRealEstateState.WITHOUT_AREA]: () => {
            mapStore.setStateMap(MapRealEstateState.READY_TO_DRAW);
            mapStore.removePolygonSelectedArea();
            mapStore.draggingDisable();
            mapStore.addPolyline();
          },
          [MapRealEstateState.READY_TO_DRAW]: () => {
            mapStore.setStateMap(MapRealEstateState.WITHOUT_AREA);
            mapStore.draggingEnable();
          },
          [MapRealEstateState.DRAWING_AREA]: () => {
            return;
          },
          [MapRealEstateState.RENDERED_AREA]: () => {
            mapStore.clearGeometryOnMarkerAndPolygon();
          },
        }[mapStore.state]
      }
    >
      <Typography
        sx={{
          fontFamily: FontFamily.ROBOTO,
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: '24px',
          letterSpacing: '0.021px',
          textTransform: 'none',
        }}
      >
        {
          {
            [MapRealEstateState.EMPTY]: '',
            [MapRealEstateState.WITHOUT_AREA]: 'Выделить область',
            [MapRealEstateState.READY_TO_DRAW]: 'Отменить выделение',
            [MapRealEstateState.DRAWING_AREA]: 'Выделяю область',
            [MapRealEstateState.RENDERED_AREA]: 'Очистить область',
          }[mapStore.state]
        }
      </Typography>
    </Button>
  );
});

type ZoomControlMapProps = {
  mapStore: MapStore;
};

const ZoomControlMap: React.FC<ZoomControlMapProps> = observer(({ mapStore }) => {
  const theme = useTheme();

  const buttonZoomIn = (
    <Box
      borderRadius={'50%'}
      width={'40px'}
      height={'40px'}
      sx={{
        background: theme.custom.bg.button.white.default,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '1px',
      }}
      onClick={() => mapStore.zoomIn()}
    >
      <AddIcon
        sx={{
          width: theme.custom.icon.icon.md,
          height: theme.custom.icon.icon.md,
          color: theme.palette.text.primary,
        }}
      />
    </Box>
  );

  const buttonZoomOut = (
    <Box
      borderRadius={'50%'}
      width={'40px'}
      height={'40px'}
      sx={{
        background: theme.custom.bg.button.white.default,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '1px',
      }}
      onClick={() => mapStore.zoomOut()}
    >
      <RemoveIcon
        sx={{
          width: theme.custom.icon.icon.md,
          height: theme.custom.icon.icon.md,
          color: theme.palette.text.primary,
        }}
      />
    </Box>
  );

  return (
    <Stack padding={'0px'} alignItems={'flex-start'} gap={'6px'}>
      {buttonZoomIn}
      {buttonZoomOut}
    </Stack>
  );
});

type WidgetRealEstateMapProps = {
  card: ReactNode;
  mapStore: MapStore;
};

export const WidgetRealEstateMap: React.FC<WidgetRealEstateMapProps> = ({ card, mapStore }) => {
  const zIndexBiggerThenMap = 2;

  return (
    <Box position={'absolute'} top={'24px'} left={'24px'} right={'24px'} bottom={'24px'}>
      {card}
      <Box position={'absolute'} top={'0px'} right={'0px'} zIndex={zIndexBiggerThenMap}>
        <ButtonHighlightArea mapStore={mapStore} />
      </Box>
      <Box position={'absolute'} top={'500px'} right={'0px'} zIndex={zIndexBiggerThenMap}>
        <ZoomControlMap mapStore={mapStore} />
      </Box>
    </Box>
  );
};

const RealEstateMap: React.FC<LocationMapPointProps> = ({ borderRadius, marginRight }) => {
  return (
    <MapContainer>
      <Box height={'100%'} marginRight={marginRight} borderRadius={borderRadius} id='map'></Box>
    </MapContainer>
  );
};

export default RealEstateMap;
