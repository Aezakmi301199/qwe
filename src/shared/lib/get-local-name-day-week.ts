import { Info } from 'luxon';
import { LocaleSystem } from '../enums/locale-system.enum';
import { NumerationDayWeek } from '../enums/numeration-day-week';

type getLocaleNameDayWeekProps = {
  numerationDayWeek: NumerationDayWeek;
  locale?: LocaleSystem;
  isCapitalize?: boolean;
};

export const getLocaleNameDayWeek = ({
  numerationDayWeek,
  locale = LocaleSystem.RUSSIAN,
  isCapitalize = true,
}: getLocaleNameDayWeekProps) => {
  const string = Info.weekdays('long', {
    locale: locale,
  })[numerationDayWeek - 1];

  return isCapitalize ? string.charAt(0).toUpperCase() + string.slice(1) : string;
};
