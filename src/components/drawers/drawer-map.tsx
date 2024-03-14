import React from 'react';
import { CloseMapDrawerButton, DrawerMapContainer } from '../../shared/styles/styles';
import { Box } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import closeSettingsColumnIcon from '../../shared/assets/icons/closeSettingsColumnIcon.svg';
import LocationMapPoint from '../../shared/components/location-map-point';
import { Anchor } from '../../shared/enums/anchor.enum';

type DrawerMapProps = {
  state: { right: boolean };
  setOpenedMapDrawerId: (id: string | null) => void;
  coordinates: { longitude: number; latitude: number };
};

const DrawerMap: React.FC<DrawerMapProps> = ({ state, setOpenedMapDrawerId, coordinates }) => {
  const drawerWidth = '50%';

  const list = () => (
    <DrawerMapContainer role={'presentation'}>
      <Box width={'100%'} height={'100%'}>
        <CloseMapDrawerButton
          onClick={() => setOpenedMapDrawerId(null)}
          className={'closeButtonMap'}
          alt={''}
          src={closeSettingsColumnIcon}
        />
        <LocationMapPoint marginRight={'33px'} borderRadius={'12px'} coordinates={coordinates} hasZoom={true} />
      </Box>
    </DrawerMapContainer>
  );

  return (
    <React.Fragment>
      <Drawer
        anchor={Anchor.ANCHOR_RIGHT}
        open={state[Anchor.ANCHOR_RIGHT]}
        sx={{
          left: '0 !important',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            overflow: 'visible',
            width: drawerWidth,
          },
          '.css-1160xiw-MuiPaper-root-MuiDrawer-paper': {
            backgroundColor: 'transparent !important',
            boxShadow: 'none !important',
          },
          '.css-1fx1ci2-MuiStack-root': {
            boxShadow: 'none !important',
          },
          '.css-53hgdk-MuiStack-root': {
            boxShadow: 'none !important',
          },
        }}
      >
        {list()}
      </Drawer>
    </React.Fragment>
  );
};

export default DrawerMap;
