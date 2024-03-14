import { useTheme } from '@mui/material';
import { FontFamily } from '../enums/font-family.enum';

export const useStyles = () => {
  const theme = useTheme();

  return {
    'body1-medium': {
      /* body/body1 medium */
      color: theme.palette.text.primary,
      fontFamily: FontFamily.ROBOTO,
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '150%',
      letterSpacing: '0.024px;',
    },
  };
};
