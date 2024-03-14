import React from 'react';
import { Autocomplete, SelectProps, TextField, useTheme } from '@mui/material';
import { UiFormControl } from '../../../shared/styles/styles';
import { Size } from '../../../shared/enums/size.enum';
import { AutoCompleteOptionDto } from '../../../shared/types/auto-complete-option';
import { useRootStore } from '../../../root-store.context';
import { City } from '../model/types';

interface CityAutoCompleteProps extends SelectProps {
  id: string;
  width: string;
  inputLabel: string;
  name: string;
  handleChange: (newCityId: string) => void;
  value: string;
  error: boolean;
  availableCity?: City[];
}

export const CityAutoComplete: React.FC<CityAutoCompleteProps> = ({
  id,
  width,
  size,
  handleChange,
  value,
  inputLabel,
  error,
  availableCity,
}) => {
  const theme = useTheme();
  const { cityStore } = useRootStore();
  const citiesOptions: AutoCompleteOptionDto[] = availableCity
    ? cityStore.findAutoCompleteOptionCity(availableCity)
    : cityStore.findAutoCompleteOptionCity();

  return (
    <UiFormControl variant='outlined' sx={{ borderRadius: '8px' }} size={size} error={error}>
      <Autocomplete
        disableClearable={true}
        id={id}
        value={cityStore.findAutoCompleteOptionByCity(citiesOptions, value)}
        size={Size.SMALL}
        options={citiesOptions}
        style={{ width: width, backgroundColor: theme.palette.common.white }}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: '8px',
          },
        }}
        onChange={(e, newValue) => {
          handleChange(newValue.id);
        }}
        renderInput={(params) => <TextField {...params} value={params.id} size={Size.SMALL} label={inputLabel} />}
      />
    </UiFormControl>
  );
};
