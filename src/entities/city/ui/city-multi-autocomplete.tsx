import React from 'react';
import { Autocomplete, SelectProps, TextField, useTheme } from '@mui/material';
import { UiFormControl } from '../../../shared/styles/styles';
import { Size } from '../../../shared/enums/size.enum';
import { UiMultiChip } from '../../../shared/ui-kit/chip/multi-chip';
import { AutoCompleteOptionDto } from '../../../shared/types/auto-complete-option';
import { Controller, useFormContext } from 'react-hook-form';
import { FlatFilters } from '../../real-estate/flat';
import { useRootStore } from '../../../root-store.context';

interface CityMultiAutoCompleteProps extends SelectProps {
  id: string;
  width: string;
  inputLabel: string;
  name: string;
  handleChange: () => void;
}

export const CityMultiAutoComplete: React.FC<CityMultiAutoCompleteProps> = ({
  id,
  width,
  inputLabel,
  size,
  handleChange,
}) => {
  const theme = useTheme();
  const { cityStore } = useRootStore();
  const citiesOptions: AutoCompleteOptionDto[] = cityStore.findAutoCompleteOptionCity();
  const { control, setValue, trigger } = useFormContext();

  return (
    <Controller
      name={FlatFilters.CITY}
      control={control}
      render={({ field: { value }, fieldState: { error } }) => {
        return (
          <UiFormControl variant='outlined' fullWidth sx={{ borderRadius: '8px' }} size={size} error={!!error}>
            <Autocomplete
              disableCloseOnSelect
              id={id}
              value={cityStore.filterAutoCompleteOptionByCity(citiesOptions, value)}
              size={Size.SMALL}
              options={citiesOptions}
              style={{ width: width, backgroundColor: theme.palette.common.white }}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                },
              }}
              multiple
              onChange={(e, newValue) => {
                const newCitiesId = newValue.map((option: AutoCompleteOptionDto) => option.id);

                setValue(FlatFilters.CITY, newCitiesId, { shouldDirty: true });

                if (!newCitiesId.length) {
                  setValue(FlatFilters.DOMAIN, []);
                  setValue(FlatFilters.METRO_STATION, []);
                  trigger(FlatFilters.DOMAIN);
                  trigger(FlatFilters.CITY);
                }

                handleChange();
              }}
              renderInput={(params) => <TextField {...params} value={params.id} size={Size.SMALL} label={inputLabel} />}
              renderTags={(valueTag, getTagProps) => <UiMultiChip value={valueTag} getTagProps={getTagProps} />}
            />
          </UiFormControl>
        );
      }}
    />
  );
};
