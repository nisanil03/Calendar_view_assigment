import React from 'react';
import type { CalendarEvent } from '../../types/calendar.types';
import { addDays, startOfWeek } from 'date-fns';
import { eventDurationMinutes, minutesSinceStartOfDay } from '../../utils/event.utils';

export type WeekViewProps = {
  weekStartsOn?: 0 | 1;
  date?: Date;
  events?: CalendarEvent[];
  intervalMinutes?: 30 | 60;
  onEventClick?: (evt: CalendarEvent) => void;
  onCreateEvent?: (evt: Omit<CalendarEvent, 'id'>) => void;
};

export function WeekView({ weekStartsOn = 0, date = new Date(), events = [], intervalMinutes = 60, onEventClick, onCreateEvent }: WeekViewProps) {
  const start = React.useMemo(() => startOfWeek(date, { weekStartsOn }), [date, weekStartsOn]);
  const days = React.useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(start, i)), [start]);

  // Compute per-day layout for overlapping events (column assignment)
  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const key = e.startDate.toDateString();
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    return map;
  }, [events]);

  const layoutForDay = (list: CalendarEvent[]) => {
    // Simple greedy column assignment
    const sorted = [...list].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const columns: CalendarEvent[][] = [];
    const placements: { id: string; col: number; cols: number }[] = [];
    for (const e of sorted) {
      let placed = false;
      for (let c = 0; c < columns.length; c++) {
        const lastInCol = columns[c][columns[c].length - 1];
        const ends = lastInCol.endDate.getTime();
        if (ends <= e.startDate.getTime()) {
          columns[c].push(e);
          placements.push({ id: e.id, col: c, cols: 0 });
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([e]);
        placements.push({ id: e.id, col: columns.length - 1, cols: 0 });
      }
    }
    const totalCols = columns.length || 1;
    return { placements: placements.map((p) => ({ ...p, cols: totalCols })), totalCols };
  };

  // Drag-to-create state
  const [dragging, setDragging] = React.useState<{ dayIndex: number; startMin: number; endMin: number } | null>(null);
  const colRef = React.useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseDown = (dayIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
    const el = colRef.current[dayIndex];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    const min = Math.round((y / rect.height) * 24 * 60);
    setDragging({ dayIndex, startMin: min, endMin: min + intervalMinutes });
  };
  const handleMouseMove = (dayIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || dragging.dayIndex !== dayIndex) return;
    const el = colRef.current[dayIndex];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    const min = Math.round((y / rect.height) * 24 * 60);
    setDragging((d) => (d ? { ...d, endMin: Math.max(min, d.startMin + 15) } : d));
  };
  const handleMouseUp = (dayIndex: number) => {
    if (!dragging || dragging.dayIndex !== dayIndex) return;
    const base = days[dayIndex];
    const startDate = new Date(base.getFullYear(), base.getMonth(), base.getDate(), Math.floor(dragging.startMin / 60), dragging.startMin % 60);
    const endDate = new Date(base.getFullYear(), base.getMonth(), base.getDate(), Math.floor(dragging.endMin / 60), dragging.endMin % 60);
    onCreateEvent?.({ title: 'New Event', startDate, endDate, color: '#3b82f6', description: '' });
    setDragging(null);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-800 text-xs">
        {days.map((d) => (
          <div key={d.toISOString()} className="bg-white dark:bg-gray-950 p-2 font-medium text-gray-600 dark:text-gray-300">
            {d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-800 select-none">
        {days.map((d, idx) => {
          const dayEvents = eventsByDay.get(d.toDateString()) ?? [];
          const { placements } = layoutForDay(dayEvents);
          return (
            <div
              key={d.toISOString()}
              className="relative h-[88rem] bg-white dark:bg-gray-950"
              ref={(el) => { colRef.current[idx] = el; }}
              onMouseDown={(e) => handleMouseDown(idx, e)}
              onMouseMove={(e) => handleMouseMove(idx, e)}
              onMouseUp={() => handleMouseUp(idx)}
            >
              {Array.from({ length: 24 * (60 / intervalMinutes) }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-gray-200/70 dark:border-gray-800/70"
                  style={{ top: `${(i / (24 * (60 / intervalMinutes))) * 100}%`, opacity: i % (60 / intervalMinutes) === 0 ? 1 : 0.5 }}
                />
              ))}
              {dayEvents.map((e) => {
                const topMin = minutesSinceStartOfDay(e.startDate);
                const durMin = eventDurationMinutes(e);
                const topPct = (topMin / (24 * 60)) * 100;
                const heightPct = (durMin / (24 * 60)) * 100;
                const place = placements.find((p) => p.id === e.id)!;
                const widthPct = 100 / place.cols;
                const leftPct = place.col * widthPct;
                return (
                  <button
                    key={e.id}
                    onClick={() => onEventClick?.(e)}
                    className="absolute rounded-md text-left text-xs px-2 py-1 shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    style={{
                      top: `${topPct}%`,
                      height: `${heightPct}%`,
                      left: `${leftPct}%`,
                      width: `calc(${widthPct}% - 4px)`,
                      backgroundColor: e.color ?? '#3b82f6',
                      color: 'white',
                    }}
                  >
                    <div className="font-semibold truncate">{e.title}</div>
                  </button>
                );
              })}
              {dragging && dragging.dayIndex === idx && (
                <div
                  className="absolute left-0 right-0 bg-blue-500/30 border border-blue-500 rounded"
                  style={{
                    top: `${(dragging.startMin / (24 * 60)) * 100}%`,
                    height: `${((dragging.endMin - dragging.startMin) / (24 * 60)) * 100}%`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeekView;


