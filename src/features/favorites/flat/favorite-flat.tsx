import React, { useContext, useEffect, useState } from 'react';
import { ColumnVisibilityState } from '../../../shared/types/column-visibility-state';
import FlatFavoriteTable from './flat-favorite-table';
import { DataGridContainer } from '../../../shared/styles/styles';
import { CommentDrawer } from '../../../entities/comment';
import { getCommentTitle } from '../../grid/lib/get-comment-title';
import { RealEstateType } from '../../../shared/enums/real-estate-type.enum';
import { formatPrice } from '../../../shared/lib/format-price-number';
import { CurrencySymbol } from '../../../shared/enums/currency-symbol.enum';
import DrawerObjectInfo from '../../../components/drawers/drawer-object-info';
import DuplicateObjectModal from '../../../components/modals/duplicate-object-modal';
import { mainStyleDoubleObjectModal } from '../../../shared/styles/modal-styles';
import { useRootStore } from '../../../root-store.context';
import SnackbarToast from '../../../shared/ui-kit/snackbar/snackbar-copy-id';
import { SnackbarMessage } from '../../../shared/enums/snackbar-message';
import SnackbarNotify from '../../../shared/ui-kit/snackbar/snackbar-shared';
import { observer } from 'mobx-react';
import { WsEvent } from '../../../shared/enums/ws-event';
import {
  columnNamesFlatTable,
  columnViewFlatTable,
  defaultFlatFilter,
  initialColumnVisibilityFlat,
} from '../../../entities/real-estate/flat';
import DrawerMap from '../../../components/drawers/drawer-map';
import { TabLink } from '../../../shared/enums/tab-link.enum';
import { LocalStorageName } from '../../../shared/enums/local-storage';
import DrawerSettingsColumn from '../../../shared/ui-kit/drawer/drawer-settings-column';
import { Anchor } from '../../../shared/enums/anchor.enum';
import Toolbar from '../../../components/toolbar/toolbar';
import { Box, Divider } from '@mui/material';
import NoDataNotification from '../../../shared/ui-kit/no-data-notification/no-data-notification';
import { DomainSource } from '../../../entities/domain';
import { NoDataMessage } from '../../../shared/enums/no-data-message-enum';
import { BorderLinearProgress } from '../../../shared/ui-kit/progress/border-linear-progress';
import { useUser } from '../../../user-context';
import { SocketContext } from '../../../socket';

const FavoriteFlat = observer(() => {
  const { flatStore, catalogStore, cityStore } = useRootStore();
  const user = useUser();
  const [openedMapDrawerId, setOpenedMapDrawerId] = useState<string | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(initialColumnVisibilityFlat);
  const [isOpenDuplicateModal, setIsOpenDuplicateModal] = useState<boolean>(false);
  const [openedMakeCallDrawerId, setOpenedMakeCallDrawerId] = useState<string | null>(null);
  const [openedCommentDrawerId, setOpenedCommentDrawerId] = useState<string | null>(null);
  const [openedDuplicateDrawerId, setOpenedDuplicateDrawerId] = useState<string | null>(null);
  const [isOpenCopySnackbar, setIsOpenCopySnackbar] = useState<boolean>(false);
  const [isMySaveCrm, setIsMySaveCrm] = useState<boolean>(false);
  const [isMyDuplicate, setIsMyDuplicate] = useState<boolean>(false);
  const [isOpenSaveCRMSnackbar, setIsOpenSaveCRMSnackbar] = useState<boolean>(false);
  const [isOpenDuplicateSnackbar, setIsOpenDuplicateSnackbar] = useState<boolean>(false);
  const flatId = openedCommentDrawerId || openedMakeCallDrawerId || openedMapDrawerId || openedDuplicateDrawerId;

  useEffect(() => {
    catalogStore.fetchStatuses();
    flatStore.fetchFavourite(
      user,
      catalogStore.domains.map((domain: DomainSource) => domain.name),
      flatStore.currentFilter?.orderBy ? flatStore.currentFilter?.orderBy : defaultFlatFilter.orderBy,
    );
    flatStore.fetchFavoriteCount(user.id);
  }, [flatStore.page, flatStore.rowsPerPage, flatStore.currentFilter?.orderBy]);

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

  const toggleColumnVisibility = (columnName: string) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnName]: !prevVisibility[columnName],
    }));
  };

  return (
    <>
      {flatStore.loading ? null : flatStore.realEstate.length ? (
        <>
          <DataGridContainer>
            <Toolbar
              hasOpenCard={false}
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
            <FlatFavoriteTable
              columnVisibility={columnVisibility}
              setOpenedCommentDrawerId={setOpenedCommentDrawerId}
              handleOpenSnackBar={() => setIsOpenCopySnackbar(true)}
              setOpenedMakeCallDrawerId={setOpenedMakeCallDrawerId}
              setOpenedMapDrawerId={setOpenedMapDrawerId}
              setOpenedDuplicateDrawerId={setOpenedDuplicateDrawerId}
              setIsOpenDuplicateModal={setIsOpenDuplicateModal}
              statuses={catalogStore.findStatuses()}
              openCommentDrawerId={openedCommentDrawerId}
              openMakeCallDrawerId={openedMakeCallDrawerId}
              setIsMySaveCrm={setIsMySaveCrm}
              handleOpenSaveCRMSnackbar={() => setIsOpenSaveCRMSnackbar(true)}
              setIsMyDuplicate={setIsMyDuplicate}
              handleOpenDuplicateSnackbar={() => setIsOpenDuplicateSnackbar(true)}
            />
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
            {openedDuplicateDrawerId && (
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
          </DataGridContainer>
        </>
      ) : (
        <Box sx={{ marginLeft: '24px' }}>
          <NoDataNotification
            descriptionPrimary={
              flatStore.isErrorData ? NoDataMessage.NO_DATA_LOADED : NoDataMessage.SAVE_OBJECT_FAVORITES
            }
            descriptionSecondary={
              flatStore.isErrorData
                ? NoDataMessage.SAVE_OBJECT_FAVORITES
                : NoDataMessage.SAVE_OBJECT_FAVORITES_DESCRIPTION
            }
          />
        </Box>
      )}
      <Box sx={{ width: '100%' }}>
        <BorderLinearProgress visible={flatStore.loading} />
      </Box>
    </>
  );
});

export default FavoriteFlat;
