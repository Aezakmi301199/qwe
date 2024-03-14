import * as React from 'react';
import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGridContainer } from '../../shared/styles/styles';
import { Anchor } from '../../shared/enums/anchor.enum';
import Toolbar from '../../components/toolbar/toolbar';
import { Divider } from '@mui/material';
import { ColumnVisibilityState } from '../../shared/types/column-visibility-state';
import { TabLink } from '../../shared/enums/tab-link.enum';
import { useRootStore } from '../../root-store.context';
import { WsEvent } from '../../shared/enums/ws-event';
import SnackbarNotify from '../../shared/ui-kit/snackbar/snackbar-shared';
import {
  columnNamesLandTable,
  columnViewLandTable,
  initialColumnVisibilityLand,
  LandTable,
} from '../../entities/real-estate/land';
import { RealEstateType } from '../../shared/enums/real-estate-type.enum';
import { getCommentTitle } from './lib/get-comment-title';
import { formatPrice } from '../../shared/lib/format-price-number';
import { CurrencySymbol } from '../../shared/enums/currency-symbol.enum';
import DrawerObjectInfo from '../../components/drawers/drawer-object-info';
import DrawerMap from '../../components/drawers/drawer-map';
import DuplicateObjectModal from '../../components/modals/duplicate-object-modal';
import { mainStyleDoubleObjectModal } from '../../shared/styles/modal-styles';
import { observer } from 'mobx-react';
import { CommentDrawer } from '../../entities/comment';
import DrawerSettingsColumn from '../../shared/ui-kit/drawer/drawer-settings-column';
import { LocalStorageName } from '../../shared/enums/local-storage';
import SnackbarToast from '../../shared/ui-kit/snackbar/snackbar-copy-id';
import { SnackbarMessage } from '../../shared/enums/snackbar-message';
import { useUser } from '../../user-context';
import { SocketContext } from '../../socket';

const LandGrid = observer(() => {
  const [openedMapDrawerId, setOpenedMapDrawerId] = useState<string | null>(null);
  const [isOpenSnackBar, setIsOpenSnackBar] = useState<boolean>(false);
  const [openedMakeCallDrawerId, setOpenedMakeCallDrawerId] = useState<string | null>(null);
  const [openedCommentDrawerId, setOpenedCommentDrawerId] = useState<string | null>(null);
  const [openedDuplicateDrawerId, setOpenedDuplicateDrawerId] = useState<string | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(initialColumnVisibilityLand);
  const [isOpenSaveCRMSnackbar, setIsOpenSaveCRMSnackbar] = useState<boolean>(false);
  const [isMySaveCrm, setIsMySaveCrm] = useState<boolean>(false);
  const [isOpenDuplicateModal, setIsOpenDuplicateModal] = useState<boolean>(false);
  const [isOpenDuplicateSnackbar, setIsOpenDuplicateSnackbar] = useState<boolean>(false);
  const [isMyDuplicate, setIsMyDuplicate] = useState<boolean>(false);
  const landId = openedCommentDrawerId || openedMakeCallDrawerId || openedMapDrawerId || openedDuplicateDrawerId;
  const user = useUser();
  const { catalogStore, landStore } = useRootStore();

  const toggleColumnVisibility = (columnName: string) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnName]: !prevVisibility[columnName],
    }));
  };
  const handleOpenSnackBar = () => {
    setIsOpenSnackBar(true);
  };
  const handleCloseSnackBar = () => {
    setIsOpenSnackBar(false);
  };
  const socket = useContext(SocketContext);

  socket
    .off(WsEvent.STATUS_CHANGED)
    .on(
      WsEvent.STATUS_CHANGED,
      ({
        realEstateId,
        statusId,
        commentText,
        commentId,
        userId,
        userFullName,
        userAvatarUrl,
      }: {
        realEstateId: string;
        statusId: string | null;
        commentText: string;
        commentId: string;
        userId: string;
        userFullName: string;
        userAvatarUrl: string;
      }) => {
        if (!user) {
          return;
        }

        landStore.changeStatus(realEstateId, statusId, user.id);

        if (!statusId) {
          return;
        }

        landStore.addComment({
          createdAt: new Date().toISOString(),
          id: commentId,
          isAutoCreated: true,
          text: commentText,
          updatedAt: new Date().toISOString(),
          user: {
            avatarUrl: userAvatarUrl,
            fullName: userFullName,
          },
          userId: userId,
        });
        landStore.incrementCommentCount(realEstateId);
      },
    );

  socket
    .off(WsEvent.COMMENT_ADDED)
    .on(
      WsEvent.COMMENT_ADDED,
      ({
        userId,
        userFullName,
        userAvatarUrl,
        text,
        realEstateId,
        commentId,
      }: {
        userId: string;
        userFullName: string;
        userAvatarUrl: string;
        realEstateId: string;
        text: string;
        commentId: string;
      }) => {
        if (realEstateId === landId) {
          landStore.addComment({
            createdAt: new Date().toISOString(),
            id: commentId,
            isAutoCreated: false,
            text: text,
            updatedAt: new Date().toISOString(),
            user: {
              avatarUrl: userAvatarUrl,
              fullName: userFullName,
            },
            userId: userId,
          });
        }

        landStore.incrementCommentCount(realEstateId);
      },
    );

  let land = null;

  if (landId) {
    land = landStore.findById(landId);
  }

  return (
    <DataGridContainer>
      <Toolbar
        hasOpenCard={true}
        store={landStore}
        selectedTab={TabLink.LANDS}
        filterStorageName={LocalStorageName.LAND_FILTER}
        renderDrawerSettingsColumn={({ stateOpenSettingsDrawer, toggleSettingsDrawer }) => (
          <DrawerSettingsColumn
            setColumnVisibility={setColumnVisibility}
            toggleColumnVisibility={toggleColumnVisibility}
            state={stateOpenSettingsDrawer}
            onClose={toggleSettingsDrawer(Anchor.ANCHOR_RIGHT, false)}
            columnsViewCell={columnViewLandTable}
            columnNames={columnNamesLandTable}
            initialColumnVisibility={initialColumnVisibilityLand}
          />
        )}
      />
      <Divider orientation='horizontal' sx={{ marginTop: '16px' }} />
      <SnackbarToast
        handleCloseSnackBar={handleCloseSnackBar}
        isOpenSnackBar={isOpenSnackBar}
        message={SnackbarMessage.COPY_CODE}
      />
      <SnackbarNotify
        message={isMySaveCrm ? SnackbarMessage.MY_SAVE_RIES : SnackbarMessage.OTHER_SAVE_RIES}
        isOpenSnackBar={isOpenSaveCRMSnackbar}
        handleCloseSnackBar={() => setIsOpenSaveCRMSnackbar(false)}
      />
      <SnackbarNotify
        message={isMyDuplicate ? SnackbarMessage.MY_DUPLICATE : SnackbarMessage.OTHER_DUPLICATE}
        isOpenSnackBar={isOpenDuplicateSnackbar}
        handleCloseSnackBar={() => setIsOpenDuplicateSnackbar(false)}
      />
      <Box width='100%'>
        <LandTable
          handleOpenSaveCRMSnackbar={() => setIsOpenSaveCRMSnackbar(true)}
          columnVisibility={columnVisibility}
          handleOpenSnackBar={handleOpenSnackBar}
          setOpenedMakeCallDrawerId={setOpenedMakeCallDrawerId}
          setOpenedMapDrawerId={setOpenedMapDrawerId}
          statuses={catalogStore.findStatuses()}
          setOpenedCommentDrawerId={setOpenedCommentDrawerId}
          openMakeCallDrawerId={openedMakeCallDrawerId}
          openCommentDrawerId={openedCommentDrawerId}
          setOpenedDuplicateDrawerId={setOpenedDuplicateDrawerId}
          setIsOpenDuplicateModal={setIsOpenDuplicateModal}
          setIsMySaveCrm={setIsMySaveCrm}
          handleOpenDuplicateSnackbar={() => setIsOpenDuplicateSnackbar(true)}
          setIsMyDuplicate={setIsMyDuplicate}
        />

        {openedCommentDrawerId && land && (
          <CommentDrawer
            commentCount={land._count.comments}
            store={landStore}
            realEstateId={openedCommentDrawerId}
            primaryText={getCommentTitle(RealEstateType.LANDS, landStore.findById(openedCommentDrawerId))}
            secondaryText={`${
              land.price ? `${formatPrice(land.price || null)} ${CurrencySymbol[land.currency]}` : 'Не указана'
            }`}
            state={{ right: true }}
            setOpenedDrawerCommentId={setOpenedCommentDrawerId}
            hideBackdrop={false}
            showHeader={true}
            isFromCallInfoDrawer={false}
          />
        )}
        {openedMakeCallDrawerId && land && (
          <DrawerObjectInfo
            store={landStore}
            route={RealEstateType.LANDS}
            statuses={catalogStore.findStatuses()}
            realEstateId={openedMakeCallDrawerId}
            setOpenedDrawer={setOpenedMakeCallDrawerId}
            state={{ right: true }}
          />
        )}
        {openedDuplicateDrawerId && (
          <DuplicateObjectModal
            store={landStore}
            realEstateId={openedDuplicateDrawerId}
            open={isOpenDuplicateModal}
            onClose={() => setIsOpenDuplicateModal(false)}
            style={mainStyleDoubleObjectModal}
          />
        )}
        {openedMapDrawerId && land && (
          <DrawerMap
            setOpenedMapDrawerId={setOpenedMapDrawerId}
            state={{ right: true }}
            coordinates={{ latitude: land.latitude, longitude: land.longitude }}
          />
        )}
      </Box>
    </DataGridContainer>
  );
});

export default LandGrid;
