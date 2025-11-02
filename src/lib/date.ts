import { addDays as dfAddDays, addMonths, addWeeks, addYears, endOfMonth, endOfWeek, format, isAfter, isBefore, isEqual, isSameDay as dfIsSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun

export function addDays(date: Date, days: number): Date {
  return dfAddDays(date, days);
}

export function isSameDay(a: Date, b: Date): boolean {
  return dfIsSameDay(a, b);
}

export function getMonthLabel(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function getMonthGridStart(date: Date, weekStartsOn: WeekStartsOn): Date {
  const firstOfMonth = startOfMonth(date);
  return startOfWeek(firstOfMonth, { weekStartsOn });
}

export function getMonthGridEnd(date: Date, weekStartsOn: WeekStartsOn): Date {
  const lastOfMonth = endOfMonth(date);
  return endOfWeek(lastOfMonth, { weekStartsOn });
}

export function getMonthGrid(date: Date, weekStartsOn: WeekStartsOn): Date[][] {
  const start = getMonthGridStart(date, weekStartsOn);
  const end = getMonthGridEnd(date, weekStartsOn);
  const weeks: Date[][] = [];
  let cursor = start;
  while (cursor <= end) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export function isInDisplayedMonth(day: Date, month: Date): boolean {
  return isSameMonth(day, month);
}

export function getWeekdayLabels(weekStartsOn: WeekStartsOn): string[] {
  const base = new Date(2020, 10, 1); // arbitrary Sunday
  const start = startOfWeek(base, { weekStartsOn });
  return Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), 'EEE'));
}

export function clampDate(date: Date, minDate?: Date, maxDate?: Date): Date {
  if (minDate && isBefore(date, minDate)) return minDate;
  if (maxDate && isAfter(date, maxDate)) return maxDate;
  return date;
}

export function isDisabledDate(date: Date, opts: { minDate?: Date; maxDate?: Date; disabledPredicate?: (d: Date) => boolean } = {}): boolean {
  const { minDate, maxDate, disabledPredicate } = opts;
  if (minDate && isBefore(date, minDate)) return true;
  if (maxDate && isAfter(date, maxDate)) return true;
  if (disabledPredicate?.(date)) return true;
  return false;
}

export const moveByDays = (date: Date, days: number) => dfAddDays(date, days);
export const moveByWeeks = (date: Date, weeks: number) => addWeeks(date, weeks);
export const moveByMonths = (date: Date, months: number) => addMonths(date, months);
export const moveByYears = (date: Date, years: number) => addYears(date, years);

export const isSameDate = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!(a && b) && isEqual(new Date(a), new Date(b));

