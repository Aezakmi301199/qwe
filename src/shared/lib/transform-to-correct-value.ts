export const transformToCorrectValue = (value: string | null | number | undefined | boolean): any => {
  if (value === 'true' || value === 'false' || value === 'null') {
    return JSON.parse(value);
  }

  if (Array.isArray(value) && value.length) {
    // Проверяет массивы на корректность значений
    return value.map((value) => transformToCorrectValue(value));
  }

  if (!Number(value) && value !== '0' && !isNumericString(value)) {
    // Забирает пустую строку,не числовые строки,undefined
    return value;
  }

  if (typeof value === 'boolean') {
    // Забирает boolean
    return value;
  }

  if (isNumericString(value) && typeof value === 'string') {
    // Забирает и конвертирует число у которой просто тип данных строка или разделена тысячными долями
    return parseStringNumber(value);
  }

  // Забирает числа
  return Number(value);
};

const isNumericString = (value: any) => {
  value = typeof value === 'string' ? removeStringWithSpaces(value) : value;

  const pattern = /^-?\d+(\.\d+)?$/;

  return pattern.test(value);
};

export const parseStringNumber = (string: string) => {
  const radix = ',';

  return Number(string.replace(new RegExp('[^\\d\\' + radix + ']', 'g'), '').replace(radix, '.'));
};

/**  removeStringWithSpaces
 //  Убирает пробелы в строке и возвращает назад строку
 */
const removeStringWithSpaces = (string: string) => {
  return string.replace(/ /g, '');
};
