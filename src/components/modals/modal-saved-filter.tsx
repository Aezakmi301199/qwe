import React, { useState } from 'react';
import { Box, Button, Checkbox, TextField, Typography, useTheme } from '@mui/material';
import { FontSize } from '../../shared/enums/font-size.enum';
import { FontFamily } from '../../shared/enums/font-family.enum';
import { FontWeight } from '../../shared/enums/font-weight.enum';
import { SaveFilterButton, ShowOnlyUniqueObjectsBox } from '../../shared/styles/styles';
import editIcon from '../../shared/assets/icons/editIcon.svg';
import deleteIcon from '../../shared/assets/icons/deleteIcon.svg';
import { observer } from 'mobx-react';
import { useRootStore } from '../../root-store.context';
import { useUserStore } from '../../user-store.context';
import { ModalTab } from '../../shared/enums/modal-tab.enum';
import { InitialState } from '../../shared/enums/pagination.enum';
import { useUser } from '../../user-context';
import { RealEstateFilters } from '../../entities/user/model/type';
import { defaultFlatFilter, Flat, FlatFilterType } from '../../entities/real-estate/flat';
import { defaultHouseFilter, House, HouseFilterType } from '../../entities/real-estate/house';
import { defaultLandFilter, Land, LandFilterType } from '../../entities/real-estate/land';
import { Store } from '../../shared/lib/store';
import { useNavigate } from 'react-router-dom';
import { PagePath } from '../../shared/enums/page-path';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { RealEstateTypeUpperCase } from '../../shared/enums/real-estate-type-upper-case.enum';
import SubscriptionModal from './subscription-modal';
import { numberToString } from '../../shared/lib/spy-object-by-field-value';
import { MapRealEstateState } from '../../features/real-estate-map/real-estate-map';
import { generateFilterSecondaryText } from '../../shared/lib/generate-filter-secondary-text';

type SavedFilterListProps = {
  filter: RealEstateFilters<FlatFilterType | HouseFilterType | LandFilterType>;
  isCheckboxDisabled?: boolean;
  handleDeleteFilter: (filterId: string) => void;
  setCurrentTab?: React.Dispatch<React.SetStateAction<number>>;
  realEstateStore: Store<Flat | House | Land>;
  handleClose: () => void;
  isRecentlyAdded: boolean;
};

const UISavedFilterList: React.FC<SavedFilterListProps> = observer(
  ({
    filter,
    isCheckboxDisabled,
    setCurrentTab,
    handleDeleteFilter,
    realEstateStore,
    handleClose,
    isRecentlyAdded,
  }) => {
    const theme = useTheme();
    const [filterToDelete, setFilterToDelete] = useState<boolean>(false);
    const { catalogStore, cityStore, flatMapStore, houseMapStore, landMapStore } = useRootStore();
    const user = useUser();
    const userStore = useUserStore();
    const [isNameFocused, setIsNamedFocused] = useState<boolean>(isRecentlyAdded);
    const [newName, setNewName] = useState<string>('');
    const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const realEstateParamsMap = {
      [RealEstateTypeUpperCase.FLAT]: {
        defaultFilter: defaultFlatFilter,
        localStorageName: LocalStorageName.FLAT_FILTER,
        navigate: PagePath.FLATS,
        navigateMap: PagePath.FLATS_MAP,
        mapStore: flatMapStore,
      },
      [RealEstateTypeUpperCase.HOUSE]: {
        defaultFilter: defaultHouseFilter,
        localStorageName: LocalStorageName.HOUSE_FILTER,
        navigate: PagePath.HOUSES,
        navigateMap: PagePath.HOUSES_MAP,
        mapStore: houseMapStore,
      },
      [RealEstateTypeUpperCase.LAND]: {
        defaultFilter: defaultLandFilter,
        localStorageName: LocalStorageName.LAND_FILTER,
        navigate: PagePath.LANDS,
        navigateMap: PagePath.LANDS_MAP,
        mapStore: landMapStore,
      },
    };

    const { setItemStorage } = useLocalStorage(realEstateParamsMap[filter.realEstateType].localStorageName);
    const isDefaultUser = user.subscriptionPlan.isDefault;
    const onCheckboxClick = () => {
      if (isDefaultUser && !filter.isNotificationEnabled) {
        setShowSubscriptionModal(true);

        return;
      }

      userStore
        .updateFilter({
          filter: filter,
          name: filter.name,
          realEstateType: filter.realEstateType,
          isNotificationEnabled: !filter.isNotificationEnabled,
        })
        .then(() => {
          filter.isNotificationEnabled = !filter.isNotificationEnabled;
        });
    };

    return (
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        sx={{
          backgroundColor: 'white',
          borderRadius: '0px',
          boxShadow: 'none',
          padding: '12px 16px',
          height: '55px',
          border: 'none',
          borderBottom: '1px solid #E5E5E5',
        }}
      >
        <Box padding={'0px'} width={'100%'}>
          {!isNameFocused ? (
            <Box display={'flex'} flexDirection={'column'} width={'519px'}>
              <Typography
                sx={{ cursor: 'pointer' }}
                fontSize={FontSize.SIXTEENTH_FONT}
                fontFamily={FontFamily.ROBOTO}
                fontWeight={FontWeight.MEDIUM}
                color={theme.palette.primary.main}
                onClick={async () => {
                  const { zoom, geometry, ...restFilter } = filter.params;
                  const newFilter = { ...realEstateParamsMap[filter.realEstateType].defaultFilter, ...restFilter };

                  realEstateStore.setCurrentFilter(
                    numberToString(newFilter) as FlatFilterType | HouseFilterType | LandFilterType,
                  );
                  handleClose();
                  setItemStorage(numberToString(newFilter));

                  if (geometry && zoom) {
                    realEstateParamsMap[filter.realEstateType].mapStore.setGeometryAndZoom(geometry, zoom);

                    if (realEstateParamsMap[filter.realEstateType].mapStore.mapRef) {
                      await realEstateParamsMap[filter.realEstateType].mapStore.reRenderMap(restFilter, user);
                      realEstateParamsMap[filter.realEstateType].mapStore.setStateMap(MapRealEstateState.RENDERED_AREA);
                    }

                    navigate(realEstateParamsMap[filter.realEstateType].navigateMap);

                    return;
                  }

                  navigate(realEstateParamsMap[filter.realEstateType].navigate);
                }}
              >
                {filter.name}
              </Typography>
              <Typography
                sx={{ height: '40px', width: '520px' }}
                fontSize={FontSize.TWELFTH_FONT}
                fontFamily={FontFamily.ROBOTO}
                fontWeight={FontWeight.REGULAR}
                color={theme.palette.text.secondary}
                textOverflow={'ellipsis'}
                overflow={'hidden'}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                }}
                title={generateFilterSecondaryText(
                  filter,
                  catalogStore.findDomains(),
                  cityStore.findCitiesByIds(filter.params.city),
                )}
              >
                {generateFilterSecondaryText(
                  filter,
                  catalogStore.findDomains(),
                  cityStore.findCitiesByIds(filter.params.city),
                )}
              </Typography>
            </Box>
          ) : (
            <TextField
              id={filter.id}
              size={'small'}
              sx={{ width: '100%' }}
              InputProps={{
                sx: {
                  border: 'none',
                  borderRadius: '8px',
                  height: '40px',
                },
              }}
              inputProps={{ maxlength: InitialState.FIFTEEN }}
              variant='outlined'
              autoFocus
              label={filter.name}
              onChange={(event) => setNewName(event.target.value)}
            />
          )}
        </Box>
        {!filterToDelete ? (
          <Box display={'flex'} gap={'21px'}>
            {!isNameFocused ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '16px' }}>
                <Checkbox
                  onClick={() => onCheckboxClick()}
                  disabled={isCheckboxDisabled}
                  color={'primary'}
                  checked={filter.isNotificationEnabled}
                />
                <ShowOnlyUniqueObjectsBox color={isCheckboxDisabled ? `${theme.palette.text.disabled} !important` : ''}>
                  Подписаться
                </ShowOnlyUniqueObjectsBox>
              </Box>
            ) : null}
            {!isNameFocused ? (
              <Box display={'flex'} gap={'10px'}>
                <img alt={''} src={editIcon} onClick={() => setIsNamedFocused(true)} />
                <img alt={''} src={deleteIcon} onClick={() => setFilterToDelete(true)} />
              </Box>
            ) : (
              <Box display={'flex'} gap={'10px'}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '16px' }}>
                  <Checkbox
                    onClick={() => onCheckboxClick()}
                    disabled={isCheckboxDisabled}
                    color={'primary'}
                    checked={filter.isNotificationEnabled}
                  />
                  <ShowOnlyUniqueObjectsBox
                    color={isCheckboxDisabled ? `${theme.palette.text.disabled} !important` : ''}
                  >
                    Подписаться
                  </ShowOnlyUniqueObjectsBox>
                </Box>
                <SaveFilterButton
                  size={'large'}
                  onClick={(event) => {
                    event.preventDefault();
                    setIsNamedFocused(false);

                    if (isRecentlyAdded) {
                      userStore.isFilterRecentlyAdded = false;
                    }

                    if (newName.trim() !== '') {
                      userStore
                        .updateFilter({
                          filter: filter,
                          name: newName,
                          realEstateType: filter.realEstateType,
                          isNotificationEnabled: filter.isNotificationEnabled,
                        })
                        .then(() => {
                          filter.name = newName;
                        });
                    }
                  }}
                  variant={'contained'}
                >
                  Сохранить
                </SaveFilterButton>
              </Box>
            )}
          </Box>
        ) : (
          <Box display={'flex'} gap={'8px'}>
            <Button
              sx={{
                height: '30px',
                width: '69px',
                borderRadius: '8px',
                textTransform: 'none',
                border: '1px solid gray',
                fontSize: FontSize.THIRTEENTH_FONT,
              }}
              color={'inherit'}
              variant={'outlined'}
              onClick={() => setFilterToDelete(false)}
            >
              Отмена
            </Button>
            <Button
              sx={{
                height: '30px',
                width: '74px',
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: FontSize.THIRTEENTH_FONT,
              }}
              color='error'
              variant={'outlined'}
              onClick={() => {
                setFilterToDelete(false);
                handleDeleteFilter(filter.id);

                if (userStore.userFilters.length === 1 && setCurrentTab) {
                  setCurrentTab(ModalTab.FILTERS);
                }
              }}
            >
              Удалить
            </Button>
          </Box>
        )}
        <SubscriptionModal isOpen={showSubscriptionModal} handleClose={() => setShowSubscriptionModal(false)} />
      </Box>
    );
  },
);

export default UISavedFilterList;
