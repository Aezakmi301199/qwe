import { styled } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';
import { StatusCity } from '../../../shared/enums/status-city.enum';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import TimelapseOutlinedIcon from '@mui/icons-material/TimelapseOutlined';
import React, { ReactElement } from 'react';

export const SearchColumnLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  gap: theme.custom.base.module.first,
}));

export const SearchRowLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'stretch',
  gap: theme.custom.base.module.first,
}));

export const FilterButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  padding: `${theme.custom.button.padding.py.lg} ${theme.custom.button.padding.px.lg}`,
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.custom.button.gap,
  borderRadius: theme.custom.input.shape.border.radius,
  border: `1px solid ${theme.custom.input.shape.border.default}`,
  '.MuiButton-startIcon': {
    margin: 'auto',
  },
}));

export const StyledCityList = styled(Box)(() => ({
  display: 'flex',
  width: '260px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  flex: '1 0 0',
  overflowY: 'auto',
}));

export const Title = styled(Typography)(({ theme }) => ({
  display: 'flex',
  padding: `${theme.custom.base.module.zero_five} ${theme.custom.base.module.second} 0px ${theme.custom.base.module.second}`,
  alignItems: 'center',
  gap: '10px',
  alignSelf: 'stretch',

  fontFamily: theme.custom.font.family.roboto,
  fontSize: '12px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '266%' /* 31.92px */,
  letterSpacing: '0.83px',
  textTransform: 'uppercase',
}));
type IconStatusCityProps = {
  status: StatusCity;
};

export const IconStatusCity: React.FC<IconStatusCityProps> = ({ status }) => {
  const iconStatus: Record<string, ReactElement> = {
    [StatusCity.ACTIVE]: <PlayCircleFilledWhiteOutlinedIcon color='success' />,
    [StatusCity.SUSPENDED]: <PauseCircleOutlineOutlinedIcon color='error' />,
    [StatusCity.EXPIRES]: <TimelapseOutlinedIcon color='warning' />,
    [StatusCity.NONE]: <></>,
  };

  return iconStatus[status];
};

export const PopoverFilterCity = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '260px',
  height: '202px',
  borderRadius: theme.custom.shape.border.radius.md,
}));

export const PopoverFilterCityHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: `0px ${theme.custom.base.module.second}`,
  gap: theme.custom.base.module.first,
  height: '42px',
}));

export const PopoverFilterCityBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: `0px ${theme.custom.base.module.second}`,
  paddingBottom: theme.custom.base.module.first,
  alignItems: 'flex-start',
  alignSelf: 'stretch',
}));
