import React from 'react';
import { getMonthGrid, getMonthLabel, getWeekdayLabels, isInDisplayedMonth, isSameDay } from '../../lib/date';
import type { CalendarEvent } from '../../types/calendar.types';
import CalendarCell from './CalendarCell';

export type MonthViewProps = {
  date?: Date;
  weekStartsOn?: 0 | 1;
  events?: CalendarEvent[];
  onDateClick?: (day: Date) => void;
  onEventClick?: (e: CalendarEvent) => void;
};

export function MonthView({ date = new Date(), weekStartsOn = 0, events = [], onDateClick, onEventClick }: MonthViewProps) {
  const weeks = React.useMemo(() => getMonthGrid(date, weekStartsOn), [date, weekStartsOn]);
  const weekdayLabels = React.useMemo(() => getWeekdayLabels(weekStartsOn), [weekStartsOn]);
  const today = new Date();

  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const key = new Date(e.startDate.getFullYear(), e.startDate.getMonth(), e.startDate.getDate()).toDateString();
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    return map;
  }, [events]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{getMonthLabel(date)}</h2>
      </div>
      <div className="grid grid-cols-7 text-xs font-medium text-gray-500 dark:text-gray-400">
        {weekdayLabels.map((label) => (
          <div key={label} className="px-2 py-1 text-center">{label}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
        {weeks.flat().map((day, idx) => {
          const inMonth = isInDisplayedMonth(day, date);
          const isToday = isSameDay(day, today);
          const key = day.toDateString();
          const dayEvents = eventsByDay.get(key) ?? [];
          return (
            <div key={idx} className={inMonth ? '' : 'opacity-40'}>
              <CalendarCell
                date={day}
                events={dayEvents}
                isToday={isToday}
                isSelected={false}
                onClick={(d) => onDateClick?.(d)}
                onEventClick={(e) => onEventClick?.(e)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthView;


