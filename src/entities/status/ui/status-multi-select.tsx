import React from 'react';
import { Checkbox, InputLabel, ListItemText, MenuItem, Select, SelectProps, useTheme } from '@mui/material';
import { Status } from '../model/type';
import { Controller, useFormContext } from 'react-hook-form';
import { getRenderMultiSelectValueText, ValueTypeSelect } from '../../../shared/ui-kit/select/select';
import { FlatFilters } from '../../real-estate/flat';
import { UiFormControl } from '../../../shared/styles/styles';

interface CityMultiSelectProps extends SelectProps {
  id: string;
  width: string;
  inputLabel: string;
  statuses: Status[];
  name: string;
}

export const StatusMultiSelect: React.FC<CityMultiSelectProps> = ({
  id,
  width,
  inputLabel,
  statuses,
  size,
  name,
  error,
  ...props
}) => {
  const theme = useTheme();
  const { control, setValue, trigger } = useFormContext();
  const statusesRenderValue: ValueTypeSelect[] = statuses.map((status) => {
    return {
      name: status.name,
      value: String(status.id),
    };
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value }, fieldState: { error } }) => {
        const modifiedValue = (value as (string | null)[]).map((value) => String(value));

        return (
          <UiFormControl variant='outlined' fullWidth sx={{ borderRadius: '8px' }} size={size} error={!!error}>
            <InputLabel>{inputLabel}</InputLabel>
            <Select
              {...props}
              labelId={id}
              id={id}
              value={modifiedValue}
              onChange={(event) => {
                const currentValues = event.target.value as string[];
                const transformedValues = currentValues.map((val: string) => (val === 'null' ? null : val));

                if (!transformedValues.length) {
                  return;
                }

                setValue(FlatFilters.STATUS, transformedValues, { shouldDirty: true });
                trigger(FlatFilters.STATUS);
              }}
              label={inputLabel}
              size={size}
              multiple
              renderValue={(selectedValues) =>
                getRenderMultiSelectValueText(selectedValues as string[], statusesRenderValue)
              }
              style={{ borderRadius: '8px', width: width, backgroundColor: theme.palette.common.white }}
            >
              {statuses.map((status: Status) => {
                const currentValues = value.map((val: string | null) => String(val));

                return (
                  <MenuItem
                    sx={{
                      height: '36px',
                      '&.Mui-selected': { backgroundColor: theme.palette.common.white },
                      '&.Mui-selected:hover': { backgroundColor: 'rgba(19, 29, 53, 0.04)' },
                    }}
                    key={String(status.id)}
                    value={String(status.id)}
                    disableRipple
                  >
                    <Checkbox
                      sx={{ padding: '7px' }}
                      checked={currentValues.includes(String(status.id))}
                      disableRipple
                    />
                    <ListItemText primary={status.name} />
                  </MenuItem>
                );
              })}
            </Select>
          </UiFormControl>
        );
      }}
    />
  );
};
