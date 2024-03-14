import React from 'react';
import { FormHelperText, OutlinedInput } from '@mui/material';
import { Size } from '../../enums/size.enum';
import { UiFormControl } from '../../styles/styles';
import { Controller, useFormContext } from 'react-hook-form';

type InputFiltersProps = {
  placeholder: string;
  visibilityTextHelper: boolean;
  name: string;
  error?: boolean;
  helperText?: string;
};

const UIOutlinedInput: React.FC<InputFiltersProps> = ({ placeholder, visibilityTextHelper, name, helperText }) => {
  const { control, setValue } = useFormContext();
  const limitChar = 200;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <UiFormControl size={Size.SMALL} variant='outlined' sx={{ width: '100%' }} error={!!error}>
          <OutlinedInput
            value={value}
            onChange={(e) => {
              const value = !!e.target.value ? e.target.value.slice(0, limitChar) : '';

              onChange(value);
            }}
            onBlur={() => {
              setValue(name, value.trim(), { shouldDirty: true });
            }}
            sx={{ borderRadius: '8px' }}
            placeholder={placeholder}
            id='outlined-adornment-weight'
            aria-describedby='outlined-weight-helper-text'
          />
          <FormHelperText
            sx={{
              whiteSpace: 'nowrap',
              marginLeft: '0px',
              display: `${visibilityTextHelper ? '' : 'none'}`,
            }}
            id='outlined-weight-helper-text'
          >
            {visibilityTextHelper ? helperText || error?.message : ''}
          </FormHelperText>
        </UiFormControl>
      )}
    />
  );
};

export default UIOutlinedInput;
