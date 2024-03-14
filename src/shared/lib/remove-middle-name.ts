export const removeMiddleName = (fullName: string) => {
  return fullName.split(' ').slice(0, 2).join(' ');
};
