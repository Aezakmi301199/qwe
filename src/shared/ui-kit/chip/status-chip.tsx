import React, { SetStateAction } from 'react';
import { Chip, Typography } from '@mui/material';
import { FontSize } from '../../enums/font-size.enum';
import { FontFamily } from '../../enums/font-family.enum';
import { FontWeight } from '../../enums/font-weight.enum';
import Box from '@mui/material/Box';
import { theme } from '../../../app/providers/theme';
import { Status } from '../../../entities/status';

type StatusChipProps = {
  statuses: Status[];
  selectedStatus: string | null;
  setSelectedStatus: React.Dispatch<SetStateAction<string | null>>;
};

const StatusChip: React.FC<StatusChipProps> = ({ statuses, selectedStatus, setSelectedStatus }) => {
  return (
    <>
      <Typography
        fontSize={FontSize.TWENTY_FONT}
        fontFamily={FontFamily.ROBOTO}
        fontWeight={FontWeight.MEDIUM}
        color={theme.palette.text.primary}
      >
        Статус
      </Typography>
      <Box marginTop={'12px'} display={'flex'} flexWrap={'wrap'} gap={'4px'}>
        {statuses.map((status) => (
          <Chip
            key={status.id}
            label={status.name}
            aria-label={status.name}
            variant={selectedStatus === status.id ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: selectedStatus === status.id ? `#${status.hexColor} !important` : '',
              color: selectedStatus === status.id && status.id !== null ? theme.palette.common.white : '',
            }}
            onClick={() => setSelectedStatus(status.id)}
          />
        ))}
      </Box>
    </>
  );
};

export default StatusChip;
