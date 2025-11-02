import React from 'react';
import { format } from 'date-fns';
import { useCalendar } from '../../hooks/useCalendar';
import { useEventManager } from '../../hooks/useEventManager';
import MonthView from './MonthView';
import WeekView from './WeekView';
import MobileListView from './MobileListView';
import EventModal from './EventModal';
import type { CalendarEvent } from '../../types/calendar.types';

export function CalendarView() {
  const { currentDate, view, setView, goToNextMonth, goToPreviousMonth, goToToday, setCurrentDate } = useCalendar();
  const { events, createEvent, updateEvent, deleteEvent } = useEventManager();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CalendarEvent | undefined>(undefined);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openCreate = React.useCallback(() => {
    setEditing(undefined);
    setModalOpen(true);
  }, []);

  const openEdit = React.useCallback((evt: CalendarEvent) => {
    setEditing(evt);
    setModalOpen(true);
  }, []);

  const handleSubmit = React.useCallback(
    (data: Omit<CalendarEvent, 'id'> & { id?: string }) => {
      if (data.id) {
        updateEvent(data.id, data);
      } else {
        createEvent({
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          color: data.color,
        });
      }
      setModalOpen(false);
    },
    [createEvent, updateEvent]
  );

  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [events]);

  const header = (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded border text-sm" onClick={goToPreviousMonth}>Prev</button>
          <button className="px-3 py-1 rounded border text-sm" onClick={goToToday}>Today</button>
          <button className="px-3 py-1 rounded border text-sm" onClick={goToNextMonth}>Next</button>
        </div>
        <div className="flex-1 flex items-center gap-2">
          {!isMobile && (
            <>
              <button
                className={[
                  'px-3 py-1 rounded border transition-colors text-sm',
                  view === 'month'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900',
                ].join(' ')}
                onClick={() => setView('month')}
              >
                Month
              </button>
              <button
                className={[
                  'px-3 py-1 rounded border transition-colors text-sm',
                  view === 'week'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900',
                ].join(' ')}
                onClick={() => setView('week')}
              >
                Week
              </button>
            </>
          )}
          <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm ml-auto" onClick={openCreate}>
            New Event
          </button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="space-y-4">
        {header}
        <MobileListView
          date={currentDate}
          events={events}
          onEventClick={openEdit}
          onDateClick={openCreate}
          onMonthChange={(newDate) => {
            setCurrentDate(newDate);
          }}
        />
        <EventModal
          open={modalOpen}
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          onDelete={(id) => {
            deleteEvent(id);
            setModalOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex gap-4 lg:gap-6">
      <div className="flex-1 space-y-4">
        {header}
        <div className="md:sticky md:top-20">
          {view === 'month' ? (
            <MonthView date={currentDate} events={events} onEventClick={openEdit} onDateClick={() => {}} />
          ) : (
            <WeekView date={currentDate} events={events} onEventClick={openEdit} onCreateEvent={(evt) => createEvent(evt)} />
          )}
        </div>
      </div>

      {/* Desktop Sidebar - Event List */}
      <aside className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-2">
            {sortedEvents.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 py-4">No events scheduled</div>
            ) : (
              sortedEvents.map((evt) => (
                <button
                  key={evt.id}
                  onClick={() => openEdit(evt)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: evt.color ?? '#3b82f6' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{evt.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {format(evt.startDate, 'MMM d, h:mm a')}
                      </div>
                      {evt.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">{evt.description}</div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      <EventModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        onDelete={(id) => {
          deleteEvent(id);
          setModalOpen(false);
        }}
      />
    </div>
  );
}

export default CalendarView;


