import { CircularProgress, CircularProgressProps, Stack, useTheme } from '@mui/material';
import { ReactElement } from 'react';

type SpinnerProps = CircularProgressProps & {
  color?: string;
};

type SpinnerUiProviderProps = {
  children: ReactElement;
  statePending: boolean;
  spinner?: ReactElement;
};

export const SpinnerUiProvider: React.FC<SpinnerUiProviderProps> = ({ children, statePending, spinner }) => {
  const SpinnerComponent = spinner ?? <Spinner />;

  return <>{statePending ? SpinnerComponent : children}</>;
};

export const Spinner: React.FC<SpinnerProps> = ({ color, size, sx }) => {
  const theme = useTheme();

  return (
    <Stack direction='row' justifyContent={'center'}>
      <CircularProgress sx={{ color: color ?? theme.palette.primary.main, ...sx }} size={size} />
    </Stack>
  );
};
