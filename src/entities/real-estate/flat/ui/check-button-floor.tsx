import { Box, Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { FloorAdditionalFilter } from '../../../../shared/enums/floor-additional-filter';
import { FlatFilters } from '../model/use-flat-filters';
import { Controller, useFormContext } from 'react-hook-form';

export const CheckButtonFloor: React.FC = () => {
  const { trigger, setValue, control } = useFormContext();

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>, floorAdditionalFilter: string[]) => {
    const selectedFloor = event.target.name;
    const checkedStateSelectedFloor = event.target.checked;

    const updatedFloorAdditional = checkedStateSelectedFloor
      ? [...floorAdditionalFilter, selectedFloor]
      : floorAdditionalFilter.filter((floorFilter) => floorFilter !== selectedFloor);

    setValue(FlatFilters.FLOOR_ADDITIONAL_FILTER, updatedFloorAdditional, { shouldDirty: true });
    trigger(FlatFilters.FLOOR_ADDITIONAL_FILTER);
    trigger(FlatFilters.FLOOR_FROM);
    trigger(FlatFilters.FLOOR_TO);
  };

  return (
    <Box marginLeft={'-10px'}>
      <FormControlLabel
        style={{ marginRight: '28px' }}
        control={
          <Controller
            name={FlatFilters.FLOOR_ADDITIONAL_FILTER}
            control={control}
            render={({ field: { value } }) => (
              <Checkbox
                name={FloorAdditionalFilter.NOT_FIRST_FLOOR}
                color='primary'
                checked={!!value.includes(FloorAdditionalFilter.NOT_FIRST_FLOOR)}
                onChange={(e) => handleCheckbox(e, value)}
              />
            )}
          />
        }
        label='Не первый'
      />
      <FormControlLabel
        style={{ marginRight: '28px' }}
        control={
          <Controller
            name={FlatFilters.FLOOR_ADDITIONAL_FILTER}
            control={control}
            render={({ field: { value } }) => (
              <Checkbox
                name={FloorAdditionalFilter.NOT_LAST_FLOOR}
                color='primary'
                checked={!!value.includes(FloorAdditionalFilter.NOT_LAST_FLOOR)}
                onChange={(e) => handleCheckbox(e, value)}
              />
            )}
          />
        }
        label='Не последний'
      />
    </Box>
  );
};
