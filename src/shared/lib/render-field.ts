export const renderField = (value: number | string | undefined, label: string) => {
  if (value !== undefined) {
    return `${value}${label}`;
  }

  return null;
};
