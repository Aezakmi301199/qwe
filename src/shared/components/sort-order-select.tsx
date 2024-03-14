import { Select, MenuItem, ToggleButtonGroup, SxProps } from '@mui/material';
import React, { useState } from 'react';
import { theme } from '../../app/providers/theme';
import { SortOrder } from '../enums/type-order-by';
import { SelectItemsContainer, ToggleButtonComponent } from '../styles/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { FontFamily } from '../enums/font-family.enum';
import { capitalizeString } from '../lib/string/capitalize-string';

type SortOrderSelectProps = {
  value: string;
  selectOptions: {
    value: string;
    name: string;
  }[];
  onChangeSelectHandle(shortOrderBy: string, sortOrder: SortOrder): void;
  onChangeSortOrderHandle(shortOrderBy: string, sortOrder: SortOrder): void;
  height: string;
  sx?: SxProps;
};

const getSortOrderValue = (value: string): SortOrder => {
  const loverValue = value.toLocaleLowerCase();

  return loverValue.includes(SortOrder.ASC) ? SortOrder.ASC : SortOrder.DESC;
};

const getShortOrder = (value: string): string => {
  return value
    .replace(SortOrder.ASC, '')
    .replace(capitalizeString(SortOrder.ASC), '')
    .replace(SortOrder.DESC, '')
    .replace(capitalizeString(SortOrder.DESC), '')
    .replace('_', '');
};

export const SortOrderSelect: React.FC<SortOrderSelectProps> = ({
  value,
  selectOptions,
  height,
  sx,
  onChangeSelectHandle,
  onChangeSortOrderHandle,
}) => {
  const [shortValueOrder, setShortOrderValue] = useState<string>(getShortOrder(value));

  const [sortOrderBy, setSortOrderBy] = useState<SortOrder>(getSortOrderValue(value));
  const borderColorComponent = theme.custom.border.default;

  return (
    <SelectItemsContainer>
      <Select
        sx={{
          fontFamily: FontFamily.ROBOTO,
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '150%',
          letterSpacing: '0.024px',
          height,
          borderTopRightRadius: '0px',
          borderTopLeftRadius: '8px',
          borderRight: 'none',
          borderBottomRightRadius: '0px',
          width: '150px',
          borderBottomLeftRadius: '8px',
          '& fieldset': {
            borderRight: 'none',
            borderColor: 'rgba(0, 0, 0, 0.12)',
          },
          '& .MuiSelect-select.MuiSelect-select': {
            paddingRight: '35px',
          },
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: borderColorComponent,
          },
          ...sx,
        }}
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={shortValueOrder}
        onChange={(e) => {
          const value = e.target.value as string;

          setShortOrderValue(value);
          setSortOrderBy(SortOrder.DESC);

          onChangeSelectHandle(shortValueOrder, sortOrderBy);
        }}
      >
        {selectOptions.map((option: { value: string; name: string }) => (
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

          setSortOrderBy(valueSort);
          onChangeSortOrderHandle(shortValueOrder, valueSort);
        }}
      >
        <ToggleButtonComponent
          value={SortOrder.DESC}
          aria-label='centered'
          sx={{
            height: height,
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '8px',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '8px',
            borderColor: borderColorComponent,
          }}
        >
          <ArrowDownwardIcon
            sx={{
              fontSize: '20px',
              color: sortOrderBy === SortOrder.DESC ? theme.palette.primary.dark : '',
            }}
          />
        </ToggleButtonComponent>
        <ToggleButtonComponent
          value={SortOrder.ASC}
          aria-label='centered'
          sx={{
            height: height,
            borderColor: borderColorComponent,
          }}
        >
          <ArrowUpwardIcon
            sx={{
              fontSize: '20px',
              color: sortOrderBy === SortOrder.ASC ? theme.palette.primary.dark : '',
            }}
          />
        </ToggleButtonComponent>
      </ToggleButtonGroup>
    </SelectItemsContainer>
  );
};
