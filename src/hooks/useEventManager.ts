import { useCallback, useMemo, useState } from 'react';
import type { CalendarEvent } from '../types/calendar.types';
import { sampleEvents } from '../utils/event.utils';

export const useEventManager = (initial: CalendarEvent[] = sampleEvents) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initial);

  const createEvent = useCallback((evt: Omit<CalendarEvent, 'id'>) => {
    const id = `evt-${Math.random().toString(36).slice(2)}`;
    const created: CalendarEvent = { id, ...evt } as CalendarEvent;
    setEvents((prev) => [...prev, created]);
    return created;
  }, []);

  const updateEvent = useCallback((id: string, next: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...next } : e)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const key = new Date(e.startDate.getFullYear(), e.startDate.getMonth(), e.startDate.getDate()).toISOString();
      const arr = map.get(key) ?? [];
      arr.push(e);
      map.set(key, arr);
    }
    return map;
  }, [events]);

  return { events, createEvent, updateEvent, deleteEvent, byDay };
};


