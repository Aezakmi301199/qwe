import React from 'react';
import {
  UiToggleButtonGroup,
  UiToggleButtonGroupProps,
} from '../../../../shared/ui-kit/group-toggle-button/group-toggle-button';
import { RealEstateType } from '../../../../shared/enums/real-estate-type.enum';

interface ToggleButtonRealEstateProps extends Omit<UiToggleButtonGroupProps, 'options'> {}

const realEstateOptions = [
  { value: RealEstateType.FLATS, text: 'Квартиры' },
  { value: RealEstateType.HOUSES, text: 'Загородные дома' },
  { value: RealEstateType.LANDS, text: 'Участки' },
];

export const ToggleButtonRealEstate: React.FC<ToggleButtonRealEstateProps> = ({
  value,
  onChange,
  fullWidth,
  ...props
}) => {
  return (
    <UiToggleButtonGroup
      fullWidth={fullWidth}
      value={value}
      onChange={onChange}
      options={realEstateOptions}
      exclusive={true}
      {...props}
    />
  );
};
