import React from 'react';
import { BaseTextFieldProps, InputAdornment, Stack, TextField, useTheme } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { Controller, useFormContext } from 'react-hook-form';

interface InputFiltersProps extends BaseTextFieldProps {
  width?: string;
  startAdornment: string;
  endAdornment: string;
  handleInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  valueTo?: string | number | null;
  valueFrom?: string | number | null;
  nameFrom: string;
  nameTo: string;
  maxValue?: number;
}

type AllowedValuesNumericFormat = {
  formattedValue: string;
  value: string;
  floatValue: number | undefined;
};

export const validateNumericLimit = (values: AllowedValuesNumericFormat, maxValue: number | undefined) => {
  if (!values.floatValue || !maxValue) {
    return true;
  }

  return values.floatValue < maxValue;
};

const UIInputFilters: React.FC<InputFiltersProps> = ({
  width,
  size,
  label,
  startAdornment,
  endAdornment,
  nameFrom,
  nameTo,
  disabled,
  maxValue,
}) => {
  const theme = useTheme();

  const {
    control,
    formState: { errors },
    trigger,
    setValue,
  } = useFormContext();

  return (
    <Stack alignItems={'center'} flexDirection={'row'}>
      <Controller
        name={nameFrom}
        control={control}
        render={({ field: { value }, fieldState: { error } }) => (
          <NumericFormat
            value={value}
            isAllowed={(events) => validateNumericLimit(events, maxValue)}
            allowNegative={false}
            decimalScale={0}
            disabled={disabled}
            error={!!error || !!errors[nameFrom]}
            onValueChange={(values, sourceInfo) => {
              setValue(nameFrom, values.value, { shouldDirty: true, shouldTouch: true });
              trigger(nameFrom);
              trigger(nameTo);
            }}
            thousandSeparator={' '}
            label={label}
            autoComplete={'off'}
            id='outlined-start-adornment'
            size={size}
            className={'left'}
            InputProps={{
              startAdornment: <InputAdornment position='start'>{startAdornment}</InputAdornment>,
              sx: {
                ...(disabled && {
                  color: disabled ? theme.palette.text.disabled : theme.palette.text.secondary,
                  pointerEvents: 'none',
                }),
                '.MuiTypography-root': {
                  color: theme.palette.text.disabled,
                },
                backgroundColor: theme.custom.input.input.bg,
                borderTopRightRadius: '0px',
                borderTopLeftRadius: '8px',
                borderRight: 'none',
                borderBottomRightRadius: '0px',
                borderBottomLeftRadius: '8px',
                width: { width },
                '& fieldset': { borderRight: 'none' },
                '&:hover fieldset': { border: '1px solid red' },
              },
            }}
            customInput={TextField}
          />
        )}
      />
      <Controller
        name={nameTo}
        control={control}
        render={({ field: { value }, fieldState: { error } }) => (
          <NumericFormat
            isAllowed={(events) => validateNumericLimit(events, maxValue)}
            allowNegative={false}
            decimalScale={0}
            disabled={disabled}
            error={!!error || !!errors[nameTo]}
            name={nameTo}
            value={value}
            thousandSeparator={' '}
            id='outlined-start-adornment'
            size={size}
            autoComplete={'off'}
            onValueChange={(values, sourceInfo) => {
              setValue(nameTo, values.value, { shouldDirty: true, shouldTouch: true });
              trigger(nameFrom);
              trigger(nameTo);
            }}
            InputProps={{
              startAdornment: <InputAdornment position='start'>{endAdornment}</InputAdornment>,
              sx: {
                ...(disabled && {
                  color: disabled ? theme.palette.text.disabled : theme.palette.text.secondary,
                  pointerEvents: 'none',
                }),
                '.MuiTypography-root': {
                  color: theme.palette.text.disabled,
                },
                backgroundColor: theme.custom.input.input.bg,
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '8px',
                borderBottomLeftRadius: '0px',
                borderBottomRightRadius: '8px',
                width: { width },
              },
            }}
            customInput={TextField}
          />
        )}
      />
    </Stack>
  );
};

export default UIInputFilters;
