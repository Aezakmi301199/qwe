import parsePhoneNumberFromString from 'libphonenumber-js';
import { Localization } from '../enums/localization.enum';

export const formatPhoneNumber = (phoneNumber: string | null, textError = 'Не указана') => {
  if (!phoneNumber) {
    return textError;
  }

  const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, Localization.RUSSIAN_UPPER_CASE);

  if (!parsedPhoneNumber) {
    return phoneNumber;
  }

  return parsedPhoneNumber.formatNational();
};
