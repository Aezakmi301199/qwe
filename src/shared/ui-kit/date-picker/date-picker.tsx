import React from 'react';
import { ClearIcon, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ruLocale from 'date-fns/locale/ru';
import { DatePickerAfter, DatePickerContainer, DatePickerFrom, DatePickersContainer } from '../../styles/styles';
import { Size } from '../../enums/size.enum';
import { Controller, useFormContext } from 'react-hook-form';
import { FlatFilters } from '../../../entities/real-estate/flat';
import { ruRU } from '@mui/x-date-pickers/locales';

interface DatePickerComponentProps {
  label: string;
  width?: string;
  nameFrom: string;
  nameTo: string;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ label, nameFrom, nameTo }) => {
  const { control, trigger, setValue } = useFormContext();

  const clearPublishedAtFrom = () => {
    setValue(FlatFilters.PUBLISHED_AT_FROM, null, { shouldDirty: true });
    trigger(FlatFilters.PUBLISHED_AT_FROM);
    trigger(FlatFilters.PUBLISHED_AT_TO);
  };

  const clearPublishedAtTo = () => {
    setValue(FlatFilters.PUBLISHED_AT_TO, null, { shouldDirty: true });
    trigger(FlatFilters.PUBLISHED_AT_FROM);
    trigger(FlatFilters.PUBLISHED_AT_TO);
  };

  return (
    <DatePickerContainer>
      <DatePickersContainer size={Size.SMALL} variant='outlined'>
        <LocalizationProvider
          localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
          dateAdapter={AdapterDateFns}
          adapterLocale={ruLocale}
        >
          <Controller
            name={nameFrom}
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DatePickerFrom
                value={value ? new Date(value) : null}
                label={label}
                disableOpenPicker={true}
                onChange={(event) => {
                  onChange(event);
                  trigger(FlatFilters.PUBLISHED_AT_FROM);
                  trigger(FlatFilters.PUBLISHED_AT_TO);
                }}
                slotProps={{
                  textField: {
                    error: !!error,
                    InputLabelProps: { shrink: true },
                    sx: {
                      '& .MuiInputBase-root': {
                        '& .MuiInputAdornment-root': {
                          marginLeft: '0px',
                        },
                      },
                    },
                  },
                  clearButton: {
                    sx: {
                      padding: '1px',
                    },
                  },
                  field: {
                    clearable: true,
                    onClear: () => clearPublishedAtFrom(),
                  },
                }}
                slots={{
                  clearIcon: () => <ClearIcon />,
                }}
              />
            )}
          />
        </LocalizationProvider>
      </DatePickersContainer>
      <DatePickersContainer size={Size.SMALL} variant='outlined'>
        <LocalizationProvider
          localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
          dateAdapter={AdapterDateFns}
          adapterLocale={ruLocale}
        >
          <Controller
            name={nameTo}
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DatePickerAfter
                value={value ? new Date(value) : null}
                disableOpenPicker={true}
                onChange={(event) => {
                  onChange(event);
                  trigger(FlatFilters.PUBLISHED_AT_FROM);
                  trigger(FlatFilters.PUBLISHED_AT_TO);
                }}
                slotProps={{
                  textField: {
                    error: !!error,
                    InputLabelProps: { shrink: true },
                    sx: {
                      '& .MuiInputBase-root': {
                        '& .MuiInputAdornment-root': {
                          marginLeft: '0px',
                        },
                      },
                    },
                  },
                  clearButton: {
                    sx: {
                      padding: '1px',
                    },
                  },
                  field: {
                    clearable: true,
                    onClear: () => clearPublishedAtTo(),
                  },
                }}
                slots={{
                  clearIcon: () => <ClearIcon />,
                }}
              />
            )}
          />
        </LocalizationProvider>
      </DatePickersContainer>
    </DatePickerContainer>
  );
};

export default DatePickerComponent;
