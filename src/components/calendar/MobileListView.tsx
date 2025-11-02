import React from 'react';
import { format } from 'date-fns';
import type { CalendarEvent } from '../../types/calendar.types';
import { isSameDay } from '../../utils/date.utils';

export type MobileListViewProps = {
  date?: Date;
  events?: CalendarEvent[];
  onDateClick?: (day: Date) => void;
  onEventClick?: (evt: CalendarEvent) => void;
  onMonthChange?: (date: Date) => void;
};

export function MobileListView({ date = new Date(), events = [], onDateClick, onEventClick, onMonthChange }: MobileListViewProps) {
  const [expandedDays, setExpandedDays] = React.useState<Set<string>>(new Set());
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  
  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;
  
  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const key = new Date(e.startDate.getFullYear(), e.startDate.getMonth(), e.startDate.getDate()).toISOString();
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    return map;
  }, [events]);

  const daysInMonth = React.useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysCount = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => new Date(year, month, i + 1));
  }, [date]);

  const toggleDay = (day: Date) => {
    const key = day.toISOString();
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onMonthChange) {
      // Swipe left = next month
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      onMonthChange(nextMonth);
    }
    if (isRightSwipe && onMonthChange) {
      // Swipe right = previous month
      const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      onMonthChange(prevMonth);
    }
  };

  return (
    <div
      className="w-full space-y-2"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <h2 className="text-xl font-semibold mb-4">{format(date, 'MMMM yyyy')}</h2>
      {daysInMonth.map((day) => {
        const key = day.toISOString();
        const dayEvents = eventsByDay.get(key) ?? [];
        const isExpanded = expandedDays.has(key);
        const isToday = isSameDay(day, new Date());
        
        return (
          <div key={key} className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
            <button
              onClick={() => toggleDay(day)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <div className="flex items-center gap-3">
                <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900 dark:text-gray-100'}`}>
                  {format(day, 'EEE')}
                </div>
                <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900 dark:text-gray-100'}`}>
                  {day.getDate()}
                </div>
                {dayEvents.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isExpanded && (
              <div className="px-3 pb-3 space-y-2 border-t border-gray-200 dark:border-gray-800">
                {dayEvents.length === 0 ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400 py-2">No events</div>
                ) : (
                  dayEvents.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => onEventClick?.(evt)}
                      className="w-full text-left p-2 rounded text-sm"
                      style={{ backgroundColor: evt.color ? `${evt.color}20` : '#e5e7eb20' }}
                    >
                      <div className="font-semibold">{evt.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {format(evt.startDate, 'h:mm a')} - {format(evt.endDate, 'h:mm a')}
                      </div>
                    </button>
                  ))
                )}
                <button
                  onClick={() => onDateClick?.(day)}
                  className="w-full text-left p-2 text-sm text-blue-600 hover:underline"
                >
                  + Add event
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MobileListView;

