import React from 'react';
import {
  clampDate,
  getMonthGrid,
  getMonthLabel,
  getWeekdayLabels,
  isInDisplayedMonth,
  isSameDay,
  isSameDate,
  moveByDays,
  moveByMonths,
  moveByWeeks,
  moveByYears,
  type WeekStartsOn,
} from '../../lib/date';

export type CalendarProps = {
  date?: Date;
  weekStartsOn?: WeekStartsOn;
  onDateClick?: (day: Date) => void;
  onMonthChange?: (visibleMonth: Date) => void;
  selectedDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (day: Date) => boolean;
  id?: string;
  'aria-label'?: string;
};

export function Calendar({
  date = new Date(),
  weekStartsOn = 0,
  onDateClick,
  onMonthChange,
  selectedDate,
  minDate,
  maxDate,
  isDateDisabled,
  id,
  'aria-label': ariaLabel = 'Calendar',
}: CalendarProps) {
  const clampedVisible = React.useMemo(() => clampDate(date, minDate, maxDate), [date, minDate, maxDate]);
  const weeks = React.useMemo(() => getMonthGrid(clampedVisible, weekStartsOn), [clampedVisible, weekStartsOn]);
  const weekdayLabels = React.useMemo(() => getWeekdayLabels(weekStartsOn), [weekStartsOn]);
  const today = new Date();
  const [focusedDay, setFocusedDay] = React.useState<Date>(selectedDate ?? today);

  React.useEffect(() => {
    // Keep focus within the visible month when month changes
    if (!isInDisplayedMonth(focusedDay, clampedVisible)) {
      setFocusedDay(new Date(clampedVisible.getFullYear(), clampedVisible.getMonth(), 1));
    }
  }, [clampedVisible]);

  React.useEffect(() => {
    if (selectedDate) setFocusedDay(selectedDate);
  }, [selectedDate]);

  const gridLabelId = React.useId();

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    let next = focusedDay;
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        next = moveByDays(focusedDay, -1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        next = moveByDays(focusedDay, 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        next = moveByWeeks(focusedDay, -1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        next = moveByWeeks(focusedDay, 1);
        break;
      case 'PageUp':
        e.preventDefault();
        next = e.shiftKey ? moveByYears(focusedDay, -1) : moveByMonths(focusedDay, -1);
        onMonthChange?.(new Date(clampedVisible.getFullYear(), clampedVisible.getMonth() - 1, 1));
        break;
      case 'PageDown':
        e.preventDefault();
        next = e.shiftKey ? moveByYears(focusedDay, 1) : moveByMonths(focusedDay, 1);
        onMonthChange?.(new Date(clampedVisible.getFullYear(), clampedVisible.getMonth() + 1, 1));
        break;
      case 'Home':
        e.preventDefault();
        next = moveByDays(focusedDay, -((focusedDay.getDay() - weekStartsOn + 7) % 7));
        break;
      case 'End':
        e.preventDefault();
        next = moveByDays(focusedDay, 6 - ((focusedDay.getDay() - weekStartsOn + 7) % 7));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isDisabled(focusedDay)) onDateClick?.(focusedDay);
        return;
      default:
        return;
    }
    if (!isDisabled(next)) setFocusedDay(next);
  };

  const isDisabled = (d: Date) => {
    if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    if (isDateDisabled?.(d)) return true;
    return false;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 id={gridLabelId} className="text-xl font-semibold">
          {getMonthLabel(clampedVisible)}
        </h2>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded border"
            aria-label="Previous month"
            onClick={() => onMonthChange?.(new Date(clampedVisible.getFullYear(), clampedVisible.getMonth() - 1, 1))}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 rounded border"
            aria-label="Today"
            onClick={() => onMonthChange?.(new Date())}
          >
            Today
          </button>
          <button
            className="px-3 py-1 rounded border"
            aria-label="Next month"
            onClick={() => onMonthChange?.(new Date(clampedVisible.getFullYear(), clampedVisible.getMonth() + 1, 1))}
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-xs font-medium text-gray-500 dark:text-gray-400">
        {weekdayLabels.map((label) => (
          <div key={label} className="px-2 py-1 text-center">{label}</div>
        ))}
      </div>

      <div
        id={id}
        role="grid"
        aria-labelledby={gridLabelId}
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="grid grid-cols-7 gap-px rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800"
      >
        {weeks.flat().map((day, idx) => {
          const inMonth = isInDisplayedMonth(day, date);
          const isToday = isSameDay(day, today);
          const isSelected = isSameDate(day, selectedDate);
          const disabled = isDisabled(day);
          return (
            <div key={idx} className={inMonth ? '' : 'opacity-40'}>
              <button
                role="gridcell"
                aria-selected={isSelected || undefined}
                aria-disabled={disabled || undefined}
                tabIndex={isSameDate(day, focusedDay) ? 0 : -1}
                disabled={disabled}
                onClick={() => !disabled && onDateClick?.(day)}
                className={[
                  'aspect-square w-full bg-white dark:bg-gray-950 p-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                  isToday ? 'ring-1 ring-blue-500' : '',
                  isSelected ? 'bg-blue-50 dark:bg-blue-950/40' : '',
                  disabled ? 'cursor-not-allowed opacity-40' : '',
                ].join(' ')}
              >
                <div className="text-sm">{day.getDate()}</div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
