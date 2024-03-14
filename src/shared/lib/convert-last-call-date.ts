import { DateTime } from 'luxon';

export const convertLastCallDate = (date: string): string => {
  const dateOfCall = DateTime.fromISO(date);
  const now = DateTime.now();
  const diff = now.diff(dateOfCall);
  const hours = Math.floor(diff.as('hours'));
  const minutes = Math.floor(diff.as('minutes') % 60);
  let resultString = '';

  if (hours > 0) {
    resultString += `${hours} ч `;
  }

  resultString += `${minutes} мин.`;

  return `Последний звонок ${resultString} назад`;
};
