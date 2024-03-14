import { Box, Typography, useTheme } from '@mui/material';
import { AlignText } from '../enums/align-text';

export type LinearIndicatorProps = {
  text?: string;
  width: string;
  backgroundColor: string;
  alignText?: AlignText;
  display: boolean;
};

export const LinearIndicator: React.FC<LinearIndicatorProps> = ({
  text,
  width,
  backgroundColor,
  alignText,
  display,
}) => {
  const theme = useTheme();

  return (
    <Box
      display={display ? 'block' : 'none'}
      position={'relative'}
      width={width}
      sx={{
        height: '24px',
        padding: `${theme.custom.base.module.first} ${theme.custom.base.module.second}`,
        borderRadius: theme.custom.base.module.first,
        background: backgroundColor,
      }}
    >
      <Typography sx={{ pointerEvents: 'none' }} variant={'body1NumMedium'} align={alignText}>
        {text}
      </Typography>
    </Box>
  );
};
