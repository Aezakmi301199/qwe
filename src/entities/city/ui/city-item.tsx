import { ListItemButton, ListItemText, styled } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import { City } from '../model/types';

type CityItemProps = {
  city: City;
  selectedCityId: string;
  onClickCity: Dispatch<SetStateAction<string>>;
};

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  fontSize: '12px',
  display: 'flex',
  height: '48px',
  padding: `${theme.custom.base.module.first} ${theme.custom.base.module.second}`,
  alignItems: 'center',
  alignSelf: 'stretch',

  borderRadius: '8px',

  '&.Mui-selected ': {
    backgroundColor: theme.custom.blue.grey.one_hundred,
  },

  '&>.MuiListItemText-root': {
    display: 'flex',
    padding: '4px 0px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: '1 0 0',
    '&>.MuiTypography-root': {
      color: theme.custom.menu.text,
      fontFamily: theme.custom.font.family.roboto,
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '150%' /* 24px */,
      letterSpacing: '-0.136px',
    },
  },
}));

export const CityItem: React.FC<CityItemProps> = ({ city, selectedCityId, onClickCity }) => {
  return (
    <StyledListItemButton
      disableRipple
      selected={selectedCityId === city.id}
      key={city.id}
      onClick={() => onClickCity(city.id)}
    >
      <ListItemText primary={city.name} />
    </StyledListItemButton>
  );
};
