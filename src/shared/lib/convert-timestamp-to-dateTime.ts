import { DateTime } from 'luxon';
import { InitialState } from '../enums/pagination.enum';

export const formatISODate = (isoDateString: string, format = 'dd.MM.yyyy, HH:mm'): string => {
  return DateTime.fromISO(isoDateString).toFormat(format);
};

export const formatISODateTooltip = (isoDateString: string, format = 'dd.MM.yyyy'): string => {
  return DateTime.fromISO(isoDateString).toFormat(format);
};

export const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const formattedMinutes = String(minutes).padStart(InitialState.TWO, '0');
  const formattedSeconds = String(seconds).padStart(InitialState.TWO, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};
