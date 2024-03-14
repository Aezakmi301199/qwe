export const convertEnumWithNumberToArray = (Enum: Record<string | number, string | number>) => {
  const arrayObjects = [];

  for (const [propertyKey] of Object.entries(Enum)) {
    if (Number.isNaN(Number(propertyKey))) {
      continue;
    }

    arrayObjects.push(Number(propertyKey));
  }

  return arrayObjects;
};
