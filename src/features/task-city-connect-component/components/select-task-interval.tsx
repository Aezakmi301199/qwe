import React from 'react';
import { Divider, FormControl, InputLabel, MenuItem, Select, SelectProps, Typography, useTheme } from '@mui/material';
import { TaskInterval } from '../../../shared/enums/task-interval.enum';
import { ShortNameOfTheTime } from '../../../shared/enums/short-name-of-the-time.enum';
import { TimeConvert } from '../../../shared/enums/time-convert.enum';
import { convertEnumWithNumberToArray } from '../../../shared/lib/convert-enum-with-number-to-array';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

interface SelectTaskIntervalProps extends SelectProps {
  id: string;
  width?: string;
  inputLabel?: string;
}

const convertSecondsToMinutes = (seconds: number): number => seconds / TimeConvert.SECONDS_IN_MINUTE;

const getShortNameOfTheTime = (seconds: number) => {
  return seconds < TimeConvert.SECONDS_IN_MINUTE
    ? `${seconds} ${ShortNameOfTheTime.SECONDS}`
    : `${convertSecondsToMinutes(seconds)} ${ShortNameOfTheTime.MINUTES}`;
};

const SelectTaskInterval: React.FC<SelectTaskIntervalProps> = ({ id, width, inputLabel, size, value }) => {
  const defaultIntervals = convertEnumWithNumberToArray(TaskInterval);

  const indexFirstMinutesInterval = defaultIntervals.findIndex((interval) => interval >= TimeConvert.SECONDS_IN_MINUTE);

  const theme = useTheme();

  return (
    <FormControl
      variant='outlined'
      sx={{
        borderRadius: '8px',
      }}
    >
      {inputLabel && <InputLabel id='select-label'>{inputLabel}</InputLabel>}
      <Select
        className=''
        labelId={id}
        id={id}
        value={value}
        label={inputLabel}
        size={size}
        style={{ borderRadius: '8px', width: width }}
        inputProps={{
          sx: { borderRadius: '8px', width: '100px', backgroundColor: '#FFF' },
        }}
        IconComponent={ArrowDropDownRoundedIcon}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          PaperProps: {
            style: {
              minWidth: '90px',
              borderRadius: theme.custom.menu.border.radius,
              background: theme.custom.menu.surface,
              boxShadow: '0px 3px 14px 2px rgba(0, 0, 0, 0.25)',
            },
          },
        }}
      >
        {defaultIntervals.map((time, index) => [
          indexFirstMinutesInterval === index && <Divider />,
          <MenuItem
            key={time}
            value={time}
            sx={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'stretch',
              padding: `${theme.custom.menu.item.padding.py} ${theme.custom.menu.item.padding.px}`,
              gap: theme.custom.menu.padding.gap,
            }}
          >
            <Typography variant='body1'>{getShortNameOfTheTime(time)}</Typography>
          </MenuItem>,
        ])}
      </Select>
    </FormControl>
  );
};

export default SelectTaskInterval;
