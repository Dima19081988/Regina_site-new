export const getDateString = (year: number, month: number, day: number): string => {
  const date = new Date(year, month, day);
  return date.toISOString().split('T')[0];
};