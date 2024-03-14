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
import { observer } from 'mobx-react';
import { useRootStore } from '../../root-store.context';
import { WsEvent } from '../../shared/enums/ws-event';
import Card from '../../components/containers/card-components/card';
import { RealEstateType } from '../../shared/enums/real-estate-type.enum';
import { getCommentTitle } from '../grid/lib/get-comment-title';
import { formatPrice } from '../../shared/lib/format-price-number';
import DuplicateObjectModal from '../../components/modals/duplicate-object-modal';
import { mainStyleDoubleObjectModal } from '../../shared/styles/modal-styles';
import SnackbarNotify from '../../shared/ui-kit/snackbar/snackbar-shared';
import { SnackbarMessage } from '../../shared/enums/snackbar-message';
import { CommentDrawer } from '../../entities/comment';
import closeIcon from '../../shared/assets/icons/closeModalIcon.svg';
import { FilterHouseComponent } from '../../widgets/filter-component/filter-house-component';
import RealEstateMap, { MapRealEstateState, WidgetRealEstateMap } from '../real-estate-map/real-estate-map';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { IReactionDisposer, reaction } from 'mobx';
import { City } from '../../entities/city';
import { DomainSource } from '../../entities/domain';
import { House } from '../../entities/real-estate/house';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
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
import { TimeConvert } from '../../shared/enums/time-convert.enum';
import { MapRealEstateSettings } from '../../shared/enums/map-real-estate-settings.enum';

type HousesProps = {
  selectedTab: TabLink;
};

const HouseCard: React.FC<HousesProps> = observer(({ selectedTab }) => {
  const [openedMakeCallDrawerId, setOpenedMakeCallDrawerId] = useState<string | null>(null);
  const [openedCommentDrawerId, setOpenedCommentDrawerId] = useState<string | null>(null);
  const [openedDuplicateDrawerId, setOpenedDuplicateDrawerId] = useState<string | null>(null);
  const [isOpenDuplicateModal, setIsOpenDuplicateModal] = useState<boolean>(false);
  const [isOpenSaveCRMSnackbar, setIsOpenSaveCRMSnackbar] = useState<boolean>(false);
  const [isMySaveCrm, setIsMySaveCrm] = useState<boolean>(false);
  const [isOpenDuplicateSnackbar, setIsOpenDuplicateSnackbar] = useState<boolean>(false);
  const [isMyDuplicate, setIsMyDuplicate] = useState<boolean>(false);
  const user = useUser();
  const { catalogStore, cityStore, houseMapStore, houseStore } = useRootStore();
  const houseId = openedCommentDrawerId || openedMakeCallDrawerId;
  const { getItemStorage } = useLocalStorage(LocalStorageName.HOUSE_FILTER);
  const cardContainerBoxRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

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
    const filter = houseStore.currentFilter ??
      filterLocalStorage ?? {
        ...defaultFlatFilter,
        city: cities,
        domain: connectedDomains.map((domain: DomainSource) => domain.value),
        statusId: catalogStore.findStatuses().map((status) => status.id),
      };

    houseStore.setCurrentFilter(filter);
    houseStore.setRowsPerPage(PageLimit.FIFTEEN);
    await houseMapStore.createScriptInitializeMap(houseStore.currentFilter, user);

    if (houseMapStore.extremeValueLatAndLng) {
      await houseStore.fetchDataClusters(houseMapStore.zoom, houseMapStore.extremeValueLatAndLng);
      await houseMapStore.addClusters();
    }

    if (
      houseMapStore.geometry &&
      !isGeometryViewport(houseMapStore.geometry) &&
      houseMapStore.geometry?.type !== PostGisGeometry.POINT
    ) {
      const correctCoordinatesForLeaflet = flipCoordinatesByGeometry(houseMapStore.geometry);

      houseMapStore.addPolygonSelectedAreaToMap(correctCoordinatesForLeaflet as Position[]);
      houseMapStore.scaleMapToPolygonSelectedArea();
      houseMapStore.setStateMap(MapRealEstateState.RENDERED_AREA);
    }

    await houseStore.fetchData(DateTime.now(), houseMapStore.geometry, houseMapStore.zoom);
    setLoading(false);
  };

  useEffect(() => {
    let disposeCurrentFilter: IReactionDisposer | null;

    processingDataFilter().then(() => {
      disposeCurrentFilter = reaction(
        () => [houseStore.currentFilter, houseMapStore.geometry, houseMapStore.zoom],
        async () => {
          if (!houseStore.currentFilter || houseMapStore.state === MapRealEstateState.EMPTY) {
            return;
          }

          houseStore.setPage(InitialState.FIRST);

          if (houseMapStore.extremeValueLatAndLng) {
            await houseStore.fetchDataClusters(houseMapStore.zoom, houseMapStore.extremeValueLatAndLng);
            await houseMapStore.addClusters();
          }

          await houseStore.fetchData(DateTime.now(), houseMapStore.geometry, houseMapStore.zoom);
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

      houseMapStore.setGeometryAndZoom(undefined, MapRealEstateSettings.DEFAULT_GEO_ZOOM);
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

  const handleOpenDoubleModal = (realEstateId: string) => {
    setOpenedDuplicateDrawerId(realEstateId);
    setIsOpenDuplicateModal(true);
  };

  let house = null;

  if (houseId) {
    house = houseStore.findById(houseId);
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
      const isLastPage = houseStore.realEstate.length < PageLimit.FIFTEEN * houseStore.page;

      if (isLastPage) {
        return;
      }

      const isExistNextPage = await houseStore.summaryFetchData(
        houseStore.page + 1,
        houseMapStore.getZoom(),
        houseMapStore.geometry,
      );

      if (isExistNextPage) {
        houseStore.setPage(houseStore.page + 1);
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
      {!loading && <FilterHouseComponent />}
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
        {openedCommentDrawerId && house && (
          <CommentDrawer
            commentCount={house._count.comments}
            store={houseStore}
            realEstateId={openedCommentDrawerId}
            primaryText={getCommentTitle(RealEstateType.HOUSES, houseStore.findById(openedCommentDrawerId))}
            secondaryText={formatPrice(house.price || null)}
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
        <RealEstateMap marginRight={'0'} borderRadius={'0'} />
        {houseMapStore.state !== MapRealEstateState.EMPTY && (
          <WidgetRealEstateMap
            card={
              houseMapStore.isShowRealEstate && houseStore.realEstate.length ? (
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
                    {(houseMapStore.selectedCluster || houseMapStore.polygonSelectedArea) && (
                      <Box
                        onClick={() => {
                          houseMapStore.clearGeometryOnMarkerAndPolygon();
                        }}
                      >
                        <img src={closeIcon} alt={''} />
                      </Box>
                    )}
                  </Box>
                  <SpinnerUiProvider
                    statePending={houseStore.loading}
                    spinner={<Spinner sx={{ color: 'blue', marginTop: '300px' }} size={'20px'} />}
                    children={
                      <CardContainerBox
                        sx={getGridTemplateColumns(houseStore.realEstate.length)}
                        ref={cardContainerBoxRef}
                        onScroll={(e) => {
                          if (!houseStore.realEstate.length) {
                            return;
                          }

                          isAtEndOfContainer();
                        }}
                      >
                        {houseStore.realEstate.map((house: House) => (
                          <Card
                            store={houseStore}
                            key={house.id}
                            realEstate={house}
                            type={RealEstateType.HOUSES}
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
            mapStore={houseMapStore}
          />
        )}
      </GridMapContainer>
    </GridCardContainer>
  );
});

export default HouseCard;
