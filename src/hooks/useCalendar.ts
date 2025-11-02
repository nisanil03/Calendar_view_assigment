import { useCallback, useState } from 'react';
import type { CalendarViewMode } from '../types/calendar.types';

export type CalendarState = {
  currentDate: Date;
  view: CalendarViewMode;
  selectedDate: Date | null;
};

export const useCalendar = (initialDate: Date = new Date()) => {
  const [state, setState] = useState<CalendarState>({
    currentDate: initialDate,
    view: 'month',
    selectedDate: null,
  });

  const goToNextMonth = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentDate: new Date(prev.currentDate.getFullYear(), prev.currentDate.getMonth() + 1, 1),
    }));
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentDate: new Date(prev.currentDate.getFullYear(), prev.currentDate.getMonth() - 1, 1),
    }));
  }, []);

  const goToToday = useCallback(() => {
    setState((prev) => ({ ...prev, currentDate: new Date() }));
  }, []);

  const setView = useCallback((view: CalendarViewMode) => {
    setState((prev) => ({ ...prev, view }));
  }, []);

  const setSelectedDate = useCallback((date: Date | null) => {
    setState((prev) => ({ ...prev, selectedDate: date }));
  }, []);

  const setCurrentDate = useCallback((date: Date) => {
    setState((prev) => ({ ...prev, currentDate: date }));
  }, []);

  return { ...state, goToNextMonth, goToPreviousMonth, goToToday, setView, setSelectedDate, setCurrentDate };
};


