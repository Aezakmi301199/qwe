/**
 * Вставляет разделитель после каждых 4-ёх подряд идущих цифр в числе.
 *
 * @param {number | string} number  - Число, к которому применяется разделитель.
 * @returns {string} - Строковое представление числа с разделителем.
 */

export const separateThousand = (number: number | string) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
