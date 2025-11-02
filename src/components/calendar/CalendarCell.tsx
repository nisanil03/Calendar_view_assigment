import React, { useCallback, useMemo } from 'react';
import type { CalendarEvent } from '../../types/calendar.types';

export type CalendarCellProps = {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isSelected: boolean;
  onClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
};

export const CalendarCell: React.FC<CalendarCellProps> = ({ date, events, isToday, isSelected, onClick, onEventClick }) => {
  const handleClick = useCallback(() => onClick(date), [date, onClick]);
  const eventCount = useMemo(() => events.length, [events]);
  const topThree = useMemo(() => events.slice(0, 3), [events]);

  return (
    <button
      onClick={handleClick}
      className={[
        'aspect-square w-full bg-white dark:bg-gray-950 p-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        isToday ? 'ring-1 ring-blue-500' : '',
        isSelected ? 'bg-blue-50 dark:bg-blue-950/40' : '',
      ].join(' ')}
    >
      <div className="text-sm mb-1">{date.getDate()}</div>
      <div className="space-y-1">
        {topThree.map((ev) => (
          <div key={ev.id} className="text-xs px-2 py-1 rounded truncate" style={{ backgroundColor: ev.color ?? '#e5e7eb' }} onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}>
            {ev.title}
          </div>
        ))}
        {eventCount > 3 && (
          <div className="text-xs text-blue-600 hover:underline">+{eventCount - 3} more</div>
        )}
      </div>
    </button>
  );
};

export default React.memo(CalendarCell);


