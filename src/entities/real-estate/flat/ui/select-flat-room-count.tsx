import React from 'react';
import { Size } from '../../../../shared/enums/size.enum';
import { Controller, useFormContext } from 'react-hook-form';
import { FlatFilters } from '../model/use-flat-filters';
import { UiToggleButtonGroup } from '../../../../shared/ui-kit/group-toggle-button/group-toggle-button';

type TabControlProps = {
  color: string;
  height: string;
};

const roomOptions = [
  { value: 0, text: 'Студия', name: 'studio' },
  { value: 1, text: '1', name: 'one_room' },
  { value: 2, text: '2', name: 'two_room' },
  { value: 3, text: '3', name: 'three_room' },
  { value: 4, text: '4+', name: 'four_plus_room' },
];

export const SelectFlatRoomCount: React.FC<TabControlProps> = ({}) => {
  const { control, setValue, trigger } = useFormContext();

  const handleFlatRoomCount = (event: React.MouseEvent<HTMLElement>, newAlignment: number[]) => {
    setValue(FlatFilters.ROOM_COUNT, newAlignment.sort(), { shouldDirty: true });
    trigger(FlatFilters.ROOM_COUNT);
  };

  return (
    <Controller
      name={FlatFilters.ROOM_COUNT}
      control={control}
      render={({ field: { value } }) => {
        return (
          <UiToggleButtonGroup
            value={value}
            size={Size.LARGE}
            onChange={handleFlatRoomCount}
            options={roomOptions.sort()}
            slotProps={{
              toggleButton: {
                sx: {
                  width: '100%',
                },
              },
            }}
            exclusive={false}
          />
        );
      }}
    />
  );
};
