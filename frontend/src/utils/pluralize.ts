export const pluralize = (count: number): string => {
  if (count === 1) return 'запись';
  if (count > 1 && count < 5) return 'записи';
  return 'записей';
};

export const pluralizePortfolio = (count: number): string => {
  if (count === 1) return 'работа';
  if (count > 1 && count < 5) return 'работы';
  return 'работ';
};
