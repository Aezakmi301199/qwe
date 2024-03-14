import React from 'react';
import { InputLabel, MenuItem, Select, SelectProps, useTheme } from '@mui/material';
import { DomainSource } from '../type';
import { UiFormControl } from '../../../../shared/styles/styles';
import { Controller, useFormContext } from 'react-hook-form';
import { getRenderMultiSelectValueText } from '../../../../shared/ui-kit/select/select';

interface DomainMultiSelectProps extends SelectProps {
  id: string;
  width: string;
  inputLabel: string;
  domains: DomainSource[];
  name: string;
}

export const DomainMultiSelect: React.FC<DomainMultiSelectProps> = ({ id, width, inputLabel, domains, size, name }) => {
  const theme = useTheme();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <UiFormControl variant='outlined' fullWidth sx={{ borderRadius: '8px' }} size={size} error={!!error}>
          <InputLabel>{inputLabel}</InputLabel>
          <Select
            labelId={id}
            id={id}
            value={value}
            onChange={onChange}
            label={inputLabel}
            size={size}
            multiple
            renderValue={(selectedValues) => getRenderMultiSelectValueText(selectedValues, domains)}
            style={{ borderRadius: '8px', width: width, backgroundColor: theme.palette.common.white }}
          >
            {domains.map((domain: DomainSource) => (
              <MenuItem key={domain.scriptName} value={domain.value}>
                {domain.name}
              </MenuItem>
            ))}
          </Select>
        </UiFormControl>
      )}
    />
  );
};
