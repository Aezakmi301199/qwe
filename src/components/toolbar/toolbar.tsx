import React, { ReactElement, useState } from 'react';
import { MenuItem, Select, ToggleButtonGroup, useTheme } from '@mui/material';
import {
  ItemsCenterContainer,
  MapTableButton,
  SelectContainer,
  SelectItemsContainer,
  Text,
  ToggleButtonComponent,
  ToolbarContainer,
} from '../../shared/styles/styles';
import tableSettingsIcon from '../../shared/assets/icons/tableSettingsIcon.svg';
import mapIcon from '../../shared/assets/icons/mapIcon.svg';
import { Anchor } from '../../shared/enums/anchor.enum';
import { FontSize } from '../../shared/enums/font-size.enum';
import { FontWeight } from '../../shared/enums/font-weight.enum';
import { DrawerPositionRight } from '../../shared/types/drawer-position';
import { FontFamily } from '../../shared/enums/font-family.enum';
import { Size } from '../../shared/enums/size.enum';
import { Link } from 'react-router-dom';
import { getPath } from '../../shared/lib/get-path';
import { TabLink } from '../../shared/enums/tab-link.enum';
import { Store } from '../../shared/lib/store';
import { Flat, FlatFilters } from '../../entities/real-estate/flat';
import { House } from '../../entities/real-estate/house';
import { Land } from '../../entities/real-estate/land';
import { PagePath } from '../../shared/enums/page-path';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ShortTypeOrderBy, SortOrder, TypeOrderBy } from '../../shared/enums/type-order-by';
import { observer } from 'mobx-react';
import { InitialState } from '../../shared/enums/pagination.enum';
import { LocalStorageName } from '../../shared/enums/local-storage';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';

const RIGHT_DRAWER_STATE = {
  right: false,
};

type ToolbarProps = {
  selectedTab: TabLink;
  store: Store<Flat | House | Land>;
  renderDrawerSettingsColumn: ({
    stateOpenSettingsDrawer,
    toggleSettingsDrawer,
  }: {
    stateOpenSettingsDrawer: DrawerPositionRight;
    toggleSettingsDrawer: (
      anchor: Anchor.ANCHOR_RIGHT,
      open: boolean,
    ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  }) => ReactElement;
  filterStorageName: LocalStorageName;
  hasOpenCard: boolean;
};

const getSelectContainerValue = (orderByValue: TypeOrderBy | undefined) => {
  if (!orderByValue) {
    return ShortTypeOrderBy.PUBLISHED_AT;
  }

  if (orderByValue.includes(ShortTypeOrderBy.PRICE)) {
    return ShortTypeOrderBy.PRICE;
  }

  return ShortTypeOrderBy.PUBLISHED_AT;
};

const objectOrderBy: Record<ShortTypeOrderBy, Record<SortOrder, TypeOrderBy>> = {
  price: { asc: TypeOrderBy.PRICE_ASC, desc: TypeOrderBy.PRICE_DESC },
  publishedAt: { asc: TypeOrderBy.PUBLISHED_AT_ASC, desc: TypeOrderBy.PUBLISHED_AT_DESC },
};

const getSortOrderValue = (orderByValue: TypeOrderBy | undefined) => {
  if (!orderByValue) {
    return '';
  }

  const regexSortOrder = /_(.*)$/;
  const match = orderByValue.match(regexSortOrder);

  if (match) {
    return match[1];
  }

  return SortOrder.DESC;
};

const universalFilterOptions = [
  { value: ShortTypeOrderBy.PRICE, name: 'Цена' },
  { value: ShortTypeOrderBy.PUBLISHED_AT, name: 'Опубликован' },
];

const Toolbar: React.FC<ToolbarProps> = ({
  selectedTab,
  store,
  renderDrawerSettingsColumn,
  filterStorageName,
  hasOpenCard,
}) => {
  const theme = useTheme();
  const [stateOpenSettingsDrawer, setStateOpenSettingsDrawer] = useState<DrawerPositionRight>(RIGHT_DRAWER_STATE);
  const [universalFilterBy, setUniversalFilterBy] = useState<ShortTypeOrderBy>(
    getSelectContainerValue(store.currentFilter?.orderBy),
  );
  const [sortOrderBy, setSortOrderBy] = useState<string>(
    getSortOrderValue(store.currentFilter?.orderBy || TypeOrderBy.PUBLISHED_AT_DESC),
  );
  const { setItemStorage } = useLocalStorage(filterStorageName);

  const toggleSettingsDrawer =
    (anchor: Anchor.ANCHOR_RIGHT, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      event.stopPropagation();
      setStateOpenSettingsDrawer({
        ...stateOpenSettingsDrawer,
        [anchor]: open,
      });
    };

  return (
    <ToolbarContainer>
      <ItemsCenterContainer>
        {hasOpenCard ? (
          <Link to={getPath(selectedTab) + PagePath.MAP}>
            <MapTableButton variant='outlined' color='inherit' size={Size.MEDIUM}>
              <img alt={''} src={mapIcon} />
              <Text
                sx={{
                  whiteSpace: 'nowrap',
                  fontFamily: FontFamily.ROBOTO,
                  fontSize: FontSize.FOURTEENTH_FONT,
                  fontWeight: FontWeight.MEDIUM,
                }}
              >
                Показать на карте
              </Text>
            </MapTableButton>
          </Link>
        ) : null}
      </ItemsCenterContainer>
      <SelectContainer>
        <SelectItemsContainer>
          <Select
            sx={{
              height: '35px',
              borderTopRightRadius: '0px',
              borderTopLeftRadius: '8px',
              borderRight: 'none',
              borderBottomRightRadius: '0px',
              fontSize: '14px',
              width: '150px',
              borderBottomLeftRadius: '8px',
              '& fieldset': {
                borderRight: 'none',
                borderColor: 'rgba(0, 0, 0, 0.12)',
              },
              '& .MuiSelect-select.MuiSelect-select': {
                paddingRight: '35px',
              },
            }}
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={universalFilterBy}
            onChange={(e) => {
              const value = e.target.value as ShortTypeOrderBy;

              setUniversalFilterBy(value);
              setSortOrderBy(SortOrder.DESC);
              store.changeValueByCurrentFilter(FlatFilters.ORDER_BY, objectOrderBy[value][SortOrder.DESC]);
              setItemStorage(store.currentFilter);
              store.setPage(InitialState.FIRST);
            }}
          >
            {universalFilterOptions.map((option: { value: string; name: string }) => (
              <MenuItem sx={{ width: '215px' }} value={option.value} key={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
          <ToggleButtonGroup
            value={sortOrderBy}
            exclusive
            onChange={(e, newValueSort) => {
              if (!newValueSort) {
                return;
              }

              const valueSort = newValueSort as SortOrder;

              setSortOrderBy(newValueSort);
              store.changeValueByCurrentFilter(FlatFilters.ORDER_BY, objectOrderBy[universalFilterBy][valueSort]);
              setItemStorage(store.currentFilter);
              store.setPage(InitialState.FIRST);
            }}
          >
            <ToggleButtonComponent
              value={SortOrder.DESC}
              aria-label='centered'
              sx={{
                height: '35px',
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '8px',
                borderBottomLeftRadius: '0px',
                borderBottomRightRadius: '8px',
              }}
            >
              <ArrowDownwardIcon
                sx={{
                  fontSize: '20px',
                  color: sortOrderBy === SortOrder.DESC ? theme.palette.primary.dark : '',
                }}
              />
            </ToggleButtonComponent>
            <ToggleButtonComponent value={SortOrder.ASC} aria-label='centered' sx={{ height: '35px' }}>
              <ArrowUpwardIcon
                sx={{
                  fontSize: '20px',
                  color: sortOrderBy === SortOrder.ASC ? theme.palette.primary.dark : '',
                }}
              />
            </ToggleButtonComponent>
          </ToggleButtonGroup>
        </SelectItemsContainer>
        <MapTableButton
          onClick={toggleSettingsDrawer(Anchor.ANCHOR_RIGHT, true)}
          variant='outlined'
          color='inherit'
          size={Size.MEDIUM}
        >
          <img alt={''} src={tableSettingsIcon} />
          <Text
            sx={{
              whiteSpace: 'nowrap',
              fontFamily: FontFamily.ROBOTO,
              fontSize: FontSize.FOURTEENTH_FONT,
              fontWeight: FontWeight.MEDIUM,
            }}
          >
            Настроить столбцы
          </Text>
        </MapTableButton>
        {renderDrawerSettingsColumn({ stateOpenSettingsDrawer, toggleSettingsDrawer })}
      </SelectContainer>
    </ToolbarContainer>
  );
};

export default observer(Toolbar);
