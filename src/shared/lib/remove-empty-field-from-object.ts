type Obj = { [key: string]: any };

export const swapEmptyValueStringOnNull = (value: string | null) => {
  return value !== '' ? value : null;
};

type filterFieldFromObjectProps = {
  object: Obj;
  isFilterEmptyString?: boolean;
  isFilterNull?: boolean;
  isFilterUndefined?: boolean;
  isEmptyArray?: boolean;
};

export const filterFieldFromObject = ({
  object,
  isFilterEmptyString,
  isFilterNull,
  isFilterUndefined,
  isEmptyArray,
}: filterFieldFromObjectProps): Obj => {
  const result: Obj = {};

  Object.keys(object).forEach((key) => {
    const value = object[key];
    const conditionFilterEmptyString = isFilterEmptyString && value === '';
    const conditionFilterEmptyArray = Array.isArray(value) && !value.length && isEmptyArray;
    const conditionFilterNull = isFilterNull && value === null;
    const conditionFilterUndefined = isFilterUndefined && value === undefined;

    if (conditionFilterEmptyString || conditionFilterNull || conditionFilterUndefined || conditionFilterEmptyArray) {
      return;
    }

    return (result[key] = object[key]);
  });

  return result;
};
