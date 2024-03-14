import React from 'react';
import { FavoriteBorder } from '@mui/icons-material';
import { SvgIconOwnProps } from '@mui/material/SvgIcon/SvgIcon';

const IsNotFavoriteIcon: React.FC<SvgIconOwnProps> = ({ fontSize = 'medium' }) => {
  return <FavoriteBorder fontSize={fontSize} sx={{ '&:hover': { color: '#FC6A6A' } }} />;
};

export default IsNotFavoriteIcon;
