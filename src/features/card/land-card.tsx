import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, SxProps } from '@mui/material';
import { Size } from '../../shared/enums/size.enum';
import tableIcon from '../../shared/assets/icons/tableIcon.svg';
import {
  CardContainer,
  CardContainerBox,
  CardTableButton,
  GridCardContainer,
  GridMapContainer,
  Text,
} from '../../shared/styles/styles';
import { FontFamily } from '../../shared/enums/font-family.enum';
import { FontSize } from '../../shared/enums/font-size.enum';
import { FontWeight } from '../../shared/enums/font-weight.enum';
import { Link } from 'react-router-dom';
import { TabLink } from '../../shared/enums/tab-link.enum';
import { getPath } from '../../shared/lib/get-path';
import { observer } from 'mobx-react';
import { useRootStore } from '../../root-store.context';
import { WsEvent } from '../../shared/enums/ws-event';
import Card from '../../components/containers/card-components/card';
import { RealEstateType } from '../../shared/enums/real-estate-type.enum';
import { getCommentTitle } from '../grid/lib/get-comment-title';
import { formatPrice } from '../../shared/lib/format-price-number';
import DrawerObjectInfo from '../../components/drawers/drawer-object-info';
import DuplicateObjectModal from '../../components/modals/duplicate-object-modal';
import { mainStyleDoubleObjectModal } from '../../shared/styles/modal-styles';
import SnackbarNotify from '../../shared/ui-kit/snackbar/snackbar-shared';
import { SnackbarMessage } from '../../shared/enums/snackbar-message';
import { CommentDrawer } from '../../entities/comment';
import closeIcon from '../../shared/assets/icons/closeModalIcon.svg';
import { FilterLandComponent } from '../../widgets/filter-component/filter-land-component';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import RealEstateMap, { MapRealEstateState, WidgetRealEstateMap } from '../real-estate-map/real-estate-map';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { City } from '../../entities/city';
import { DomainSource } from '../../entities/domain';
import { Land } from '../../entities/real-estate/land';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { IReactionDisposer, reaction } from 'mobx';
import { InitialState, PageLimit } from '../../shared/enums/pagination.enum';
import { Spinner, SpinnerUiProvider } from '../../shared/ui-kit/spinner/spinner';
import { useUser } from '../../user-context';
import { SocketContext } from '../../socket';
import { defaultFlatFilter, FlatFilterType } from '../../entities/real-estate/flat';
import { isGeometryViewport } from '../../shared/lib/is-geometry-viewport';
import { PostGisGeometry } from '../../shared/enums/geo/post-gis-geometry';
import { flipCoordinatesByGeometry } from '../../shared/lib/geo/flip-coordinates';
import { Position } from 'geojson';
import { DateTime } from 'luxon';
import { MapRealEstateSettings } from '../../shared/enums/map-real-estate-settings.enum';

type LandsProps = {
  selectedTab: TabLink;
};

const LandCard: React.FC<LandsProps> = observer(({ selectedTab }) => {
  const [openedMakeCallDrawerId, setOpenedMakeCallDrawerId] = useState<string | null>(null);
  const [openedCommentDrawerId, setOpenedCommentDrawerId] = useState<string | null>(null);
  const [openedDuplicateDrawerId, setOpenedDuplicateDrawerId] = useState<string | null>(null);
  const [isOpenDuplicateModal, setIsOpenDuplicateModal] = useState<boolean>(false);
  const [isOpenSaveCRMSnackbar, setIsOpenSaveCRMSnackbar] = useState<boolean>(false);
  const [isMySaveCrm, setIsMySaveCrm] = useState<boolean>(false);
  const [isOpenDuplicateSnackbar, setIsOpenDuplicateSnackbar] = useState<boolean>(false);
  const [isMyDuplicate, setIsMyDuplicate] = useState<boolean>(false);
  const user = useUser();
  const { catalogStore, cityStore, landMapStore, landStore } = useRootStore();
  const landId = openedCommentDrawerId || openedMakeCallDrawerId;
  const { getItemStorage } = useLocalStorage(LocalStorageName.LAND_FILTER);
  const cardContainerBoxRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const processingDataFilter = async () => {
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

    const filterLocalStorage: FlatFilterType = getItemStorage();
    const cities = filterLocalStorage ? filterLocalStorage.city : [user.workAddress.cityId];

    cities.length === 1 && (await cityStore.fetchMetroStationByCityId(cities[0]));

    const connectedDomains = cityStore.findConnectedDomainsByParams({
      city: cities,
      domains: catalogStore.findDomains(),
      realEstateType: RealEstateTypeUpperCase.FLAT,
    });
    const filter = landStore.currentFilter ??
      filterLocalStorage ?? {
        ...defaultFlatFilter,
        city: cities,
        domain: connectedDomains.map((domain: DomainSource) => domain.value),
        statusId: catalogStore.findStatuses().map((status) => status.id),
      };

    landStore.setCurrentFilter(filter);
    landStore.setRowsPerPage(PageLimit.FIFTEEN);
    await landMapStore.createScriptInitializeMap(landStore.currentFilter, user);

    if (landMapStore.extremeValueLatAndLng) {
      await landStore.fetchDataClusters(landMapStore.zoom, landMapStore.extremeValueLatAndLng);
      await landMapStore.addClusters();
    }

    if (
      landMapStore.geometry &&
      !isGeometryViewport(landMapStore.geometry) &&
      landMapStore.geometry?.type !== PostGisGeometry.POINT
    ) {
      const correctCoordinatesForLeaflet = flipCoordinatesByGeometry(landMapStore.geometry);

      landMapStore.addPolygonSelectedAreaToMap(correctCoordinatesForLeaflet as Position[]);
      landMapStore.scaleMapToPolygonSelectedArea();
      landMapStore.setStateMap(MapRealEstateState.RENDERED_AREA);
    }

    await landStore.fetchData(DateTime.now(), landMapStore.geometry, landMapStore.zoom);
    setLoading(false);
  };

  useEffect(() => {
    let disposeCurrentFilter: IReactionDisposer | null;

    processingDataFilter().then(() => {
      disposeCurrentFilter = reaction(
        () => [landStore.currentFilter, landMapStore.geometry, landMapStore.zoom],
        async () => {
          if (!landStore.currentFilter || landMapStore.state === MapRealEstateState.EMPTY) {
            return;
          }

          landStore.setPage(InitialState.FIRST);

          if (landMapStore.extremeValueLatAndLng) {
            await landStore.fetchDataClusters(landMapStore.zoom, landMapStore.extremeValueLatAndLng);
            await landMapStore.addClusters();
          }

          await landStore.fetchData(DateTime.now(), landMapStore.geometry, landMapStore.zoom);
        },
        {
          fireImmediately: false,
          delay: 100 * TimeConvert.MILLISECONDS_IN_MILLISECONDS,
        },
      );
    });

    return () => {
      if (disposeCurrentFilter) {
        disposeCurrentFilter();
      }

      landMapStore.setGeometryAndZoom(undefined, MapRealEstateSettings.DEFAULT_GEO_ZOOM);
    };
  }, []);

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

  const handleOpenDoubleModal = (realEstateId: string) => {
    setOpenedDuplicateDrawerId(realEstateId);
    setIsOpenDuplicateModal(true);
  };

  let land = null;

  if (landId) {
    land = landStore.findById(landId);
  }

  const isAtEndOfContainer = async () => {
    const container = cardContainerBoxRef.current; // Получаем ссылку на контейнер

    if (!container) {
      return;
    }

    const containerHeight = container.offsetHeight; // Высота контейнера
    const scrollTop = container.scrollTop; // Текущая прокрутка контейнера
    const scrollHeight = container.scrollHeight; // Всего прокручиваемая высота контента в контейнере
    const measurementErrorPx = 10;
    const isEndContainer = containerHeight + scrollTop + measurementErrorPx >= scrollHeight;

    if (isEndContainer) {
      const isLastPage = landStore.realEstate.length < PageLimit.FIFTEEN * landStore.page;

      if (isLastPage) {
        return;
      }

      const isExistNextPage = await landStore.summaryFetchData(
        landStore.page + 1,
        landMapStore.getZoom(),
        landMapStore.geometry,
      );

      if (isExistNextPage) {
        landStore.setPage(landStore.page + 1);
      }
    }
  };

  const getGridTemplateColumns = (countRealEstate: number) => {
    const maxCountColumn = 2;

    const counter = countRealEstate > maxCountColumn ? maxCountColumn : countRealEstate;

    return {
      gridTemplateColumns: `repeat(${counter}, 1fr)`,
    } as SxProps;
  };

  return (
    <GridCardContainer display={loading ? 'none' : 'flex'}>
      {!loading && <FilterLandComponent />}
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
      <GridMapContainer>
        {openedCommentDrawerId && land && (
          <CommentDrawer
            commentCount={land._count.comments}
            store={landStore}
            realEstateId={openedCommentDrawerId}
            primaryText={getCommentTitle(RealEstateType.LANDS, landStore.findById(openedCommentDrawerId))}
            secondaryText={formatPrice(land.price || null)}
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
        <RealEstateMap marginRight={'0'} borderRadius={'0'} />
        {landMapStore.state !== MapRealEstateState.EMPTY && (
          <WidgetRealEstateMap
            card={
              landMapStore.isShowRealEstate && landStore.realEstate.length ? (
                <CardContainer zIndex={2}>
                  <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Link to={getPath(selectedTab)}>
                      <CardTableButton variant={'outlined'} color={'inherit'} size={Size.MEDIUM}>
                        <img alt={''} src={tableIcon} width={'20px'} height={'20px'} />
                        <Text
                          sx={{
                            whiteSpace: 'nowrap',
                            fontFamily: FontFamily.ROBOTO,
                            fontSize: FontSize.FOURTEENTH_FONT,
                            fontWeight: FontWeight.MEDIUM,
                          }}
                        >
                          Показать списком
                        </Text>
                      </CardTableButton>
                    </Link>
                    {(landMapStore.selectedCluster || landMapStore.polygonSelectedArea) && (
                      <Box
                        onClick={() => {
                          landMapStore.clearGeometryOnMarkerAndPolygon();
                        }}
                      >
                        <img src={closeIcon} alt={''} />
                      </Box>
                    )}
                  </Box>
                  <SpinnerUiProvider
                    statePending={landStore.loading}
                    spinner={<Spinner sx={{ color: 'blue', marginTop: '300px' }} size={'20px'} />}
                    children={
                      <CardContainerBox
                        sx={getGridTemplateColumns(landStore.realEstate.length)}
                        ref={cardContainerBoxRef}
                        onScroll={(e) => {
                          if (!landStore.realEstate.length) {
                            return;
                          }

                          isAtEndOfContainer();
                        }}
                      >
                        {landStore.realEstate.map((lands: Land) => (
                          <Card
                            store={landStore}
                            key={lands.id}
                            realEstate={lands}
                            type={RealEstateType.LANDS}
                            setOpenedMakeCallDrawerId={setOpenedMakeCallDrawerId}
                            setOpenedCommentDrawerId={setOpenedCommentDrawerId}
                            handleOpenDoubleModal={handleOpenDoubleModal}
                            openMakeCallDrawerId={openedMakeCallDrawerId}
                            openCommentDrawerId={openedCommentDrawerId}
                            setIsOpenSaveCRMSnackbar={setIsOpenSaveCRMSnackbar}
                            setIsMySaveCrm={setIsMySaveCrm}
                            handleOpenDuplicateSnackbar={() => setIsOpenDuplicateSnackbar(true)}
                            setIsMyDuplicate={setIsMyDuplicate}
                            setIsOpenDuplicateModal={setIsOpenDuplicateModal}
                          />
                        ))}
                      </CardContainerBox>
                    }
                  />
                </CardContainer>
              ) : (
                <Link to={getPath(selectedTab)}>
                  <CardTableButton
                    variant={'outlined'}
                    color={'inherit'}
                    size={Size.MEDIUM}
                    sx={{
                      background: 'white',
                      zIndex: 2,
                      marginLeft: '16px',
                      marginTop: '16px',
                      '&:hover': {
                        background: 'white',
                      },
                    }}
                  >
                    <img alt={''} src={tableIcon} width={'20px'} height={'20px'} />
                    <Text
                      sx={{
                        whiteSpace: 'nowrap',
                        fontFamily: FontFamily.ROBOTO,
                        fontSize: FontSize.FOURTEENTH_FONT,
                        fontWeight: FontWeight.MEDIUM,
                      }}
                    >
                      Показать списком
                    </Text>
                  </CardTableButton>
                </Link>
              )
            }
            mapStore={landMapStore}
          />
        )}
      </GridMapContainer>
    </GridCardContainer>
  );
});

export default LandCard;
