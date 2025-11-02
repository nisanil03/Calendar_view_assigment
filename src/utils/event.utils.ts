import { differenceInMinutes, isAfter, isBefore, isEqual } from 'date-fns';
import type { CalendarEvent } from '../types/calendar.types';

export function doEventsOverlap(a: CalendarEvent, b: CalendarEvent): boolean {
  const startsBeforeEnd = isBefore(a.startDate, b.endDate) || isEqual(a.startDate, b.endDate);
  const endsAfterStart = isAfter(a.endDate, b.startDate) || isEqual(a.endDate, b.startDate);
  return startsBeforeEnd && endsAfterStart;
}

export function groupOverlappingEvents(events: CalendarEvent[]): CalendarEvent[][] {
  const sorted = [...events].sort((x, y) => x.startDate.getTime() - y.startDate.getTime());
  const groups: CalendarEvent[][] = [];
  for (const evt of sorted) {
    let placed = false;
    for (const group of groups) {
      if (group.every((g) => doEventsOverlap(g, evt))) {
        group.push(evt);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push([evt]);
  }
  return groups;
}

export function minutesSinceStartOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function eventDurationMinutes(event: CalendarEvent): number {
  return Math.max(15, differenceInMinutes(event.endDate, event.startDate));
}

export const sampleEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Team Standup',
    description: 'Daily sync with the team',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 9, 0),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 9, 30),
    color: '#3b82f6',
    category: 'Meeting',
  },
  {
    id: 'evt-2',
    title: 'Design Review',
    description: 'Review new component designs',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 14, 0),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 15, 30),
    color: '#10b981',
    category: 'Design',
  },
  {
    id: 'evt-3',
    title: 'Client Presentation',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 16, 10, 0),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 16, 11, 30),
    color: '#f59e0b',
    category: 'Meeting',
  },
];


