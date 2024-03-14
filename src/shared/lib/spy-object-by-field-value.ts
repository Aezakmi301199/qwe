import { transformToCorrectValue } from './transform-to-correct-value';

type spyObjectByFieldValueProps = {
  object: Record<string, string | number | boolean | undefined | null>;
  exceptionTransformField?: string[];
};

export const spyObjectByFieldValue = ({ object, exceptionTransformField }: spyObjectByFieldValueProps) => {
  return Object.keys(object).reduce(
    (acc, fieldName) => {
      acc[fieldName] = exceptionTransformField?.includes(fieldName)
        ? (acc[fieldName] = object[fieldName])
        : transformToCorrectValue(object[fieldName]);

      return acc;
    },
    {} as Record<keyof typeof object, string | number | boolean | undefined | null>,
  );
};

export const numberToString = (object: Record<string, any>) => {
  return Object.keys(object).reduce(
    (acc, fieldName) => {
      acc[fieldName] = typeof object[fieldName] === 'number' ? String(object[fieldName]) : object[fieldName];

      return acc;
    },
    {} as Record<string, any>,
  );
};
