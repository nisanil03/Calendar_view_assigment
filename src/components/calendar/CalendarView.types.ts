import type { CalendarEvent, CalendarViewMode } from '../../types/calendar.types';

export type CalendarViewProps = {
  initialDate?: Date;
  initialView?: CalendarViewMode;
  events?: CalendarEvent[];
  onEventCreate?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
};

export type CalendarViewState = {
  currentDate: Date;
  view: CalendarViewMode;
  selectedDate: Date | null;
};

