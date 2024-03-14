import React, { useState } from 'react';
import { DrawerInfoContainer, HeaderCommentBox } from '../../shared/styles/styles';
import { Anchor } from '../../shared/enums/anchor.enum';
import Drawer from '@mui/material/Drawer';
import MainSectionObjectInfoContainer from '../containers/drawer-object-info/main-section-object-info-container';
import { Button, Modal, Stack, Typography } from '@mui/material';
import { FontSize } from '../../shared/enums/font-size.enum';
import { FontWeight } from '../../shared/enums/font-weight.enum';
import Box from '@mui/material/Box';
import closeButton from '../../shared/assets/icons/closeModalIcon.svg';
import { RealEstateType } from '../../shared/enums/real-estate-type.enum';
import { getCommentTitle } from '../../features/grid/lib/get-comment-title';
import { Status } from '../../entities/status';
import { observer } from 'mobx-react';
import ButtonObjectInfoContainer from '../containers/drawer-object-info/button-object-info-container';
import { Store } from '../../shared/lib/store';
import { Flat } from '../../entities/real-estate/flat';
import { House } from '../../entities/real-estate/house';
import { Land } from '../../entities/real-estate/land';
import { DefaultValue } from '../../shared/enums/default-values.enum';
import { styleCallEndModal } from '../../shared/styles/modal-styles';
import { TitleTypography } from '../../features/account/ui/ui';
import { theme } from '../../app/providers/theme';
import { Size } from '../../shared/enums/size.enum';
import { CloseRounded } from '@mui/icons-material';
import StatusChip from '../../shared/ui-kit/chip/status-chip';

type DrawerObjectInfoProps = {
  state: {
    right: boolean;
  };
  route: RealEstateType;
  statuses: Status[];
  setOpenedDrawer: (id: string | null) => void;
  realEstateId: string;
  store: Store<Flat | House | Land>;
};

const DrawerObjectInfo: React.FC<DrawerObjectInfoProps> = observer(
  ({ state, route, statuses, setOpenedDrawer, realEstateId, store }) => {
    const list = () => {
      const realEstate = store.findById(realEstateId);

      if (!realEstate) {
        return null;
      }

      const [initialStatus] = useState(realEstate.userStatus?.statusId || null);
      const [selectedStatus, setSelectedStatus] = useState<string | null>(initialStatus);
      const [isOpenedCallEndModal, setIsOpenedCallEndModal] = useState<boolean>(false);
      const [isCallInProgress, setIsCallInProgress] = useState(false);
      const applyStatusOnClose = (userStatusId: string | null) => {
        if (initialStatus !== userStatusId) {
          store.changeStatusEmit(realEstateId, userStatusId);
        }

        setOpenedDrawer(null);
      };

      return (
        <DrawerInfoContainer key={realEstate.id}>
          <HeaderCommentBox>
            <Stack direction={'column'} alignItems={'center'}>
              <Typography fontSize={FontSize.TWENTY_FOUR_FONT} fontWeight={FontWeight.SEMI_BOLD}>
                {getCommentTitle(route, realEstate)}
              </Typography>
            </Stack>
            <Box
              onClick={() => {
                if (isCallInProgress) {
                  setIsOpenedCallEndModal(true);

                  return;
                }

                applyStatusOnClose(selectedStatus);
              }}
            >
              <img className={'closeButton'} alt={''} src={closeButton} />
            </Box>
          </HeaderCommentBox>
          <MainSectionObjectInfoContainer
            store={store}
            setIsCallInProgress={setIsCallInProgress}
            isCallInProgress={isCallInProgress}
            id={realEstate.id}
            address={realEstate.address.trim() ? realEstate.address : DefaultValue.DEFAULT_ADDRESS}
            price={realEstate.price}
            author={realEstate.author}
            clientName={realEstate.clientName}
            domain={realEstate.domain}
            metroStationName={realEstate.metroStation?.name}
            metroStationLineHexColor={realEstate.metroStation?.metroLine.hexColor}
            url={realEstate.url}
            statuses={statuses}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            setOpenedDrawer={setOpenedDrawer}
          />
          <ButtonObjectInfoContainer realEstate={realEstate} store={store} />
          <Modal open={isOpenedCallEndModal}>
            <Stack sx={styleCallEndModal}>
              <Stack gap={'4px'}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <TitleTypography lineHeight={'32px'}>Звонок завершен?</TitleTypography>
                  <CloseRounded
                    onClick={() => setIsOpenedCallEndModal(false)}
                    sx={{ color: '#131D358A', cursor: 'pointer' }}
                    fontSize={Size.LARGE}
                  />
                </Box>
                <Typography fontSize={FontSize.FOURTEENTH_FONT} color={theme.palette.text.secondary}>
                  Если нажать «Звонок завершен» или закрыть информацию об объекте, клиенту смогут позвонить другие
                  риэлторы
                </Typography>
              </Stack>
              <Stack justifyContent={'flex-start'}>
                <StatusChip statuses={statuses} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
              </Stack>
              <Button
                onClick={() => {
                  store.callEndedEmit(realEstateId);
                  store.cancelReservationForCall(realEstateId);
                  setIsCallInProgress(false);
                  applyStatusOnClose(selectedStatus);
                  setIsOpenedCallEndModal(false);
                }}
                size={Size.LARGE}
                variant={'contained'}
                color={'error'}
                sx={{
                  textTransform: 'none',
                  boxShadow: 'none',
                  borderRadius: '8px',
                  width: '100%',
                }}
              >
                Звонок завершен
              </Button>
            </Stack>
          </Modal>
        </DrawerInfoContainer>
      );
    };

    return (
      <React.Fragment>
        <Drawer
          anchor={Anchor.ANCHOR_RIGHT}
          open={state[Anchor.ANCHOR_RIGHT]}
          sx={{
            width: '370px',
            right: '32px',
            left: 'auto',
            '.css-10ohwma-MuiPaper-root-MuiDrawer-paper': {
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
              right: 'auto !important',
            },
          }}
        >
          {list()}
        </Drawer>
      </React.Fragment>
    );
  },
);

export default DrawerObjectInfo;
