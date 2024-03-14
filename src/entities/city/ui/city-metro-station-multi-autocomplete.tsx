import React from 'react';
import { Size } from '../../../shared/enums/size.enum';
import { MetroLineCity } from '../model/types';
import { Autocomplete, Stack, TextField, Typography, darken, lighten, styled } from '@mui/material';
import { UiMultiChip } from '../../../shared/ui-kit/chip/multi-chip';
import { Controller, useFormContext } from 'react-hook-form';
import { FlatFilters } from '../../real-estate/flat';
import { useRootStore } from '../../../root-store.context';

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

export type MetroOptionDto = {
  label: string;
  id: string;
  metroLine: MetroLineCity;
};

const renderTitleGroupMetroLine = (metroOptions: MetroOptionDto[], metroLineId: string) => {
  const metroOption = metroOptions.find((metroOption) => metroOption.metroLine.id === metroLineId);

  if (!metroOption) {
    return;
  }

  return (
    <GroupHeader>
      <Stack display={'flex'} flexDirection={'row'}>
        <Typography margin={'0px 4px'}> {metroOption.metroLine.name}</Typography>
        <Typography margin={'0px 4px'} sx={{ color: `#${metroOption.metroLine.hexColor}` }}>
          {'(М)'}
        </Typography>
      </Stack>
    </GroupHeader>
  );
};

export const CityMetroStationMultiAutoComplete: React.FC = () => {
  const { cityStore } = useRootStore();
  const metroOptions: MetroOptionDto[] = cityStore.findAutoCompleteOptionMetroCity();

  const { control, watch, trigger, setValue } = useFormContext();

  const isValidCorrectCountCity = watch('city').length <= 1;

  return (
    <Controller
      name={FlatFilters.METRO_STATION}
      control={control}
      disabled={!isValidCorrectCountCity}
      render={({ field: { value } }) => (
        <Autocomplete
          disableCloseOnSelect
          id={FlatFilters.METRO_STATION}
          value={cityStore.filterAutoCompleteOptionByMetroLine(metroOptions, value)}
          size={Size.SMALL}
          disabled={!isValidCorrectCountCity}
          groupBy={(option) => option.metroLine.id}
          options={metroOptions}
          onChange={(event, newValue) => {
            const newMetroId = newValue.map((option: MetroOptionDto) => option.id);

            setValue(FlatFilters.METRO_STATION, newMetroId, { shouldDirty: true });
            trigger(FlatFilters.METRO_STATION);
          }}
          sx={{
            width: '100%',
            '& .MuiInputBase-root': {
              borderRadius: '8px',
            },
          }}
          multiple
          renderInput={(params) => <TextField {...params} value={params.id} size={Size.SMALL} label={'Метро'} />}
          renderGroup={(params) => {
            return (
              <li key={params.key}>
                {renderTitleGroupMetroLine(metroOptions, params.group)}
                <GroupItems>{params.children}</GroupItems>
              </li>
            );
          }}
          renderTags={(value, getTagProps) => <UiMultiChip value={value} getTagProps={getTagProps} />}
        />
      )}
    />
  );
};
