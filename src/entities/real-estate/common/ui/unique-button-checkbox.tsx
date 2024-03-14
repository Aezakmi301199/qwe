import { Box, FormControlLabel, Checkbox } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { FlatFilters } from '../../flat';

export const UniqueButtonCheckbox = () => {
  const { control } = useFormContext();

  return (
    <Box display={'flex'} alignItems={'center'}>
      <FormControlLabel
        style={{ marginLeft: 0 }}
        label='Только уникальные объекты'
        control={
          <Controller
            name={FlatFilters.CAN_SEE_PART_MATCHES}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                color='primary'
                checked={!value}
                onChange={(event) => {
                  event.target.checked = !event.target.checked;
                  onChange(event);
                }}
              />
            )}
          />
        }
      />
    </Box>
  );
};
