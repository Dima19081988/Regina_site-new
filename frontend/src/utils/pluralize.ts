export const pluralize = (count: number): string => {
  if (count === 1) return 'запись';
  if (count > 1 && count < 5) return 'записи';
  return 'записей';
};
