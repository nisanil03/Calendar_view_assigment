export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  category?: string;
};

export type CalendarViewMode = 'month' | 'week';


