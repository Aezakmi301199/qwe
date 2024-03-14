export const getInitials = (value: string) => {
  return value
    .split(' ')
    .map((name) => name[0].toUpperCase())
    .join('');
};
