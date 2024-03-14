import React from 'react';
import { Favorite } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material/SvgIcon/SvgIcon';

const IsFavoriteIcon: React.FC<SvgIconOwnProps> = ({ fontSize = 'medium' }) => {
  return <Favorite fontSize={fontSize} sx={{ color: '#FC6A6A' }} />;
};

export default IsFavoriteIcon;
