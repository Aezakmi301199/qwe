import { BaseTextFieldProps, InputAdornment, Stack, TextField, useTheme } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { Controller, useFormContext } from 'react-hook-form';
import { NumericLimitsFlatFilter } from '../model/use-flat-filters';
import { validateNumericLimit } from '../../../../shared/ui-kit/input-filters/input-filters';

interface InputFiltersProps extends BaseTextFieldProps {
  width?: string;
  startAdornment: string;
  endAdornment: string;
  handleInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  nameFrom: string;
  nameTo: string;
}

export const FloorInput: React.FC<InputFiltersProps> = ({
  width,
  size,
  label,
  startAdornment,
  endAdornment,
  nameFrom,
  nameTo,
  disabled,
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
        control={control}
        name={nameFrom}
        disabled={disabled}
        render={({ field: { value }, fieldState: { error } }) => (
          <NumericFormat
            isAllowed={(events) => validateNumericLimit(events, NumericLimitsFlatFilter.FLOOR)}
            allowNegative={false}
            decimalScale={0}
            disabled={disabled}
            error={!!error || !!errors[nameFrom]}
            value={value}
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
        disabled={disabled}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <NumericFormat
            isAllowed={(events) => validateNumericLimit(events, NumericLimitsFlatFilter.FLOOR)}
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
