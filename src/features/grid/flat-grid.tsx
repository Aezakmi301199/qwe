import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import DrawerMap from '../../components/drawers/drawer-map';
import SnackbarToast from '../../shared/ui-kit/snackbar/snackbar-copy-id';
import { DataGridContainer } from '../../shared/styles/styles';
import { Anchor } from '../../shared/enums/anchor.enum';
import Toolbar from '../../components/toolbar/toolbar';
import { Divider } from '@mui/material';
import { ColumnVisibilityState } from '../../shared/types/column-visibility-state';
import { TabLink } from '../../shared/enums/tab-link.enum';
import { formatPrice } from '../../shared/lib/format-price-number';
import { CurrencySymbol } from '../../shared/enums/currency-symbol.enum';
import { getCommentTitle } from './lib/get-comment-title';
import DrawerObjectInfo from '../../components/drawers/drawer-object-info';
import { RealEstateType } from '../../shared/enums/real-estate-type.enum';
import { WsEvent } from '../../shared/enums/ws-event';
import { observer } from 'mobx-react';
import SnackbarNotify from '../../shared/ui-kit/snackbar/snackbar-shared';
import { mainStyleDoubleObjectModal } from '../../shared/styles/modal-styles';
import DuplicateObjectModal from '../../components/modals/duplicate-object-modal';
import { useRootStore } from '../../root-store.context';
import { SnackbarMessage } from '../../shared/enums/snackbar-message';
import { CommentDrawer } from '../../entities/comment';
import DrawerSettingsColumn from '../../shared/ui-kit/drawer/drawer-settings-column';
import {
  columnNamesFlatTable,
  columnViewFlatTable,
  FlatTable,
  initialColumnVisibilityFlat,
} from '../../entities/real-estate/flat';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { useUser } from '../../user-context';
import { SocketContext } from '../../socket';

const FlatGrid = observer(() => {
  const [openedMakeCallDrawerId, setOpenedMakeCallDrawerId] = useState<string | null>(null);
  const [openedMapDrawerId, setOpenedMapDrawerId] = useState<string | null>(null);
  const [openedCommentDrawerId, setOpenedCommentDrawerId] = useState<string | null>(null);
  const [openedDuplicateDrawerId, setOpenedDuplicateDrawerId] = useState<string | null>(null);
  const [isOpenCopySnackbar, setIsOpenCopySnackbar] = useState<boolean>(false);
  const [isOpenSaveCRMSnackbar, setIsOpenSaveCRMSnackbar] = useState<boolean>(false);
  const [isOpenDuplicateSnackbar, setIsOpenDuplicateSnackbar] = useState<boolean>(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(initialColumnVisibilityFlat);
  const [isOpenDuplicateModal, setIsOpenDuplicateModal] = useState<boolean>(false);
  const [isMySaveCrm, setIsMySaveCrm] = useState<boolean>(false);
  const [isMyDuplicate, setIsMyDuplicate] = useState<boolean>(false);
  const user = useUser();
  const { catalogStore, flatStore } = useRootStore();
  const flatId = openedCommentDrawerId || openedMakeCallDrawerId || openedMapDrawerId || openedDuplicateDrawerId;

  const toggleColumnVisibility = (columnName: string) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnName]: !prevVisibility[columnName],
    }));
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

        flatStore.changeStatus(realEstateId, statusId, user.id);

        if (!statusId) {
          return;
        }

        flatStore.addComment({
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
        flatStore.incrementCommentCount(realEstateId);
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
        if (realEstateId === flatId) {
          flatStore.addComment({
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

        flatStore.incrementCommentCount(realEstateId);
      },
    );

  let flat = null;

  if (flatId) {
    flat = flatStore.findById(flatId);
  }

  return (
    <DataGridContainer>
      <Toolbar
        hasOpenCard={true}
        store={flatStore}
        selectedTab={TabLink.FLATS}
        filterStorageName={LocalStorageName.FLAT_FILTER}
        renderDrawerSettingsColumn={({ stateOpenSettingsDrawer, toggleSettingsDrawer }) => (
          <DrawerSettingsColumn
            setColumnVisibility={setColumnVisibility}
            toggleColumnVisibility={toggleColumnVisibility}
            state={stateOpenSettingsDrawer}
            onClose={toggleSettingsDrawer(Anchor.ANCHOR_RIGHT, false)}
            columnsViewCell={columnViewFlatTable}
            columnNames={columnNamesFlatTable}
            initialColumnVisibility={initialColumnVisibilityFlat}
          />
        )}
      />
      <Divider orientation='horizontal' sx={{ marginTop: '16px' }} />
      <SnackbarToast
        handleCloseSnackBar={() => setIsOpenCopySnackbar(false)}
        isOpenSnackBar={isOpenCopySnackbar}
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
        <FlatTable
          openCommentDrawerId={openedCommentDrawerId}
          openMakeCallDrawerId={openedMakeCallDrawerId}
          columnVisibility={columnVisibility}
          setOpenedMapDrawerId={setOpenedMapDrawerId}
          handleOpenSnackBar={() => setIsOpenCopySnackbar(true)}
          handleOpenSaveCRMSnackbar={() => setIsOpenSaveCRMSnackbar(true)}
          handleOpenDuplicateSnackbar={() => setIsOpenDuplicateSnackbar(true)}
          setOpenedMakeCallDrawerId={setOpenedMakeCallDrawerId}
          setOpenedCommentDrawerId={setOpenedCommentDrawerId}
          setOpenedDuplicateDrawerId={setOpenedDuplicateDrawerId}
          setIsOpenDuplicateModal={setIsOpenDuplicateModal}
          statuses={catalogStore.findStatuses()}
          setIsMySaveCrm={setIsMySaveCrm}
          setIsMyDuplicate={setIsMyDuplicate}
        />
        {openedCommentDrawerId && flat && (
          <CommentDrawer
            commentCount={flat._count.comments}
            store={flatStore}
            realEstateId={openedCommentDrawerId}
            primaryText={getCommentTitle(RealEstateType.FLATS, flat)}
            secondaryText={`${
              flat.price ? `${formatPrice(flat.price || null)} ${CurrencySymbol[flat.currency]}` : 'Не указана'
            }`}
            state={{ right: true }}
            setOpenedDrawerCommentId={setOpenedCommentDrawerId}
            hideBackdrop={false}
            showHeader={true}
            isFromCallInfoDrawer={false}
          />
        )}
        {openedMakeCallDrawerId && flat && (
          <DrawerObjectInfo
            store={flatStore}
            route={RealEstateType.FLATS}
            statuses={catalogStore.findStatuses()}
            realEstateId={openedMakeCallDrawerId}
            setOpenedDrawer={setOpenedMakeCallDrawerId}
            state={{ right: true }}
          />
        )}
        {openedDuplicateDrawerId && flat && (
          <DuplicateObjectModal
            store={flatStore}
            realEstateId={openedDuplicateDrawerId}
            open={isOpenDuplicateModal}
            onClose={() => setIsOpenDuplicateModal(false)}
            style={mainStyleDoubleObjectModal}
          />
        )}
        {openedMapDrawerId && flat && (
          <DrawerMap
            setOpenedMapDrawerId={setOpenedMapDrawerId}
            state={{ right: true }}
            coordinates={{ latitude: flat.latitude, longitude: flat.longitude }}
          />
        )}
      </Box>
    </DataGridContainer>
  );
});

export default FlatGrid;
