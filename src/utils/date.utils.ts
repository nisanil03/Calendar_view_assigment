/**
 * Calculates the number of days between two dates
 * @param start - Start date
 * @param end - End date
 * @returns Number of days (can be negative if end is before start)
 */
export const daysBetween = (start: Date, end: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const startMs = start.getTime();
  const endMs = end.getTime();
  return Math.floor((endMs - startMs) / msPerDay);
};

/**
 * Checks if two dates fall on the same day (ignores time)
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Gets all days in a month
 */
export const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysCount = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysCount }, (_, i) => new Date(year, month, i + 1));
};

/**
 * Gets the calendar grid (42 cells for month view)
 */
export const getCalendarGrid = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDay);
  const grid: Date[] = [];
  for (let i = 0; i < 42; i++) {
    grid.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }
  return grid;
};

/**
 * Formats a date for display
 */
export const formatDate = (date: Date, formatStr: string = 'MMM d, yyyy'): string => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  if (formatStr === 'MMM d, yyyy') {
    return `${monthNames[month]} ${day}, ${year}`;
  }
  return date.toLocaleDateString();
};

