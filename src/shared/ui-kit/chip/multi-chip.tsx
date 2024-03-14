import React from 'react';
import { Chip, ChipProps, AutocompleteRenderGetTagProps } from '@mui/material';
import { Size } from '../../enums/size.enum';

interface defaultValueObject {
  id: string;
  label: string;
}

interface UiMultiChipProps extends ChipProps {
  value: defaultValueObject[];
  getTagProps: AutocompleteRenderGetTagProps;
}

export const UiMultiChip: React.FC<UiMultiChipProps> = ({ value, getTagProps }) => {
  const numTags = value.length;
  const limitTags = 1;

  return (
    <>
      {value.slice(0, limitTags).map((option: defaultValueObject, index) => {
        return (
          <Chip
            sx={{
              '&.MuiAutocomplete-tag': {
                maxWidth: 'calc(100% - 60px)',
              },
            }}
            {...getTagProps({ index })}
            key={index}
            size={Size.SMALL}
            label={option.label}
          />
        );
      })}
      {numTags > limitTags && ` +${numTags - limitTags}`}
    </>
  );
};
