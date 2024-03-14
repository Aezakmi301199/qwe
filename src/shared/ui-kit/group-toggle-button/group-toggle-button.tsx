import React from 'react';
import { GroupButtonContainer, Text } from '../../styles/styles';
import { SxProps, ToggleButton, ToggleButtonGroupProps } from '@mui/material';
import { Size } from '../../enums/size.enum';
import { FontSize } from '../../enums/font-size.enum';
import { FontWeight } from '../../enums/font-weight.enum';

type toggleOption = {
  value: string | number;
  text: string;
  name?: string;
};

export interface UiToggleButtonGroupProps extends ToggleButtonGroupProps {
  options: toggleOption[];
  slotProps?: {
    toggleButton: {
      sx: SxProps;
    };
  };
}

export const UiToggleButtonGroup: React.FC<UiToggleButtonGroupProps> = ({
  value,
  onChange,
  color,
  options,
  slotProps,
  sx,
  fullWidth,
  exclusive,
}) => {
  return (
    <GroupButtonContainer
      value={value}
      size={Size.LARGE}
      onChange={onChange}
      aria-label={'text alignment'}
      sx={sx}
      exclusive={exclusive}
      fullWidth={fullWidth}
    >
      {options.map((item: toggleOption) => (
        <ToggleButton
          key={item.value}
          value={item.value}
          name={item.name}
          aria-label={'alignment'}
          sx={{
            height: '40px',
            borderRadius: '8px',
            ...slotProps?.toggleButton.sx,
          }}
        >
          <Text fontSize={FontSize.FOURTEENTH_FONT} fontWeight={FontWeight.MEDIUM} sx={{ color: color }}>
            {item.text}
          </Text>
        </ToggleButton>
      ))}
    </GroupButtonContainer>
  );
};
