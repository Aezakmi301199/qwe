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
import DrawerObjectInfo from '../../components/drawers/drawer-object-info';
import { getCommentTitle } from '../grid/lib/get-comment-title';
import { RealEstateType } from '../../shared/enums/real-estate-type.enum';
import { formatPrice } from '../../shared/lib/format-price-number';
import Card from '../../components/containers/card-components/card';
import { observer } from 'mobx-react';
import { SocketContext } from '../../socket';
import { WsEvent } from '../../shared/enums/ws-event';
import DuplicateObjectModal from '../../components/modals/duplicate-object-modal';
import { mainStyleDoubleObjectModal } from '../../shared/styles/modal-styles';
import { useRootStore } from '../../root-store.context';
import SnackbarNotify from '../../shared/ui-kit/snackbar/snackbar-shared';
import { SnackbarMessage } from '../../shared/enums/snackbar-message';
import { defaultFlatFilter, Flat, FlatFilterType } from '../../entities/real-estate/flat';
import { CommentDrawer } from '../../entities/comment';
import { FilterFlatComponent } from '../../widgets/filter-component/filter-flat-component';
import closeIcon from '../../shared/assets/icons/closeModalIcon.svg';
import RealEstateMap, { MapRealEstateState, WidgetRealEstateMap } from '../real-estate-map/real-estate-map';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import { City } from '../../entities/city';
import { DomainSource } from '../../entities/domain';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { InitialState, PageLimit } from '../../shared/enums/pagination.enum';
import { Spinner, SpinnerUiProvider } from '../../shared/ui-kit/spinner/spinner';
import { useUser } from '../../user-context';
import { DateTime } from 'luxon';
import { flipCoordinatesByGeometry } from '../../shared/lib/geo/flip-coordinates';
import { Position } from 'geojson';
import { isGeometryViewport } from '../../shared/lib/is-geometry-viewport';
import { PostGisGeometry } from '../../shared/enums/geo/post-gis-geometry';
import { IReactionDisposer, reaction } from 'mobx';
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { MapRealEstateSettings } from '../../shared/enums/map-real-estate-settings.enum';

type FlatsProps = {
  selectedTab: TabLink;
};

const FlatCard: React.FC<FlatsProps> = observer(({ selectedTab }) => {
  const [openedMakeCallDrawerId, setOpenedMakeCallDrawerId] = useState<string | null>(null);
  const [openedCommentDrawerId, setOpenedCommentDrawerId] = useState<string | null>(null);
  const [openedDuplicateDrawerId, setOpenedDuplicateDrawerId] = useState<string | null>(null);
  const [isOpenDuplicateModal, setIsOpenDuplicateModal] = useState<boolean>(false);
  const [isOpenSaveCRMSnackbar, setIsOpenSaveCRMSnackbar] = useState<boolean>(false);
  const [isMySaveCrm, setIsMySaveCrm] = useState<boolean>(false);
  const [isOpenDuplicateSnackbar, setIsOpenDuplicateSnackbar] = useState<boolean>(false);
  const [isMyDuplicate, setIsMyDuplicate] = useState<boolean>(false);
  const user = useUser();
  const { catalogStore, cityStore, flatMapStore, flatStore } = useRootStore();
  const flatId = openedCommentDrawerId || openedMakeCallDrawerId;
  const { getItemStorage } = useLocalStorage(LocalStorageName.FLAT_FILTER);
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

    const filter = flatStore.currentFilter ??
      filterLocalStorage ?? {
        ...defaultFlatFilter,
        city: cities,
        domain: connectedDomains.map((domain: DomainSource) => domain.value),
        statusId: catalogStore.findStatuses().map((status) => status.id),
      };

    flatStore.setCurrentFilter(filter);
    flatStore.setRowsPerPage(PageLimit.FIFTEEN);
    await flatMapStore.createScriptInitializeMap(flatStore.currentFilter, user);

    if (flatMapStore.extremeValueLatAndLng) {
      await flatStore.fetchDataClusters(flatMapStore.zoom, flatMapStore.extremeValueLatAndLng);
      await flatMapStore.addClusters();
    }

    if (
      flatMapStore.geometry &&
      !isGeometryViewport(flatMapStore.geometry) &&
      flatMapStore.geometry?.type !== PostGisGeometry.POINT
    ) {
      const correctCoordinatesForLeaflet = flipCoordinatesByGeometry(flatMapStore.geometry);

      flatMapStore.addPolygonSelectedAreaToMap(correctCoordinatesForLeaflet as Position[]);
      flatMapStore.scaleMapToPolygonSelectedArea();
      flatMapStore.setStateMap(MapRealEstateState.RENDERED_AREA);
    }

    await flatStore.fetchData(DateTime.now(), flatMapStore.geometry, flatMapStore.zoom);
    setLoading(false);
  };

  useEffect(() => {
    let disposeCurrentFilter: IReactionDisposer | null;

    processingDataFilter().then(() => {
      disposeCurrentFilter = reaction(
        () => [flatStore.currentFilter, flatMapStore.geometry, flatMapStore.zoom],
        async () => {
          if (!flatStore.currentFilter || flatMapStore.state === MapRealEstateState.EMPTY) {
            return;
          }

          flatStore.setPage(InitialState.FIRST);

          if (flatMapStore.extremeValueLatAndLng) {
            await flatStore.fetchDataClusters(flatMapStore.zoom, flatMapStore.extremeValueLatAndLng);
            await flatMapStore.addClusters();
          }

          await flatStore.fetchData(DateTime.now(), flatMapStore.geometry, flatMapStore.zoom);
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

      flatMapStore.setGeometryAndZoom(undefined, MapRealEstateSettings.DEFAULT_GEO_ZOOM);
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

  const handleOpenDoubleModal = (realEstateId: string) => {
    setOpenedDuplicateDrawerId(realEstateId);
    setIsOpenDuplicateModal(true);
  };

  let flat = null;

  if (flatId) {
    flat = flatStore.findById(flatId);
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
      const isLastPage = flatStore.realEstate.length < PageLimit.FIFTEEN * flatStore.page;

      if (isLastPage) {
        return;
      }

      const isExistNextPage = await flatStore.summaryFetchData(
        flatStore.page + 1,
        flatMapStore.getZoom(),
        flatMapStore.geometry,
      );

      if (isExistNextPage) {
        flatStore.setPage(flatStore.page + 1);
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
      {!loading && <FilterFlatComponent />}
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
        {openedCommentDrawerId && flat && (
          <CommentDrawer
            commentCount={flat._count.comments}
            store={flatStore}
            realEstateId={openedCommentDrawerId}
            primaryText={getCommentTitle(RealEstateType.FLATS, flatStore.findById(openedCommentDrawerId))}
            secondaryText={formatPrice(flat.price || null)}
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
        <RealEstateMap marginRight={'0'} borderRadius={'0'} />
        {flatMapStore.state !== MapRealEstateState.EMPTY && (
          <WidgetRealEstateMap
            card={
              flatMapStore.isShowRealEstate && flatStore.realEstate.length ? (
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
                    {(flatMapStore.selectedCluster || flatMapStore.polygonSelectedArea) && (
                      <Box
                        onClick={() => {
                          flatMapStore.clearGeometryOnMarkerAndPolygon();
                        }}
                      >
                        <img src={closeIcon} alt={''} />
                      </Box>
                    )}
                  </Box>
                  <SpinnerUiProvider
                    statePending={flatStore.loading}
                    spinner={<Spinner sx={{ color: 'blue', marginTop: '300px' }} size={'20px'} />}
                    children={
                      <CardContainerBox
                        sx={getGridTemplateColumns(flatStore.realEstate.length)}
                        ref={cardContainerBoxRef}
                        onScroll={(e) => {
                          if (!flatStore.realEstate.length) {
                            return;
                          }

                          isAtEndOfContainer();
                        }}
                      >
                        {flatStore.realEstate.map((flat: Flat) => (
                          <Card
                            store={flatStore}
                            key={flat.id}
                            realEstate={flat}
                            type={RealEstateType.FLATS}
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
            mapStore={flatMapStore}
          />
        )}
      </GridMapContainer>
    </GridCardContainer>
  );
});

export default FlatCard;
