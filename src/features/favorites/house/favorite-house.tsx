import React, { useContext, useEffect, useState } from 'react';
import { ColumnVisibilityState } from '../../../shared/types/column-visibility-state';
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
import HouseFavoriteTable from './house-favorite-table';
import {
  columnNamesHouseTable,
  columnViewHouseTable,
  HouseFilterType,
  initialColumnVisibilityHouse,
} from '../../../entities/real-estate/house';
import DrawerMap from '../../../components/drawers/drawer-map';
import Toolbar from '../../../components/toolbar/toolbar';
import { TabLink } from '../../../shared/enums/tab-link.enum';
import { LocalStorageName } from '../../../shared/enums/local-storage';
import DrawerSettingsColumn from '../../../shared/ui-kit/drawer/drawer-settings-column';
import { Anchor } from '../../../shared/enums/anchor.enum';
import { Box, Divider } from '@mui/material';
import { DomainSource } from '../../../entities/domain';
import NoDataNotification from '../../../shared/ui-kit/no-data-notification/no-data-notification';
import { NoDataMessage } from '../../../shared/enums/no-data-message-enum';
import { BorderLinearProgress } from '../../../shared/ui-kit/progress/border-linear-progress';
import { useLocalStorage } from '../../../shared/hooks/use-local-storage';
import { City } from '../../../entities/city';
import { defaultFlatFilter } from '../../../entities/real-estate/flat';
import { RealEstateTypeUpperCase } from '../../../shared/enums/real-estate-type-upper-case.enum';
import { useUser } from '../../../user-context';
import { SocketContext } from '../../../socket';

const FavoriteHouse = observer(() => {
  const { houseStore, catalogStore, cityStore } = useRootStore();
  const user = useUser();
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(initialColumnVisibilityHouse);
  const [isOpenDuplicateModal, setIsOpenDuplicateModal] = useState<boolean>(false);
  const [openedMakeCallDrawerId, setOpenedMakeCallDrawerId] = useState<string | null>(null);
  const [openedCommentDrawerId, setOpenedCommentDrawerId] = useState<string | null>(null);
  const [openedDuplicateDrawerId, setOpenedDuplicateDrawerId] = useState<string | null>(null);
  const [isOpenCopySnackbar, setIsOpenCopySnackbar] = useState<boolean>(false);
  const [isMySaveCrm, setIsMySaveCrm] = useState<boolean>(false);
  const [isMyDuplicate, setIsMyDuplicate] = useState<boolean>(false);
  const [openedMapDrawerId, setOpenedMapDrawerId] = useState<string | null>(null);
  const [isOpenSaveCRMSnackbar, setIsOpenSaveCRMSnackbar] = useState<boolean>(false);
  const [isOpenDuplicateSnackbar, setIsOpenDuplicateSnackbar] = useState<boolean>(false);
  const houseId = openedCommentDrawerId || openedMakeCallDrawerId || openedMapDrawerId || openedDuplicateDrawerId;
  const { getItemStorage } = useLocalStorage(LocalStorageName.HOUSE_FILTER);

  const processingDataFilter = async () => {
    await (async () => {
      if (!catalogStore.findDomains().length) {
        await catalogStore.fetchDomains();
      }

      if (!catalogStore.findStatuses().length) {
        await catalogStore.fetchStatuses();
      }

      if (!cityStore.findCities().length) {
        await cityStore.fetchData();
      }

      if (!cityStore.findTasksByCities().length) {
        await cityStore.fetchTasksByCities(cityStore.city.map((city: City) => city.id));
      }
    })();

    const houseFilterLocalStorage: HouseFilterType = getItemStorage();
    const cities = houseFilterLocalStorage ? houseFilterLocalStorage.city : [user.workAddress.cityId];

    cities.length === 1 && (await cityStore.fetchMetroStationByCityId(cities[0]));

    const connectedDomains = cityStore.findConnectedDomainsByParams({
      city: cities,
      domains: catalogStore.findDomains(),
      realEstateType: RealEstateTypeUpperCase.HOUSE,
    });

    const filter = houseFilterLocalStorage ?? {
      ...defaultFlatFilter,
      city: cities,
      domain: connectedDomains.map((domain: DomainSource) => domain.value),
    };

    houseStore.setCurrentFilter(filter);
  };

  useEffect(() => {
    catalogStore.fetchStatuses();
    processingDataFilter();
    houseStore.fetchFavourite(
      user,
      catalogStore.domains.map((domain: DomainSource) => domain.name),
      houseStore.currentFilter?.orderBy ? houseStore.currentFilter?.orderBy : defaultFlatFilter.orderBy,
    );
    houseStore.fetchFavoriteCount(user.id);
  }, [houseStore.page, houseStore.rowsPerPage, houseStore.currentFilter?.orderBy]);

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

        houseStore.changeStatus(realEstateId, statusId, user.id);

        if (!statusId) {
          return;
        }

        houseStore.addComment({
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
        houseStore.incrementCommentCount(realEstateId);
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
        if (realEstateId === houseId) {
          houseStore.addComment({
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

        houseStore.incrementCommentCount(realEstateId);
      },
    );

  let house = null;

  if (houseId) {
    house = houseStore.findById(houseId);
  }

  const toggleColumnVisibility = (columnName: string) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnName]: !prevVisibility[columnName],
    }));
  };

  return (
    <>
      {houseStore.loading ? null : houseStore.realEstate.length ? (
        <>
          <DataGridContainer>
            <Toolbar
              hasOpenCard={false}
              store={houseStore}
              selectedTab={TabLink.HOUSES}
              filterStorageName={LocalStorageName.HOUSE_FILTER}
              renderDrawerSettingsColumn={({ stateOpenSettingsDrawer, toggleSettingsDrawer }) => (
                <DrawerSettingsColumn
                  setColumnVisibility={setColumnVisibility}
                  toggleColumnVisibility={toggleColumnVisibility}
                  state={stateOpenSettingsDrawer}
                  onClose={toggleSettingsDrawer(Anchor.ANCHOR_RIGHT, false)}
                  columnsViewCell={columnViewHouseTable}
                  columnNames={columnNamesHouseTable}
                  initialColumnVisibility={initialColumnVisibilityHouse}
                />
              )}
            />
            <Divider orientation='horizontal' sx={{ marginTop: '16px' }} />
            <HouseFavoriteTable
              columnVisibility={columnVisibility}
              setOpenedCommentDrawerId={setOpenedCommentDrawerId}
              handleOpenSnackBar={() => setIsOpenCopySnackbar(true)}
              setOpenedMakeCallDrawerId={setOpenedMakeCallDrawerId}
              setOpenedDuplicateDrawerId={setOpenedDuplicateDrawerId}
              setIsOpenDuplicateModal={setIsOpenDuplicateModal}
              setOpenedMapDrawerId={setOpenedMapDrawerId}
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
            {openedCommentDrawerId && house && (
              <CommentDrawer
                commentCount={house._count.comments}
                store={houseStore}
                realEstateId={openedCommentDrawerId}
                primaryText={getCommentTitle(RealEstateType.HOUSES, house)}
                secondaryText={`${
                  house.price ? `${formatPrice(house.price || null)} ${CurrencySymbol[house.currency]}` : 'Не указана'
                }`}
                state={{ right: true }}
                setOpenedDrawerCommentId={setOpenedCommentDrawerId}
                hideBackdrop={false}
                showHeader={true}
                isFromCallInfoDrawer={false}
              />
            )}
            {openedMakeCallDrawerId && house && (
              <DrawerObjectInfo
                store={houseStore}
                route={RealEstateType.HOUSES}
                statuses={catalogStore.findStatuses()}
                realEstateId={openedMakeCallDrawerId}
                setOpenedDrawer={setOpenedMakeCallDrawerId}
                state={{ right: true }}
              />
            )}
            {openedDuplicateDrawerId && (
              <DuplicateObjectModal
                store={houseStore}
                realEstateId={openedDuplicateDrawerId}
                open={isOpenDuplicateModal}
                onClose={() => setIsOpenDuplicateModal(false)}
                style={mainStyleDoubleObjectModal}
              />
            )}
            {openedMapDrawerId && house && (
              <DrawerMap
                setOpenedMapDrawerId={setOpenedMapDrawerId}
                state={{ right: true }}
                coordinates={{ latitude: house.latitude, longitude: house.longitude }}
              />
            )}
          </DataGridContainer>
        </>
      ) : (
        <Box sx={{ marginLeft: '24px' }}>
          <NoDataNotification
            descriptionPrimary={
              houseStore.isErrorData ? NoDataMessage.NO_DATA_LOADED : NoDataMessage.SAVE_OBJECT_FAVORITES
            }
            descriptionSecondary={
              houseStore.isErrorData
                ? NoDataMessage.SAVE_OBJECT_FAVORITES
                : NoDataMessage.SAVE_OBJECT_FAVORITES_DESCRIPTION
            }
          />
        </Box>
      )}
      <Box sx={{ width: '100%' }}>
        <BorderLinearProgress visible={houseStore.loading} />
      </Box>
    </>
  );
});

export default FavoriteHouse;
