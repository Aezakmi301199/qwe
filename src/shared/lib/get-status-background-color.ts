import { StatusName } from '../enums/status.enum';
import { useTheme } from '@mui/material';

export const getStatusBackgroundColor = (status: StatusName) => {
  const theme = useTheme();
  const statusColors: Record<StatusName, string> = {
    [StatusName.FREE]: theme.palette.success.main,
    [StatusName.REJECTED]: theme.palette.error.main,
    [StatusName.OTHER_AGENCY]: theme.palette.error.main,
    [StatusName.THINKS]: theme.palette.info.main,
    [StatusName.NO_RESPONSE]: theme.palette.warning.main,
    [StatusName.NOT_SELECTED]: 'rgba(19, 29, 53, 0.08)',
  };

  return statusColors[status];
};
