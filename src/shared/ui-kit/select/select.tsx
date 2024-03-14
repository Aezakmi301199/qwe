import React, { ReactElement } from 'react';
import { Icon, InputLabel, MenuItem, Select, SelectProps, Stack, SxProps, Typography } from '@mui/material';
import { theme } from '../../../app/providers/theme';
import { UiFormControl } from '../../styles/styles';
import { Size } from '../../enums/size.enum';

export type ValueTypeSelect = {
  value: string;
  name: string;
  iconEnd?: ReactElement;
};

export interface SelectComponentProps extends SelectProps {
  id: string;
  width?: string;
  inputLabel?: string;
  value?: string;
  values: ValueTypeSelect[];
  name?: string;
  multiple?: boolean;
  onChange?: any;
  formControl?: {
    sx: SxProps;
  };
}

export const getRenderMultiSelectValueText = (values: string[], availableValues: ValueTypeSelect[]) => {
  const isSelectedAllValues = availableValues.length === values.length;

  if (!isSelectedAllValues) {
    const selectedValues = availableValues
      .filter((availableValue) => values.includes(availableValue.value))
      .map((availableValue) => availableValue.name);

    return selectedValues.join(', ');
  }

  return 'Все';
};

const UISelect: React.FC<SelectComponentProps> = ({
  id,
  width,
  inputLabel,
  values,
  size,
  name,
  value,
  onChange,
  fullWidth,
  formControl,
}) => {
  return (
    <UiFormControl
      variant='outlined'
      fullWidth={fullWidth}
      sx={{ borderRadius: '8px', ...formControl?.sx }}
      size={size}
    >
      {inputLabel && <InputLabel>{inputLabel}</InputLabel>}
      <Select
        name={name}
        labelId={id}
        id={id}
        value={!value ? values[0].value : value}
        onChange={onChange}
        label={inputLabel}
        size={size}
        style={{ borderRadius: '8px', width: width, backgroundColor: theme.palette.common.white }}
      >
        {values.map(({ value, name, iconEnd }: ValueTypeSelect) => (
          <MenuItem key={value} value={value}>
            <Stack display={'flex'} flexDirection={'row'} alignItems={'center'}>
              <Typography>{name}</Typography>
              {iconEnd && <Icon fontSize={Size.SMALL} children={iconEnd} sx={{ margin: '0px 4px' }} />}
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </UiFormControl>
  );
};

export default UISelect;
